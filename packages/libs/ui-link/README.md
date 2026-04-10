# @contractspec/lib.ui-link

`@contractspec/lib.ui-link` provides a tiny link component for shared UI surfaces that should not be coupled to framework-specific routers.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.ui-link`

or

`npm install @contractspec/lib.ui-link`

## What belongs here

This package is intentionally narrow:

- Generic anchor-style link behavior.
- Minimal styling composition via `@contractspec/lib.ui-kit-core`.

Use this package when you want shared link behavior without Expo-router or Next-specific coupling.

## API map

- root default export
- `./ui/link`
- `Link` component with anchor-style props and required `href`

## Operational semantics and gotchas

- The component renders a plain anchor.
- It depends on `@contractspec/lib.ui-kit-core` for `cn()`.
- Unlike `ui-kit` and `ui-kit-web`, this package should stay router-agnostic.
- The root export is just the default export from `./ui/link`.

## When not to use this package

- Do not use it for Expo-router navigation.
- Do not use it for Next.js `Link` behavior.
- Do not use it for complex navigation abstractions.

## Related packages

- `@contractspec/lib.ui-kit-core`
- `@contractspec/lib.ui-kit`
- `@contractspec/lib.ui-kit-web`

## Local commands

- `bun run lint:check`
- `bun run typecheck`
