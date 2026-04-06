---
targets:
  - "*"
description: Require ContractSpec Connect gating for contracts-spec-sensitive edits and commands
cursor:
  description: Require ContractSpec Connect gating for contracts-spec-sensitive edits and commands
  alwaysApply: true
  globs:
    - "**/*"
---

Use ContractSpec Connect as the executable gate for risky `@contractspec/lib.contracts-spec` work.

- Before editing files under `packages/libs/contracts-spec/**`, run the Connect context, plan, and verify loop.
- Before running compatibility or release-impact shell commands, route them through the Connect shell hook flow.
- Treat Connect exit codes as blocking:
  - `0` continue
  - `10` rewrite first
  - `20` human review required
  - `30` denied
  - `40` config/runtime input missing
- Inspect `.contractspec/connect/*` for local evidence and use `contractspec connect review list`, `replay`, and `eval` for escalation and audit.
