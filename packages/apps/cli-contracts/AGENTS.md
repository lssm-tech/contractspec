# AI Agent Guide — `@lssm/app.cli-contracts`

Scope: `packages/apps/cli-contracts/*`

This is the ContractSpec CLI (`contractspec`).

## Docs consumed by MCP

The CLI MCP server serves these markdown files by path:

- `packages/apps/cli-contracts/QUICK_START.md`
- `packages/apps/cli-contracts/QUICK_REFERENCE.md`
- `packages/apps/cli-contracts/README.md`

If you rename/move them, update `packages/bundles/contractspec-studio/src/application/mcp/cliMcp.ts` (`CLI_DOC_PATHS`).

## Local commands

- Dev/watch: `bun run dev`
- Build: `bun run build` (emits `dist/` and `dist/cli.js`)
- Lint: `bun run lint`
