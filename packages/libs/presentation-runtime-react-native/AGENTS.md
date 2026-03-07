# AI Agent Guide — `@contractspec/lib.presentation-runtime-react-native`

Scope: `packages/libs/presentation-runtime-react-native/*`

React Native presentation runtime for mobile apps. Provides mobile-specific rendering backed by the core presentation runtime.

## Quick Context

- **Layer**: lib
- **Consumers**: mobile apps

## Public Exports

- `.` — main entry
- `./nativewind-env.d` — NativeWind type declarations

## Guardrails

- Must stay compatible with presentation-runtime-core; do not diverge from the shared interface
- NativeWind integration is platform-specific — changes must be tested on actual devices/simulators
- Avoid web-only APIs; all code must run in React Native's JavaScript environment

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
