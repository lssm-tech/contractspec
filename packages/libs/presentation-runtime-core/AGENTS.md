# AI Agent Guide — `@contractspec/lib.presentation-runtime-core`

Scope: `packages/libs/presentation-runtime-core/*`

Core presentation runtime for contract-driven UIs. Provides the platform-agnostic engine consumed by React and React Native runtimes.

## Quick Context

- **Layer**: lib
- **Consumers**: presentation-runtime-react, presentation-runtime-react-native

## Public Exports

- `.` — main entry (core runtime interface)

## Guardrails

- Core runtime interface is consumed by all presentation runtimes — changes here affect both web and mobile
- Must remain platform-agnostic; no React or React Native imports allowed
- API surface changes require coordinated updates in both downstream runtimes

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
