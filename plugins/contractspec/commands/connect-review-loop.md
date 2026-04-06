---
name: connect-review-loop
description: Run ContractSpec Connect before risky edits or shell execution
---

Use ContractSpec Connect as the local review loop before mutating code or running risky commands.

1. Project trusted context:
   - `contractspec connect context --task <task-id> --paths <path...> --json`
2. Classify the candidate plan before mutation:
   - `contractspec connect plan --task <task-id> --stdin --json`
   - Provide JSON such as `{ "objective": "...", "touchedPaths": ["..."], "commands": ["..."] }`
3. Verify the concrete mutation:
   - Filesystem: `contractspec connect verify --task <task-id> --tool acp.fs.access --stdin --json`
   - Terminal: `contractspec connect verify --task <task-id> --tool acp.terminal.exec --stdin --json`
4. Inspect escalations and replay artifacts when needed:
   - `contractspec connect review list --json`
   - `contractspec connect replay <decision-id> --json`
   - `contractspec connect eval <decision-id> --registry <path> --scenario <key> --json`

Exit codes:

- `0` permit or successful non-blocking command
- `10` rewrite required
- `20` human review required
- `30` denied
- `40` config/runtime input is missing or unresolved

Artifacts:

- Latest artifacts: `.contractspec/connect/context-pack.json`, `.contractspec/connect/plan-packet.json`, `.contractspec/connect/patch-verdict.json`
- Audit log: `.contractspec/connect/audit.ndjson`
- Review packets: `.contractspec/connect/review-packets/*.json`
- Decision snapshots: `.contractspec/connect/decisions/<decisionId>/`

When a plan returns `review` or a verify call exits `20`, stop mutating and use the stored review packet plus replay artifacts as the handoff surface.
