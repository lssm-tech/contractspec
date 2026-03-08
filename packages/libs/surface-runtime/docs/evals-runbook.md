# Surface Runtime Evals Runbook

## Overview

This runbook describes how to run and maintain the golden-context harness and performance evals for the surface resolver.

## Golden Context Harness

### What it does

- Runs the resolver with fixed bundle contexts (route, params, preferences, capabilities)
- Snapshots the `ResolvedSurfacePlan` (deterministic fields only)
- Detects regressions when resolver behavior changes

### Golden context format

See `src/evals/golden-context.ts`:

```ts
interface GoldenContext {
  route: string;
  params?: Record<string, string>;
  preferences?: Partial<PreferenceDimensions>;
  device?: 'desktop' | 'tablet' | 'mobile';
  capabilities?: string[];
  description?: string;
}
```

### Golden files

- `src/evals/__fixtures__/pm-workbench-golden.json` — Pilot route contexts for PM issue workbench

### Running golden evals

```bash
# Run golden harness tests
bun test src/evals/golden-harness.test.ts

# Update snapshots after intentional resolver changes
bun test src/evals/golden-harness.test.ts --update-snapshots
```

### Adding new golden contexts

1. Add entries to `__fixtures__/pm-workbench-golden.json` or create a new fixture file
2. Import the fixture in the test and iterate over contexts
3. Run with `--update-snapshots` to capture new snapshots

## Performance Budgets

| Target | Budget | Environment |
|--------|--------|-------------|
| Resolver latency p95 | <100ms | Server |
| Resolver latency p95 | <30ms | Client |

The golden harness includes a performance test that asserts resolver p95 < 100ms over 20 iterations.

## Metrics

Surface runtime emits these metrics via `@contractspec/lib.observability`:

- `bundle_surface_resolution_duration_ms` — Histogram of resolution time
- `bundle_surface_patch_acceptance_total` — Counter for accepted AI patches
- `bundle_surface_patch_rejection_total` — Counter for rejected AI patches
- `bundle_surface_policy_denial_total` — Counter for policy denials
- `bundle_surface_fallback_total` — Counter for surface/layout fallbacks
- `bundle_surface_renderer_missing_total` — Counter when slot has no renderer for node kind

## Tracing

Resolution is traced with span name `surface.resolveBundle`. Attributes: `bundle.key`, `surface.id`, `resolution.duration_ms`.

## Logging

Structured logs (no PII):

- `bundle.surface.resolved` — On successful resolution
- `bundle.surface.patch.applied` — When patch ops are applied
