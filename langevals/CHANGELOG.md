# Changelog

## [2.3.0](https://github.com/langwatch/langwatch/compare/langevals@v2.2.0...langevals@v2.3.0) (2026-06-09)


### Features

* **langevals:** stage large payloads to S3 via presigned URL ([#4189](https://github.com/langwatch/langwatch/issues/4189)) ([7e994ce](https://github.com/langwatch/langwatch/commit/7e994ce9e5481e0f32dbe2b6038d1db93b19d66c))


### Bug Fixes

* **deps:** close 6 langevals security alerts with minimal stable bumps ([1467908](https://github.com/langwatch/langwatch/commit/14679085c750c94f7b583ca7479b4e76cc58ff23))
* **deps:** close 6 langevals security alerts with minimal stable bumps (no prerelease, no downgrade) ([#4654](https://github.com/langwatch/langwatch/issues/4654)) ([1467908](https://github.com/langwatch/langwatch/commit/14679085c750c94f7b583ca7479b4e76cc58ff23))
* **deps:** close langevals transformers and strawberry-graphql security alerts ([#4656](https://github.com/langwatch/langwatch/issues/4656)) ([50b3250](https://github.com/langwatch/langwatch/commit/50b32501a58165a75286024e1901c3f22862151c))
* **deps:** upgrade google-cloud-aiplatform to &gt;= 1.133.0 ([#3706](https://github.com/langwatch/langwatch/issues/3706)) ([123511a](https://github.com/langwatch/langwatch/commit/123511a20f20c5d7a938f8574cb03571aa5f6524))
* **deps:** upgrade langsmith sdk security floors ([2e18927](https://github.com/langwatch/langwatch/commit/2e18927c0c1c1fdec24c2bba17e5f094e56a9deb))
* **deps:** upgrade LangSmith SDK security floors ([#4041](https://github.com/langwatch/langwatch/issues/4041)) ([2e18927](https://github.com/langwatch/langwatch/commit/2e18927c0c1c1fdec24c2bba17e5f094e56a9deb))
* **deps:** upgrade nltk, authlib (Dependabot [#612](https://github.com/langwatch/langwatch/issues/612), [#522](https://github.com/langwatch/langwatch/issues/522), [#592](https://github.com/langwatch/langwatch/issues/592), [#593](https://github.com/langwatch/langwatch/issues/593), [#594](https://github.com/langwatch/langwatch/issues/594)) ([#3659](https://github.com/langwatch/langwatch/issues/3659)) ([0576cc0](https://github.com/langwatch/langwatch/commit/0576cc0bafa041bb83dd938e7d5c8f6df6d236ce))
* **deps:** upgrade nltk, authlib to resolve security alerts ([0576cc0](https://github.com/langwatch/langwatch/commit/0576cc0bafa041bb83dd938e7d5c8f6df6d236ce))
* **deps:** upgrade strawberry-graphql to 0.314.3 (Dependabot [#781](https://github.com/langwatch/langwatch/issues/781), [#782](https://github.com/langwatch/langwatch/issues/782)) ([#3675](https://github.com/langwatch/langwatch/issues/3675)) ([9d993d9](https://github.com/langwatch/langwatch/commit/9d993d9fb8cbc44f163ba956c6c764e6fdd43578))
* **deps:** upgrade tornado, urllib3, cryptography (Dependabot) ([#3657](https://github.com/langwatch/langwatch/issues/3657)) ([f8a2e9a](https://github.com/langwatch/langwatch/commit/f8a2e9a5cf6b836524bc2a170d589e1a01ad3921))
* **deps:** upgrade tornado, urllib3, cryptography to resolve security alerts ([f8a2e9a](https://github.com/langwatch/langwatch/commit/f8a2e9a5cf6b836524bc2a170d589e1a01ad3921))
* **deps:** upgrade urllib3 to 2.7.0 — decompression-bomb bypass, header forwarding ([#3985](https://github.com/langwatch/langwatch/issues/3985)) ([071cea7](https://github.com/langwatch/langwatch/commit/071cea7c0a4fb094bc6f5a911eefbdc1bb8766c4))
* **deps:** upgrade urllib3 to 2.7.0 — decompression-bomb bypass, header forwarding (alerts [#1071](https://github.com/langwatch/langwatch/issues/1071)-[#1082](https://github.com/langwatch/langwatch/issues/1082)) ([071cea7](https://github.com/langwatch/langwatch/commit/071cea7c0a4fb094bc6f5a911eefbdc1bb8766c4))
* **deps:** uv security sweep across langevals, mcp-server, python-sdk ([#4687](https://github.com/langwatch/langwatch/issues/4687)) ([7eba1fb](https://github.com/langwatch/langwatch/commit/7eba1fbec1cf01b7929b35529c41f5b089070263))
* **evals-v3:** coerce non-string evaluator inputs + lock auto-mapping ([#4642](https://github.com/langwatch/langwatch/issues/4642)) ([914dbd4](https://github.com/langwatch/langwatch/commit/914dbd4109e8f97e178fe2c112ff62b27b9cd0e7))
* **ragas:** migrate Faithfulness _create_statements patch to ragas&gt;=0.3 API ([#4113](https://github.com/langwatch/langwatch/issues/4113)) ([deadb2b](https://github.com/langwatch/langwatch/commit/deadb2b59e3fba5ed9117a2b8e0061f7b1d5ffad))
* **security:** upgrade high-severity pip dependencies (excluding langchain-core) ([#3929](https://github.com/langwatch/langwatch/issues/3929)) ([f2d5de6](https://github.com/langwatch/langwatch/commit/f2d5de6bf619d188c46947f76812a2c3b3ecf39a))


### Miscellaneous

* **deps:** bump the pip group across 9 directories with 2 updates ([#3895](https://github.com/langwatch/langwatch/issues/3895)) ([fb10e26](https://github.com/langwatch/langwatch/commit/fb10e26a2636ec968127c9669a843a801e52d807))
* **security:** add dependency age gates ([#3523](https://github.com/langwatch/langwatch/issues/3523)) ([78f5b20](https://github.com/langwatch/langwatch/commit/78f5b2059228748d19fb4bf74118c9bee6c474f9))


### Code Refactoring

* **types:** make zod the single source of truth, remove ts-to-zod ([#4651](https://github.com/langwatch/langwatch/issues/4651)) ([d583fbe](https://github.com/langwatch/langwatch/commit/d583fbe2ed2ca2ef320695323c17f6c362ea4efa))
