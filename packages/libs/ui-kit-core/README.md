# @contractspec/lib.ui-kit-core

`@contractspec/lib.ui-kit-core` is the shared foundation for the UI packages. It provides the low-level `cn()` utility plus the canonical shared interface layer used by `ui-kit` and `ui-kit-web`.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.ui-kit-core`

or

`npm install @contractspec/lib.ui-kit-core`

## What belongs here

This package is intentionally small:

- Very low-level, zero-surprise UI helpers shared across `ui-kit`, `ui-kit-web`, and `ui-link`.
- Small shared utilities that are useful across multiple UI packages and do not belong in a component package.
- Platform-neutral shared UI contracts under `./interfaces`.

## API map

- root export: `.`  
- shared interfaces subpath: `./interfaces`
- utility subpath: `./utils`
- core function: `cn(...inputs)`

## Operational semantics and gotchas

- This package is intentionally tiny.
- `./interfaces` is the shared compatibility layer for semantically matching `ui-kit` and `ui-kit-web` exports.
- `cn()` composes `clsx` with `tailwind-merge`.
- Changes here ripple into all UI packages even though the file count is small.
- This package should stay boring and predictable.

## When not to use this package

- Do not use it for components.
- Do not use it for design tokens.
- Do not use it for router or link abstractions.

## Related packages

- `@contractspec/lib.ui-kit`
- `@contractspec/lib.ui-kit-web`
- `@contractspec/lib.ui-link`

## Local commands

- `bun run lint:check`
- `bun run typecheck`
