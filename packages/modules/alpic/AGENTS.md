# AI Agent Guide -- `@contractspec/module.alpic`

Scope: `packages/modules/alpic/*`

Alpic MCP server and ChatGPT App hosting helpers for exposing ContractSpec capabilities via external AI platforms.

## Quick Context

- **Layer**: module
- **Consumers**: apps (alpic-mcp, chatgpt-app)

## Public Exports

- `.` -- root barrel (MCP server helpers, ChatGPT hosting utilities)

## Guardrails

- Depends on `@modelcontextprotocol/sdk` and `elysia` -- version bumps may break MCP protocol compatibility
- Exposes external-facing endpoints; treat all inputs as untrusted
- Changes affect MCP tool registration and ChatGPT plugin manifests

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
