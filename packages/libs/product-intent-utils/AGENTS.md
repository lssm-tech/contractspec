# AI Agent Guide — `@contractspec/lib.product-intent-utils`

Scope: `packages/libs/product-intent-utils/*`

Prompt builders and validators for product-intent workflows. Provides utilities that shape AI prompts and validate intent outputs against contract specs.

## Quick Context

- **Layer**: lib
- **Consumers**: module.product-intent-core, bundles

## Public Exports

- `.` — main entry (prompt builders, validators)

## Guardrails

- Prompt templates directly affect AI output quality — test changes against representative inputs
- Validation schemas must match contracts-spec definitions; drift causes silent mismatches
- Changes here propagate to product-intent-core and all dependent bundles

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
