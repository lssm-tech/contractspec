---
"@contractspec/module.examples": minor
"@contractspec/bundle.marketing": patch
"@contractspec/bundle.library": patch
"@contractspec/app.web-landing": patch
"@contractspec/example.agent-console": patch
"@contractspec/example.ai-chat-assistant": patch
"@contractspec/example.analytics-dashboard": patch
"@contractspec/example.crm-pipeline": patch
"@contractspec/example.integration-hub": patch
"@contractspec/example.learning-journey-registry": patch
"@contractspec/example.marketplace": patch
"@contractspec/example.policy-safe-knowledge-assistant": patch
"@contractspec/example.saas-boilerplate": patch
"@contractspec/example.workflow-system": patch
---

Unify example preview metadata and web-landing preview surfaces across templates and docs.

- add a shared preview registry and helper exports in `@contractspec/module.examples` so preview capability comes from example metadata instead of duplicated allowlists
- move `/templates` inline preview support in `@contractspec/bundle.marketing` onto the shared registry while keeping the route template-only
- broaden `@contractspec/bundle.library` and `@contractspec/app.web-landing` docs example coverage to every public example via a dynamic `/docs/examples/[exampleKey]` route, with inline embeds for UI-backed examples and sandbox/reference fallbacks for the rest
- normalize `entrypoints.ui` on the affected example packages that already publish `./ui` so UI-backed previews are discoverable from the exported `ExampleSpec`
