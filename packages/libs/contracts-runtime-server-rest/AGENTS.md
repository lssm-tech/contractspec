# AI Agent Guide — `@contractspec/lib.contracts-runtime-server-rest`

Scope: `packages/libs/contracts-runtime-server-rest/*`

REST server runtime adapters for ContractSpec contracts, supporting multiple frameworks.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, all REST apps

## Public Exports

- `.` — main entry
- `./contracts-adapter-hydration`
- `./contracts-adapter-input`
- `./rest-elysia`
- `./rest-express`
- `./rest-generic`
- `./rest-next-app`
- `./rest-next-pages`

## Guardrails

- High blast radius — all REST APIs depend on this package.
- Framework adapters (Elysia, Express, Next.js) must stay independent of each other.
- Do not introduce cross-adapter coupling.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
