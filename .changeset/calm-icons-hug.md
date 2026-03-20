---
"@contractspec/bundle.marketing": minor
"@contractspec/example.agent-console": minor
"@contractspec/example.analytics-dashboard": minor
"@contractspec/example.integration-hub": minor
"@contractspec/example.marketplace": minor
"@contractspec/example.saas-boilerplate": minor
"@contractspec/example.visualization-showcase": minor
"@contractspec/example.workflow-system": minor
"@contractspec/lib.ui-kit-web": patch
"@contractspec/module.examples": minor
---

Roll out ContractSpec visualization examples and template wiring.

- Add a dedicated `visualization-showcase` example package for ContractSpec visualization primitives and design-system wrappers.
- Adopt contract-backed visualization sections in agent-console, analytics-dashboard, marketplace, workflow-system, integration-hub, and saas-boilerplate.
- Register the new showcase in module.examples, marketing previews, sandbox surfaces, and generated LLM package docs.
- Harden the web visualization primitive so chart rendering skips environments without a usable canvas context.
