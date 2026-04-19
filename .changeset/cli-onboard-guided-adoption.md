---
"@contractspec/app.cli-contractspec": minor
"@contractspec/bundle.workspace": minor
"@contractspec/bundle.library": minor
---

Add a CLI-first onboarding flow with shared workspace planning, managed repo guides, and MCP-backed onboarding guidance.

- add `contractspec onboard` to recommend adoption tracks, write managed `AGENTS.md` and `USAGE.md` sections, initialize optional example stubs, and emit Connect onboarding artifacts when enabled
- add a shared onboarding catalog and guided surface-runtime journey in `@contractspec/bundle.workspace`, plus a new `usage-md` setup target and managed markdown merge helpers
- extend the CLI MCP surface and getting-started docs so onboarding tracks, rendered guide artifacts, and next-command suggestions reuse the same onboarding model
