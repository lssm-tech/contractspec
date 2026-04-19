---
name: reuse-contractspec-surface
description: Resolve reusable workspace or ContractSpec surfaces before creating new code or dependencies
---

# Reuse ContractSpec Surface

Use this skill when a change may duplicate an existing local or ContractSpec OSS surface.

Workflow:

1. Identify the family: `ui`, `contracts`, `integrations`, `runtime`, `sharedLibs`, or `solutions`.
2. Run `contractspec connect adoption resolve --family <family> --stdin --json`.
3. Reuse the top workspace or ContractSpec candidate when Connect returns `rewrite`.
4. Escalate only when Connect returns `require_review` because the result is ambiguous or a new dependency/implementation is still required.
