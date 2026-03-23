# @contractspec/integration.runtime

Website: https://contractspec.io

**Runtime integration with secret management.**

## What It Provides

- **Layer**: integration.
- **Consumers**: `providers-impls`, bundles, apps that need secrets or channel routing.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/integration.runtime`

or

`bun add @contractspec/integration.runtime`

## Usage

Import the root entrypoint from `@contractspec/integration.runtime`, or choose a documented subpath when you only need one part of the package surface.

The channel runtime keeps policy evaluation deterministic and auditable:

- Signature-invalid events are rejected before processing.
- `MessagingPolicyEngine` can be replaced by a contract-backed policy evaluator through `ChannelRuntimeService`.
- `ChannelApprovalService` exposes a generic approval queue for CLI, API, web, or custom operator surfaces via the shared channel store.
- Compiled plan metadata now carries deterministic plan and step IDs, actor audit context, and approval timeout fallback state.
- Capability grants are intended to be bound by the hosting application, for example through `CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS`, rather than trusted from inbound event payload metadata.
- Hosting applications should also bind a server-side actor via `actorResolver` so runtime approvals and execution are attributed to the authenticated service, operator, or agent principal rather than raw inbound channel claims.
- Telemetry now carries `traceId`, `sessionId`, and `workflowId` when callers provide them in inbound metadata.

## Architecture

- `src/channel` is part of the package's public or composition surface.
- `src/health.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/runtime.health.test.ts` is part of the package's public or composition surface.
- `src/runtime.ts` is part of the package's public or composition surface.
- `src/secrets` is part of the package's public or composition surface.
- `src/transport` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./channel` resolves through `./src/channel/index.ts`.
- Export `./channel/approval` resolves through `./src/channel/approval.ts`.
- Export `./channel/authorization` resolves through `./src/channel/authorization.ts`.
- Export `./channel/dispatcher` resolves through `./src/channel/dispatcher.ts`.
- Export `./channel/github` resolves through `./src/channel/github.ts`.
- Export `./channel/memory-store` resolves through `./src/channel/memory-store.ts`.
- Export `./channel/planner` resolves through `./src/channel/planner.ts`.
- Export `./channel/policy` resolves through `./src/channel/policy.ts`.
- Export `./channel/postgres-queries` resolves through `./src/channel/postgres-queries.ts`.
- Export `./channel/postgres-schema` resolves through `./src/channel/postgres-schema.ts`.
- Export `./channel/postgres-store` resolves through `./src/channel/postgres-store.ts`.
- Export `./channel/replay-fixtures` resolves through `./src/channel/replay-fixtures.ts`.
- Export `./channel/service` resolves through `./src/channel/service.ts`.
- Export `./channel/slack` resolves through `./src/channel/slack.ts`.
- Export `./channel/store` resolves through `./src/channel/store.ts`.
- Export `./channel/telegram` resolves through `./src/channel/telegram.ts`.
- Export `./channel/telemetry` resolves through `./src/channel/telemetry.ts`.
- Export `./channel/trace` resolves through `./src/channel/trace.ts`.
- Export `./channel/types` resolves through `./src/channel/types.ts`.
- Export `./channel/whatsapp-meta` resolves through `./src/channel/whatsapp-meta.ts`.
- Export `./channel/whatsapp-twilio` resolves through `./src/channel/whatsapp-twilio.ts`.
- Export `./health` resolves through `./src/health.ts`.
- Export `./runtime` resolves through `./src/runtime.ts`.
- Export `./secrets` resolves through `./src/secrets/index.ts`.
- Export `./secrets/env-secret-provider` resolves through `./src/secrets/env-secret-provider.ts`.
- Export `./secrets/gcp-secret-manager` resolves through `./src/secrets/gcp-secret-manager.ts`.
- Export `./secrets/manager` resolves through `./src/secrets/manager.ts`.
- Export `./secrets/provider` resolves through `./src/secrets/provider.ts`.
- Export `./transport` resolves through `./src/transport/index.ts`.
- Export `./transport/auth-resolver` resolves through `./src/transport/auth-resolver.ts`.
- Export `./transport/transport-factory` resolves through `./src/transport/transport-factory.ts`.
- Export `./transport/version-negotiator` resolves through `./src/transport/version-negotiator.ts`.
- The package publishes 33 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Add Composio universal fallback, fix provider-ranking types, and expand package exports.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Upgrade dependencies.
- Stabilize lint gate and runtime contract typing.

## Notes

- Secret providers must implement the `provider` interface; never read secrets directly.
- Channel stores (memory, postgres) are swappable; do not couple to a specific backend.
- Never import from apps or bundles.
