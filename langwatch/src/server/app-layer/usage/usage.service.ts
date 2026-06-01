import { TraceUsageService } from "../../traces/trace-usage.service";
import { EventUsageService } from "../../traces/event-usage.service";
import type { PlanResolver } from "../subscription/plan-provider";
import { TtlCache } from "../../utils/ttlCache";
import { OrganizationNotFoundForTeamError } from "../organizations/errors";
import type { OrganizationService } from "../organizations/organization.service";
import {
  resolveUsageMeter,
  type MeterDecision,
  type UsageUnit,
} from "./usage-meter-policy";
import { buildLimitMessage } from "./limit-message";
import { OrganizationRepository } from "../../repositories/organization.repository";
import { UNLIMITED_MESSAGES } from "../../../../ee/billing/planLimits";

const CACHE_TTL_MS = 30_000; // 30 seconds

export interface UsageLimitResult {
  exceeded: boolean;
  message?: string;
  count?: number;
  maxMessagesPerMonth?: number;
  planName?: string;
}

/**
 * App-layer usage service.
 *
 * Orchestrates: plan → meter policy → counter.
 * The meter policy resolves the counting unit (traces/events) and backend
 * (ClickHouse/ElasticSearch). Counting execution is delegated to
 * TraceUsageService or EventUsageService depending on the resolved meter.
 */
export class UsageService {
  private readonly countCache: TtlCache<number>;
  private readonly decisionCache: TtlCache<MeterDecision>;

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly traceUsageService: TraceUsageService,
    private readonly eventUsageService: EventUsageService,
    private readonly planResolver: PlanResolver,
    private readonly organizationRepository: OrganizationRepository | null,
    private readonly clickhouseAvailable: boolean,
  ) {
    this.countCache = new TtlCache<number>(CACHE_TTL_MS, "ttlcache:usage:count:");
    this.decisionCache = new TtlCache<MeterDecision>(CACHE_TTL_MS, "ttlcache:usage:decision:");
  }

  async checkLimit({ teamId }: { teamId: string }): Promise<UsageLimitResult> {
    const organizationId =
      await this.organizationService.getOrganizationIdByTeamId(teamId);
    if (!organizationId) {
      throw new OrganizationNotFoundForTeamError(teamId);
    }

    const [count, plan] = await Promise.all([
      this.getCurrentMonthCount({ organizationId }),
      this.planResolver(organizationId),
    ]);

    if (count === "unlimited") {
      return { exceeded: false };
    }

    if (count >= plan.maxMessagesPerMonth) {
      // getCurrentMonthCount already warmed the decision cache, so this is a map lookup
      const decision = await this.getCachedMeterDecision(organizationId);
      return {
        exceeded: true,
        message: buildLimitMessage({
          isFree: plan.free,
          limit: plan.maxMessagesPerMonth,
          usageUnit: decision.usageUnit,
        }),
        count,
        maxMessagesPerMonth: plan.maxMessagesPerMonth,
        planName: plan.name,
      };
    }
    return { exceeded: false };
  }

  /**
   * Returns the resolved usage unit for the given organization.
   * Delegates to the cached meter decision.
   */
  async getResolvedUsageUnit({
    organizationId,
  }: {
    organizationId: string;
  }): Promise<UsageUnit> {
    const decision = await this.getCachedMeterDecision(organizationId);
    return decision.usageUnit;
  }

  async getCurrentMonthCount({
    organizationId,
  }: {
    organizationId: string;
  }): Promise<number | "unlimited"> {
    // Skip the heavy ClickHouse query for unlimited plans (e.g. seat-based pricing).
    // The count would never exceed the limit, so querying is wasted work.
    // Returns "unlimited" so callers can distinguish from actual 0 usage.
    const plan = await this.planResolver(organizationId);
    if (plan.maxMessagesPerMonth >= UNLIMITED_MESSAGES) {
      return "unlimited";
    }

    const decision = await this.getCachedMeterDecision(organizationId);
    const cacheKey = `${organizationId}:${decision.usageUnit}`;

    const cached = await this.countCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const projectIds =
      await this.organizationService.getProjectIds(organizationId);
    if (projectIds.length === 0) {
      return 0;
    }

    const counts = await this.countByProjects({
      decision,
      organizationId,
      projectIds,
    });
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    await this.countCache.set(cacheKey, total);

    return total;
  }

  async getCountByProjects({
    organizationId,
    projectIds,
  }: {
    organizationId: string;
    projectIds: string[];
  }): Promise<Array<{ projectId: string; count: number }>> {
    if (projectIds.length === 0) {
      return [];
    }

    const decision = await this.getCachedMeterDecision(organizationId);
    return this.countByProjects({ decision, organizationId, projectIds });
  }

  private async countByProjects({
    decision,
    organizationId,
    projectIds,
  }: {
    decision: MeterDecision;
    organizationId: string;
    projectIds: string[];
  }): Promise<Array<{ projectId: string; count: number }>> {
    if (decision.usageUnit === "events") {
      return this.eventUsageService.getCountByProjects({
        organizationId,
        projectIds,
      });
    }

    return this.traceUsageService.getCountByProjects({
      organizationId,
      projectIds,
    });
  }

  private async getCachedMeterDecision(
    organizationId: string,
  ): Promise<MeterDecision> {
    const cached = await this.decisionCache.get(organizationId);
    if (cached) return cached;

    const decision = await this.resolveMeterDecision(organizationId);
    await this.decisionCache.set(organizationId, decision);
    return decision;
  }

  private async resolveMeterDecision(
    organizationId: string,
  ): Promise<MeterDecision> {
    const pricingModel =
      (await this.organizationRepository?.getPricingModel(organizationId)) ??
      null;
    const plan = await this.planResolver(organizationId);
    const hasValidLicenseOverride = plan.planSource === "license";

    const decision = resolveUsageMeter({
      pricingModel,
      licenseUsageUnit: plan.usageUnit,
      hasValidLicenseOverride,
      isFree: plan.free,
      clickhouseAvailable: this.clickhouseAvailable,
    });

    return decision;
  }

}

