# @contractspec/integration.providers-impls

Website: https://contractspec.io

**Compatibility facade and all-provider factory for ContractSpec provider implementations.**

## What It Provides

- **Layer**: integration.
- **Consumers**: bundles, apps, and modules that still need the broad compatibility surface or the all-provider factory.
- Targeted provider implementation packages now own the concrete domains, such as `@contractspec/integration.provider.email`, `@contractspec/integration.provider.payments`, `@contractspec/integration.provider.voice`, and `@contractspec/integration.provider.project-management`.
- Related ContractSpec packages include `@contractspec/integration.runtime`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, and `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/integration.providers-impls`

or

`bun add @contractspec/integration.providers-impls`

## Usage

Prefer a targeted package when you only need one provider domain:

```ts
import { GmailInboundProvider } from '@contractspec/integration.provider.email/impls/gmail-inbound';
import { StripePaymentsProvider } from '@contractspec/integration.provider.payments/impls/stripe-payments';
```

Existing imports from `@contractspec/integration.providers-impls` and its `./impls/*` subpaths remain supported as compatibility re-exports. Keep using this package for `IntegrationProviderFactory` or when you intentionally need the broad composition surface.

### Communication Coverage

`IntegrationProviderFactory` now covers the main OSS communication paths directly:

- `createEmailInboundProvider(...)` for Gmail thread/message sync
- `createEmailOutboundProvider(...)` for Gmail and Postmark delivery
- `createSmsProvider(...)` for Twilio SMS
- `createMessagingProvider(...)` for Telegram, WhatsApp Meta, and WhatsApp Twilio

## Architecture

- `src/analytics.ts`, `src/calendar.ts`, `src/database.ts`, `src/email.ts`, `src/embedding.ts`, and the other domain files are compatibility re-exports to targeted packages.
- `src/impls/provider-factory.ts` owns the all-provider factory and imports targeted packages.
- `src/impls/composio-*` owns the cross-domain Composio fallback/proxy surface.
- `src/impls/*` provider implementation files are compatibility re-exports to targeted packages.
- `src/index.ts` is the root public barrel and package entrypoint.

## Targeted Packages

- `@contractspec/integration.provider.analytics`
- `@contractspec/integration.provider.calendar`
- `@contractspec/integration.provider.database`
- `@contractspec/integration.provider.email`
- `@contractspec/integration.provider.embedding`
- `@contractspec/integration.provider.health`
- `@contractspec/integration.provider.llm`
- `@contractspec/integration.provider.meeting-recorder`
- `@contractspec/integration.provider.messaging`
- `@contractspec/integration.provider.openbanking`
- `@contractspec/integration.provider.payments`
- `@contractspec/integration.provider.project-management`
- `@contractspec/integration.provider.sms`
- `@contractspec/integration.provider.storage`
- `@contractspec/integration.provider.vector-store`
- `@contractspec/integration.provider.voice`

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./analytics` resolves through `./src/analytics.ts`.
- Export `./calendar` resolves through `./src/calendar.ts`.
- Export `./database` resolves through `./src/database.ts`.
- Export `./email` resolves through `./src/email.ts`.
- Export `./embedding` resolves through `./src/embedding.ts`.
- Export `./health` resolves through `./src/health.ts`.
- Export `./impls` resolves through `./src/impls/index.ts`.
- Export `./impls/async-event-queue` resolves through `./src/impls/async-event-queue.ts`.
- Export `./impls/composio-fallback-resolver` resolves through `./src/impls/composio-fallback-resolver.ts`.
- The package publishes 78 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
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

- Missing dependencies (thanks to knip).
- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Resolve lint, build, and test failures across voice, workspace, library, and composio.
- Composio.
- Normalize formatting across contracts-integrations, composio, and observability.

## Notes

- Every implementation must satisfy a contract from `contracts-integrations`.
- Never import from apps or bundles.
- Secrets must flow through `@contractspec/integration.runtime`; never hard-code credentials.
- Composio fallback is opt-in; existing code paths are unchanged when config is absent.
- Composio proxy adapters must not leak Composio-specific types into domain interfaces.
