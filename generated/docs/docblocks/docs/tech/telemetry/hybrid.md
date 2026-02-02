# Hybrid Telemetry Model

ContractSpec uses a hybrid telemetry model where clients can send events either directly to PostHog or via the API server.

## Decision Flow

```
Is contractspec.api.baseUrl configured?
├── Yes → Send via /api/telemetry/ingest
└── No → Is posthogProjectKey configured?
    ├── Yes → Send directly to PostHog
    └── No → Telemetry disabled
```

## Benefits

### Direct PostHog
- No server dependency
- Works offline (with batching)
- Lower latency

### Via API
- Centralized key management (no client-side keys)
- Server-side enrichment and validation
- Rate limiting and abuse prevention
- Easier migration to other providers

## Recommendation

- **Development**: Use direct PostHog with a dev project key
- **Production**: Route via API for better governance

## Future: OpenTelemetry

The current PostHog implementation is behind a simple interface that can be swapped for OpenTelemetry:

```typescript
interface TelemetryClient {
  send(event: TelemetryEvent): Promise<void>;
}
```

This allows future migration without changing client code.
