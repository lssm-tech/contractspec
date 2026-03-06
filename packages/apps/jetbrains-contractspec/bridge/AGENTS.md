# AI Agent Guide — `jetbrains-contractspec-bridge`

Scope: `packages/apps/jetbrains-contractspec/bridge/*`

Node.js bridge server that connects the JetBrains plugin (Kotlin) to ContractSpec TypeScript services via JSON-RPC over stdio.

## Quick Context

- **Layer**: app (subprocess server)
- **Consumers**: JetBrains ContractSpec plugin

## Architecture

- Uses `@contractspec/bundle.workspace` for workspace services
- Uses `@contractspec/module.workspace` for analysis and templates
- Uses `@contractspec/lib.contracts-spec` and `lib.contracts-transformers`
- Uses `@contractspec/module.examples` for example specs
- Communicates via `vscode-jsonrpc` over stdio

## Key Files

- `src/server.ts` — Server entry point (started by JetBrains plugin)
- `src/index.ts` — Library exports
- `src/handlers/BridgeServer.ts` — JSON-RPC request handlers

## Public Exports

N/A (private package, subprocess only)

## Guardrails

- JSON-RPC method names and signatures are a contract with the Kotlin plugin — coordinate changes
- Keep stdio clean; stray `console.log` will break the protocol
- This package is `private: true` — not published to npm

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Start: `bun run start`
