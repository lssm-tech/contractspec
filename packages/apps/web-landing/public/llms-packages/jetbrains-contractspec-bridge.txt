# @contractspec/jetbrains-contractspec-bridge

Website: https://contractspec.io/

**Node.js bridge server for ContractSpec JetBrains Plugin**

JSON-RPC/LSP server over stdio that connects the JetBrains IDE plugin to ContractSpec workspace services. Uses vscode-languageserver, TextDocuments, and BridgeServer handlers. Private package; not published to npm.

## Installation / Running

From the monorepo root:

```bash
bun install
bun run build --filter=@contractspec/jetbrains-contractspec-bridge
bun run start --filter=@contractspec/jetbrains-contractspec-bridge
```

Or from this directory:

```bash
bun run build
bun run start
```

The bridge is typically launched by the JetBrains plugin as a subprocess; it communicates via stdin/stdout.

## Entry Point

- `src/server.ts` — Creates LSP connection, TextDocuments manager, and BridgeServer. Handles `onInitialize`, `onInitialized`, and text document open/change/close events.

## Architecture

- **BridgeServer** (`src/handlers/BridgeServer.ts`) — Wraps `@contractspec/bundle.workspace` and `@contractspec/module.workspace` for spec validation, scaffolding, and analysis.
- **vscode-languageserver** — Provides stdio transport and LSP protocol.
- **TextDocuments** — Tracks open documents for the plugin.
