# AI Agent Guide — `jetbrains-contractspec` Plugin

Scope: `packages/apps/jetbrains-contractspec/*`

This is the ContractSpec JetBrains IDE plugin. It provides spec validation, scaffolding, and MCP integration for WebStorm and IntelliJ IDEA Ultimate.

## Architecture

The plugin uses:
- `@contractspec/module.workspace` for pure analysis + templates
- `@contractspec/bundle.workspace` for workspace services + adapters

This allows the plugin to work without requiring `@contractspec/app.cli-contractspec` to be installed.

## Build & Run

- Build: `gradle build` (produces JAR and plugin ZIP)
- Dev/watch: `gradle runIde` (opens IDE with plugin loaded)
- Package: `gradle packagePlugin` (creates plugin ZIP for distribution)

## Key Files

- `src/main/kotlin/tech/lssm/contractspec/ContractSpecPlugin.kt` — Plugin lifecycle
- `src/main/kotlin/tech/lssm/contractspec/actions/` — IDE actions (commands)
- `src/main/kotlin/tech/lssm/contractspec/toolwindow/` — Tool window panels
- `src/main/kotlin/tech/lssm/contractspec/inspections/` — Real-time inspections
- `src/main/kotlin/tech/lssm/contractspec/bridge/` — Node.js communication bridge
- `src/main/kotlin/tech/lssm/contractspec/telemetry/` — Telemetry service
- `bridge/src/server.ts` — Node.js bridge server
- `src/main/resources/META-INF/plugin.xml` — Plugin descriptor

## Node.js Bridge

The plugin communicates with TypeScript services via a Node.js subprocess:

1. Plugin starts Node.js process running `bridge/src/server.ts`
2. JSON-RPC communication over stdio
3. Bridge wraps `@contractspec/bundle.workspace` services
4. Plugin handles UI, bridge handles business logic

## Telemetry

Telemetry uses a hybrid approach:
1. If `contractspec.api.baseUrl` is configured → send to API `/api/telemetry/ingest`
2. Otherwise → send directly to PostHog (if project key configured)

Respects IDE telemetry settings (disabled when user opts out).

## MCP Integration

MCP features require `contractspec.api.baseUrl` to be configured. The plugin calls:
- `/api/mcp/docs` for documentation search

## Settings

Plugin settings are stored in IDE settings and include:
- API base URL for remote features
- Telemetry configuration
- Validation preferences
- Registry URL
- Grouping mode preferences

## Tool Windows

The plugin adds a ContractSpec activity bar with these views:

### Specs Explorer
- Browse all specs organized by type/package/namespace
- Inline validate/build actions
- Context menu operations

### Dependencies
- Visualize spec relationships
- Detect circular dependencies
- Navigate to referenced specs

### Build Results
- Track build history (last 20)
- Success/failure indicators
- Click to open generated files

### Features
- Feature explorer with spec references
- Orphaned specs detection
- Link to feature actions

### Integrity Analysis
- Contract integrity validation
- Missing implementations
- Feature-to-spec mapping

### LLM Tools
- Export specs to LLM
- Generate implementation guides
- Verify implementations

## Actions/Commands

All VS Code extension commands are implemented as IntelliJ Actions, including:
- Validate/Build operations
- Spec creation wizard
- Watch mode toggle
- Diff and comparison tools
- OpenAPI import/export
- Registry browsing
- Setup and health checks

## Inspections

Real-time code inspections provide:
- Spec structure validation
- Integrity warnings (orphaned specs, unresolved refs)
- Quick fixes where applicable


