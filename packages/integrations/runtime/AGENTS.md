# AI Agent Guide -- `@contractspec/integration.runtime`

Scope: `packages/integrations/runtime/*`

Runtime integration layer providing secret management (env, GCP Secret Manager) and multi-channel message dispatching (Slack, GitHub, WhatsApp).

## Quick Context

- **Layer**: integration
- **Consumers**: `providers-impls`, bundles, apps that need secrets or channel routing

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | Main entry (re-exports) |
| `./secrets` | Secret provider registry & manager |
| `./secrets/env-secret-provider` | Environment-variable secret provider |
| `./secrets/gcp-secret-manager` | GCP Secret Manager provider |
| `./channel` | Multi-channel dispatcher & stores |
| `./channel/slack` | Slack channel adapter |
| `./channel/github` | GitHub channel adapter |
| `./channel/whatsapp-*` | WhatsApp adapters (Meta, Twilio) |
| `./health` | Runtime health checks |
| `./runtime` | Core runtime utilities |

## Guardrails

- Secret providers must implement the `provider` interface; never read secrets directly
- Channel stores (memory, postgres) are swappable; do not couple to a specific backend
- Never import from apps or bundles

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
