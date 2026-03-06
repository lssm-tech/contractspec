# @contractspec/example.openbanking-powens

Website: https://contractspec.io/

**OAuth callback + webhook handler patterns**

OpenBanking Powens example: OAuth callback + webhook handler patterns. Framework-neutral handlers operate on standard `Request` for use in Next.js, Elysia, or any fetch-compatible runtime.

## What This Demonstrates

- OAuth callback handler for Powens open banking
- Webhook handler for Powens events
- Example spec with provider and workflow orchestration

## Exports

- `.` — main entry (registers docs, exports example and handlers)
- `./docs` — doc blocks
- `./example` — example metadata
- `./handlers/oauth-callback` — OAuth callback handler
- `./handlers/webhook-handler` — webhook handler

## Usage

```ts
import { powensOAuthCallbackHandler } from "@contractspec/example.openbanking-powens/handlers/oauth-callback";
import { powensWebhookHandler } from "@contractspec/example.openbanking-powens/handlers/webhook-handler";

// Wire into your framework (Next.js, Elysia, etc.)
// GET /api/oauth/callback → powensOAuthCallbackHandler
// POST /api/webhooks/powens → powensWebhookHandler
```
