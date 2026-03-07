# AI Agent Guide — `@contractspec/lib.contracts-runtime-server-mcp`

Scope: `packages/libs/contracts-runtime-server-mcp/*`

MCP server runtime adapters for ContractSpec contracts, used by CLI and IDE extensions.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, CLI, VS Code extension

## Public Exports

- `.` — main entry
- `./mcp/*` — MCP subpath exports
- `./provider-mcp`

## Guardrails

- MCP protocol compliance is critical; transport layer must stay spec-compliant.
- Do not introduce runtime-specific (Node/browser) dependencies in the transport layer.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
