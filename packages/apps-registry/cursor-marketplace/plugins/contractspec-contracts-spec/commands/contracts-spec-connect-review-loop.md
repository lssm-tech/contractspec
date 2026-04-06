---
name: contracts-spec-connect-review-loop
description: Run the Connect review loop for contracts-spec-sensitive work
---
Use the Connect loop before and after risky contracts-spec work:

1. `contractspec connect context --task contracts-spec-task --paths packages/libs/contracts-spec/... --json`
2. `contractspec connect plan --task contracts-spec-task --stdin --json`
3. `contractspec connect verify --task contracts-spec-task --tool acp.fs.access --stdin --json`
4. For shell operations: `contractspec connect verify --task contracts-spec-task --tool acp.terminal.exec --stdin --json`
5. If blocked or escalated, inspect:
   - `contractspec connect review list`
   - `contractspec connect replay <decisionId>`
   - `contractspec connect eval <decisionId> --registry <path> --scenario <key>`
