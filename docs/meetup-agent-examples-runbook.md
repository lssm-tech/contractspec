# Meetup Agent Examples Runbook

## Demo lanes

- Primary lane: `agent-console` is the main meetup story and the first demo to run live.
- Live messaging lane: `messaging-agent-actions` is the provider-first demo for Slack, WhatsApp, and Telegram.
- Fallback lane: `ai-chat-assistant` is the comparison and backup demo if the live messaging lane is unavailable.

## Promotion states

- `stable`: `minimal`, `opencode-cli`
- `beta`: `agent-console`, `ai-chat-assistant`, `messaging-agent-actions`
- `experimental`: every other example until it passes the curated validation bar

## Curated preflight

Run the curated meetup lane before the event and again immediately before the talk:

```bash
bun scripts/run-meetup-examples-preflight.ts
```

This command validates curated example maturity, runs the public examples that are on the meetup path, checks the Telegram live-demo env floor, and optionally probes deployed ingress URLs from `MEETUP_PREFLIGHT_URLS`.

## Live messaging env floor

The live provider-first lane is not considered ready unless these are present:

- `CHANNEL_WORKSPACE_MAP_TELEGRAM`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET_TOKEN`
- `TELEGRAM_DEFAULT_CHAT_ID`

Use `MEETUP_PREFLIGHT_URLS` with one or more comma-separated deployed ingress URLs when you want the curated preflight to fail on reachability issues instead of skipping remote checks.

## Dates

- Script inconsistency warnings for non-curated experimental examples stay non-blocking only until March 26, 2026.
- The curated meetup lane must pass hard validation before the Paris AI Builders meetup on March 26, 2026.

Prepared for the AI Tinkerers Paris meetup on March 26, 2026.

## Goal

Use the public example lane without hidden setup:

- Primary live path: `agent-console`
- Live messaging path: `messaging-agent-actions`
- Secondary comparison and fallback: `ai-chat-assistant`

## Cold Start

Run these commands from the repository root:

```bash
bun run meetup:examples:preflight
bun run --cwd packages/examples/agent-console build
bun run --cwd packages/examples/agent-console test
bun run --cwd packages/examples/messaging-agent-actions build
bun run --cwd packages/examples/messaging-agent-actions test
bun run --cwd packages/examples/ai-chat-assistant build
bun run --cwd packages/examples/ai-chat-assistant test
bun run --cwd packages/apps/web-landing dev
```

Open these routes in the browser:

- `http://localhost:3000/sandbox?template=agent-console`
- `http://localhost:3000/sandbox?template=messaging-agent-actions`
- `http://localhost:3000/sandbox?template=ai-chat-assistant`
- `http://localhost:3000/docs/examples/agent-console`
- `http://localhost:3000/docs/examples/messaging-agent-actions`
- `http://localhost:3000/docs/examples/ai-chat-assistant`

## Demo Order

Start with `agent-console`.

Show:

1. `/docs/examples/agent-console`
2. `/llms/example.agent-console`
3. `/sandbox?template=agent-console`

Then switch to the live messaging lane.

Show:

1. `/docs/examples/messaging-agent-actions`
2. `/llms/example.messaging-agent-actions`
3. `/sandbox?template=messaging-agent-actions`

If the live messaging lane is unstable, switch to `ai-chat-assistant`.

Show:

1. `/docs/examples/ai-chat-assistant`
2. `/llms/example.ai-chat-assistant`
3. `/sandbox?template=ai-chat-assistant`

## Safe Live Edits

Keep live edits narrow and local:

- Update copy in the example showcase page or docblocks.
- Adjust seeded demo data in `packages/examples/agent-console/src/shared/`.
- Change the deterministic search results in `packages/examples/ai-chat-assistant/src/handlers/assistant.handlers.ts`.

Avoid live changes that require contract redesign, package export changes, or build tooling edits.

## Fallbacks

If API keys or external providers are unavailable:

- Stay on the seeded `agent-console` runtime path.
- Skip live provider routing and use the proof-backed `messaging-agent-actions` narrative instead of real webhooks.
- Use `ai-chat-assistant` for a contract-backed retrieval example without live provider calls.
- Keep the browser on the public docs and sandbox routes instead of switching to unpublished local scripts.

## Pre-Event Verification

Run:

```bash
bun run meetup:examples:preflight
bun run --cwd packages/apps/web-landing build:types
bun run repo:health
```

Confirm:

- `/templates` shows `agent-console`, `messaging-agent-actions`, and `ai-chat-assistant`
- all curated `/docs/examples/...` pages load
- all curated `/sandbox?template=...` routes render from a cold start
- all curated `/llms/example...` pages resolve
