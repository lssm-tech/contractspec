# AI Agent Guide — `@contractspec/lib.ui-link`

Scope: `packages/libs/ui-link/*`

Mission: keep `@contractspec/lib.ui-link` tiny and router-agnostic. This package should stay a small shared-link surface, not grow into a navigation framework abstraction.

## Public surface

Treat these as the compatibility surface:

- root default export
- `./ui/link`
- the `Link` component prop shape

## Change boundaries

- Root export shape and anchor props are compatibility surface.
- Do not add router-specific coupling.
- Keep `exports` and `publishConfig.exports` aligned.

## Package invariants

- Plain-anchor semantics remain the default.
- `@contractspec/lib.ui-kit-core` remains the low-level dependency.
- This package stays intentionally smaller and more generic than `ui-kit` and `ui-kit-web`.

## Editing guidance

- Avoid growing this into a routing abstraction.
- Keep behavior simple, explicit, and framework-agnostic.
- If you need Expo-router or Next.js behavior, that likely belongs in the other UI packages instead.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- Confirm docs still describe a tiny router-agnostic surface.
