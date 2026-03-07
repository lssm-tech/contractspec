# AI Agent Guide — `@contractspec/lib.voice`

Scope: `packages/libs/voice/*`

Voice capabilities: text-to-speech, speech-to-text, and conversational AI interfaces.

## Quick Context

- **Layer**: lib
- **Consumers**: video-gen, bundles

## Public Exports

- `.` — main entry
- `./audio` — audio processing utilities
- `./conversational` — conversational AI interface
- `./docs` — documentation generation
- `./i18n` — internationalization
- `./stt` — speech-to-text adapter interface
- `./sync` — audio/text synchronization
- `./tts` — text-to-speech adapter interface
- `./types` — shared type definitions

## Guardrails

- TTS/STT interfaces are adapter boundaries — keep them provider-agnostic
- Audio processing must stay streaming-compatible (no full-buffer-only APIs)
- Depends on contracts-spec, contracts-integrations, content-gen

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
