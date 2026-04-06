# contractspec-contracts-spec

Canonical source of truth for the `contractspec-contracts-spec` customer-facing agent configuration product.

This pack drives:

- generated Cursor plugin assets
- generated Claude Code outputs
- generated Codex outputs
- repo-owned generated agent surfaces

The publishable Cursor marketplace artifact is derived from this pack and lives at:

- `packages/apps-registry/cursor-marketplace/plugins/contractspec-contracts-spec`

The marketplace catalog manifest lives at:

- `packages/apps-registry/cursor-marketplace/.cursor-plugin/marketplace.json`

The operational loop is Connect-based:

1. `contractspec connect context`
2. `contractspec connect plan`
3. `contractspec connect verify`
4. `contractspec connect review list`
5. `contractspec connect replay`
6. `contractspec connect eval`

Hook integration uses the executable CLI surface:

- `contractspec connect hook contracts-spec before-file-edit --stdin`
- `contractspec connect hook contracts-spec before-shell-execution --stdin`
- `contractspec connect hook contracts-spec after-file-edit --stdin`
