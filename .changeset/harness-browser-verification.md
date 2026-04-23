---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.harness": minor
"@contractspec/integration.harness-runtime": minor
"@contractspec/app.cli-contractspec": minor
"@contractspec/example.harness-lab": minor
---

Add OSS harness browser verification with shared CLI/runtime orchestration.

This adds `contractspec harness eval`, reuses the same runtime for `contractspec connect eval`, and expands the harness contracts/runtime for full-app verification. Harness scenarios now support typed browser actions, auth profile refs, visual-diff assertions, setup/reset hook execution, required evidence enforcement, and scenario success rules. The runtime keeps Playwright deterministic runs and optional `agent-browser` visual runs separate while preserving replay bundles and redacting auth state through named refs instead of embedded secrets.
