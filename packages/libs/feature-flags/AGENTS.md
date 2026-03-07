# AI Agent Guide — `@contractspec/lib.feature-flags`

Scope: `packages/libs/feature-flags/*`

Feature flags and experiments module. Provides flag evaluation, capability contracts, and event tracking for progressive rollouts.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

| Subpath                        | Description                  |
| ------------------------------ | ---------------------------- |
| `.`                            | Main entry                   |
| `./contracts`                  | Contract definitions         |
| `./docs`                       | Documentation blocks         |
| `./entities`                   | Flag entity schemas          |
| `./evaluation`                 | Flag evaluation logic        |
| `./events`                     | Domain events                |
| `./feature-flags.capability`   | Capability contract          |
| `./feature-flags.feature`      | Feature definition           |

## Guardrails

- Flag evaluation logic must be deterministic — same input always produces same output.
- Capability and feature contracts are public API; changes are breaking.
- Follow the PostHog naming conventions defined in workspace rules for new flag names.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
