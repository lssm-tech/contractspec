# Composio Universal Fallback Integration

## Overview

Composio acts as a universal fallback for the ContractSpec integration layer. When `IntegrationProviderFactory` encounters an integration key with no native implementation, it delegates to Composio's 850+ toolkit catalog instead of throwing an error.

## Architecture

```
Integration Request
       │
       ▼
IntegrationProviderFactory
       │
       ├── key matches ──► Native Provider (Stripe, Slack, ...)
       │
       └── key unknown ──► ComposioFallbackResolver
                                  │
                                  ├── default ──► ComposioMcpProvider ──► MCP Protocol
                                  │
                                  └── advanced ──► ComposioSdkProvider ──► @composio/core
```

## Components

### ComposioFallbackResolver

Entry point for the fallback. Instantiated with a `ComposioConfig` and injected into `IntegrationProviderFactory` via the constructor.

- `canHandle(key)` -- returns `true` for any key (universal fallback)
- `createMessagingProxy(ctx)` -- returns a `MessagingProvider` backed by Composio
- `createEmailProxy(ctx)` -- returns an `EmailOutboundProvider` backed by Composio
- `createPaymentsProxy(ctx)` -- returns a `PaymentsProvider` backed by Composio
- `createProjectManagementProxy(ctx)` -- returns a `ProjectManagementProvider` backed by Composio
- `createCalendarProxy(ctx)` -- returns a `CalendarProvider` backed by Composio
- `createGenericProxy(ctx)` -- returns a `ComposioGenericProxy` for untyped domains

### ComposioMcpProvider

Default transport. Creates Composio sessions and communicates via MCP JSON-RPC.

- Sessions cached per userId with 30-minute TTL
- Uses `composio-core` SDK to obtain MCP URL and headers
- Implements `ComposioToolProxy` interface

### ComposioSdkProvider

Advanced transport. Uses `composio-core` directly for:

- Tool search by query
- Direct tool execution
- Connected account management
- MCP config retrieval

### Domain Proxy Adapters

Each proxy implements a ContractSpec domain interface by mapping method calls to Composio tool names:

| Proxy | Interface | Tool pattern |
| --- | --- | --- |
| `ComposioMessagingProxy` | `MessagingProvider` | `{TOOLKIT}_SEND_MESSAGE` |
| `ComposioEmailProxy` | `EmailOutboundProvider` | `{TOOLKIT}_SEND_EMAIL` |
| `ComposioPaymentsProxy` | `PaymentsProvider` | `{TOOLKIT}_CREATE_PAYMENT_INTENT` |
| `ComposioProjectManagementProxy` | `ProjectManagementProvider` | `{TOOLKIT}_CREATE_ISSUE` |
| `ComposioCalendarProxy` | `CalendarProvider` | `{TOOLKIT}_CREATE_EVENT` |
| `ComposioGenericProxy` | (raw) | `{TOOLKIT}_{ACTION}` |

### Integration Key Mapping

`resolveToolkit()` in `composio-types.ts` maps ContractSpec integration keys to Composio toolkit names:

- Exact match: `messaging.slack` -> `slack`
- Prefix match: `project-management.asana` -> `asana`
- Fallback: extracts the last segment after `.` (e.g., `crm.custom` -> `custom`)

## Configuration

### Factory-level

```typescript
import { ComposioFallbackResolver } from "@contractspec/integration.providers-impls/impls/composio-fallback-resolver";

const factory = new IntegrationProviderFactory({
  composioFallback: new ComposioFallbackResolver({
    apiKey: process.env.COMPOSIO_API_KEY!,
    preferredTransport: "mcp",
  }),
});
```

### Runtime-level

```typescript
const config: IntegrationRuntimeConfig = {
  secretProvider: mySecretProvider,
  composio: {
    apiKey: process.env.COMPOSIO_API_KEY!,
    preferredTransport: "mcp",
  },
};
```

## Design Decisions

1. **MCP as default**: Requires no provider-specific packages; plugs into existing MCP infrastructure
2. **SDK for advanced**: Provides tool search, auth management, and workbench access
3. **Universal fallback**: `canHandle()` returns `true` for any key -- Composio is the catch-all
4. **No breaking changes**: Fallback is opt-in; existing code paths unchanged when config is absent
5. **Proxy pattern**: Domain proxies implement existing interfaces transparently
6. **Session caching**: 30-minute TTL per userId to avoid redundant session creation

## Files

| File | Package | Purpose |
| --- | --- | --- |
| `providers/composio.ts` | contracts-integrations | Integration spec definition |
| `impls/composio-types.ts` | providers-impls | Shared types and key mapping |
| `impls/composio-mcp.ts` | providers-impls | MCP transport provider |
| `impls/composio-sdk.ts` | providers-impls | Native SDK provider |
| `impls/composio-fallback-resolver.ts` | providers-impls | Fallback orchestrator |
| `impls/composio-proxies.ts` | providers-impls | Domain proxy adapters |
| `impls/provider-factory.ts` | providers-impls | Factory wiring (modified) |
| `runtime.ts` | runtime | Runtime config types (modified) |
