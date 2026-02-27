---
name: integrations-compatibility-check
description: Run compatibility and library checks for @contractspec/lib.contracts-integrations
---

Run integration release checks:

1. `contractspec impact --baseline main --format markdown`
2. `turbo run typecheck --filter=@contractspec/lib.contracts-integrations`
3. `turbo run test --filter=@contractspec/lib.contracts-integrations`
4. Report breaking deltas and provider migration requirements.
