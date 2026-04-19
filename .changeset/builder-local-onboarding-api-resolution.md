---
"@contractspec/bundle.workspace": patch
"@contractspec/app.cli-contractspec": patch
---

Fix Builder local onboarding so setup writes the Builder API defaults, `contractspec builder` resolves control-plane settings from workspace config, and missing auth errors render as concise CLI failures instead of raw bundled stack traces.
