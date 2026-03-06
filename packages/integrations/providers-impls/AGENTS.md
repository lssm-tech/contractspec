# AI Agent Guide -- `@contractspec/integration.providers-impls`

Scope: `packages/integrations/providers-impls/*`

Concrete provider implementations for AI, voice, email, payments, storage, messaging, analytics, and other third-party integrations. Each implementation satisfies a contract interface from `contracts-integrations`.

## Quick Context

- **Layer**: integration
- **Consumers**: bundles, apps, modules that need concrete provider wiring

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | Main entry (re-exports) |
| `./analytics` | PostHog analytics |
| `./calendar` | Google Calendar |
| `./database` | Supabase / Postgres |
| `./email` | Postmark email |
| `./embedding` | Mistral embeddings |
| `./health` | Health-check providers |
| `./llm` | Mistral LLM |
| `./meeting-recorder` | Fathom, Fireflies, Granola, tldv |
| `./messaging` | Slack, GitHub, WhatsApp |
| `./openbanking` | Powens open-banking |
| `./payments` | Stripe payments |
| `./project-management` | Linear, Jira, Notion |
| `./sms` | Twilio SMS |
| `./storage` | GCS storage |
| `./vector-store` | Qdrant, Supabase vector |
| `./voice` | ElevenLabs, Fal, Gradium |
| `./impls/*` | Individual provider modules |

## Composio Fallback

- `ComposioFallbackResolver` is opt-in via `IntegrationProviderFactory({ composioFallback })`.
- When enabled, every `default:` branch in the factory delegates to Composio before throwing.
- MCP is the default transport; SDK mode available for tool search and auth management.
- Domain proxy adapters (`ComposioMessagingProxy`, `ComposioEmailProxy`, etc.) implement existing interfaces.
- `ComposioGenericProxy` is the catch-all for untyped domains.
- Session caching: MCP sessions are cached per userId with 30-min TTL.
- Key mapping: `resolveToolkit()` in `composio-types.ts` maps integration keys to Composio toolkit names.

## Guardrails

- Every implementation must satisfy a contract from `contracts-integrations`
- Never import from apps or bundles
- Secrets must flow through `@contractspec/integration.runtime`; never hard-code credentials
- Composio fallback is opt-in; existing code paths are unchanged when config is absent
- Composio proxy adapters must not leak Composio-specific types into domain interfaces

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
