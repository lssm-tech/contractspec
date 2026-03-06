# AI Agent Guide — `@contractspec/lib.email`

Scope: `packages/libs/email/*`

Email sending via Scaleway SDK. Provides a provider-agnostic client interface for transactional email.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

| Subpath     | Description              |
| ----------- | ------------------------ |
| `.`         | Main entry               |
| `./client`  | Email client interface   |
| `./types`   | Shared type definitions  |
| `./utils`   | Email utility functions  |

## Guardrails

- Client interface abstracts the provider; do not leak Scaleway-specific types into the public API.
- Keep the adapter boundary clean so the provider can be swapped without consumer changes.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
