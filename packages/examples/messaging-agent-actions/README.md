# @contractspec/example.messaging-agent-actions

Safe messaging agent actions example with fixed intents, allowlisted action execution, workflow dispatch, and deterministic confirmation replies.

## What This Demonstrates

- Inbound message normalization for Slack, WhatsApp, Telegram, or any messaging bridge.
- Fixed intent parsing: `status`, `run action`, and `dispatch workflow`.
- Allowlisted action and workflow routing instead of arbitrary tool execution.
- Replayable meetup proof for the canonical status -> action -> workflow walkthrough.

## Running Locally

From `packages/examples/messaging-agent-actions`:
- `bun run build`
- `bun run test`
- `bun run typecheck`
- `bun run proof`
- `bun run preflight`

## Usage

Use this package when you need a conservative messaging demo that proves agent actions can stay safe, typed, and reviewable even when messages come from live provider webhooks.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./messaging-agent-actions.feature` resolves through `./src/messaging-agent-actions.feature.ts`.
- Export `./proof/*` resolves through `./src/proof/*.ts`.

## Local Commands

- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run typecheck` — tsc --noEmit
- `bun run proof` — bun ../../../scripts/generate-messaging-agent-actions-meetup-proof.ts
- `bun run preflight` — bun run build && bun run typecheck && bun run test && bun run proof
