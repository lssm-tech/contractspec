# @contractspec/lib.builder-runtime

Website: https://contractspec.io

Backend-neutral Builder runtime primitives for source ingestion, omnichannel normalization, fusion, planning, previews, readiness, and replay.

## What It Provides

- In-memory and interface-based Builder stores.
- Omnichannel ingestion pipeline for chat, voice, file, zip, Studio, Telegram, and WhatsApp inputs.
- Deterministic precedence-based fusion and blueprint compilation.
- Execution-lane plan compilation and lightweight execution lifecycle helpers.
- Preview, readiness, and replay bundle helpers.

## Public Entry Points

- `.` resolves through `./src/index.ts`
- `./stores` resolves through `./src/stores/index.ts`
- `./ingestion` resolves through `./src/ingestion/index.ts`
- `./fusion` resolves through `./src/fusion/index.ts`
- `./planning` resolves through `./src/planning/index.ts`
- `./preview` resolves through `./src/preview/index.ts`
- `./readiness` resolves through `./src/readiness/index.ts`
- `./replay` resolves through `./src/replay/index.ts`

## Notes

- This package stays backend-neutral. Durable database storage belongs in integration and app layers.
- Channel dispatch is bridged through an injected outbox adapter so Builder can reuse host messaging infrastructure without depending on app shells.
- PDF and OCR extraction are adapter-backed and can be swapped or disabled by hosts.
