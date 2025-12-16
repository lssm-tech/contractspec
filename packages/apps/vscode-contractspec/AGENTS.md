# AI Agent Guide — `contractspec` VS Code Extension

Scope: `packages/apps/vscode-contractspec/*`

This is the ContractSpec VS Code extension. It provides spec validation, scaffolding, and MCP integration.

## Architecture

The extension uses:
- `@lssm/module.contractspec-workspace` for pure analysis + templates
- `@lssm/bundle.contractspec-workspace` for workspace services + adapters

This allows the extension to work without requiring `@lssm/app.cli-contracts` to be installed.

## Build & Run

- Build: `bun run build` (produces `dist/extension.js`)
- Dev/watch: `bun run dev`
- Package: `bun run package` (creates `.vsix` file)

## Key Files

- `src/extension.ts` — activation entrypoint
- `src/commands/` — command implementations
- `src/diagnostics/` — real-time validation
- `src/telemetry/` — telemetry (hybrid PostHog direct/API)
- `snippets/` — code snippets for ContractSpec

## Telemetry

Telemetry uses a hybrid approach:
1. If `contractspec.api.baseUrl` is configured → send to API `/api/telemetry/ingest`
2. Otherwise → send directly to PostHog (if project key configured)

Respects VS Code telemetry settings (disabled when user opts out).

## MCP Integration

MCP features require `contractspec.api.baseUrl` to be configured. The extension calls:
- `/api/mcp/docs` for documentation search








