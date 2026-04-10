# @contractspec/lib.ui-kit-core

`@contractspec/lib.ui-kit-core` is the small shared foundation for the UI packages, currently centered on class-name merging and related low-level utilities.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.ui-kit-core`

or

`npm install @contractspec/lib.ui-kit-core`

## What belongs here

This package is intentionally small:

- Very low-level, zero-surprise UI helpers shared across `ui-kit`, `ui-kit-web`, and `ui-link`.
- Small shared utilities that are useful across multiple UI packages and do not belong in a component package.

## API map

- root export: `.`  
- utility subpath: `./utils`
- core function: `cn(...inputs)`

## Operational semantics and gotchas

- This package is intentionally tiny.
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
