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

## Guardrails

- Every implementation must satisfy a contract from `contracts-integrations`
- Never import from apps or bundles
- Secrets must flow through `@contractspec/integration.runtime`; never hard-code credentials

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
