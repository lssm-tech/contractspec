# AI Agent Guide — `@contractspec/lib.ui-kit-core`

Scope: `packages/libs/ui-kit-core/*`

Mission: keep `@contractspec/lib.ui-kit-core` minimal, boring, and stable. This package is a foundational utility layer, not a component or design-system package.

## Public surface

Treat these as the compatibility surface:

- root barrel
- `./utils`
- `cn(...inputs)`

## Change boundaries

- Function semantics and export shape are compatibility surface.
- Avoid feature creep.
- Keep `exports` and `publishConfig.exports` aligned.

## Package invariants

- `cn()` behavior stays predictable.
- No surprise side effects.
- Downstream ripple is high despite the small file count.
- New helpers should only exist here when multiple UI packages already need them.

## Editing guidance

- Prefer no new abstractions unless there is clear multi-package reuse.
- Preserve package minimalism.
- If behavior changes, document downstream impact explicitly.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- Confirm the docs still describe a tiny foundational surface, not a broader API.
