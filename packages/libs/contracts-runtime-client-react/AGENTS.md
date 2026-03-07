# AI Agent Guide — `@contractspec/lib.contracts-runtime-client-react`

Scope: `packages/libs/contracts-runtime-client-react/*`

React runtime adapters for ContractSpec contracts, powering form and feature rendering.

## Quick Context

- **Layer**: lib
- **Consumers**: design-system, presentation-runtime-react, bundles

## Public Exports

- `.` — main entry
- `./drivers/rn-reusables`
- `./drivers/shadcn`
- `./feature-render`
- `./form-render`
- `./form-render.impl`

## Guardrails

- Driver interface must stay compatible with both shadcn and RN Reusables.
- Form rendering pipeline is a critical path; test thoroughly before changing.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
