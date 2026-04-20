# AI Agent Guide — `@contractspec/lib.design-system`

Scope: `packages/libs/design-system/*`

Mission: keep `@contractspec/lib.design-system` a stable, high-level design-system and composition layer. This package has high blast radius because its root barrel, token shapes, and composed components are reused across many surfaces.

## Public surface

Treat these grouped areas as the compatibility surface:

- theme
- platform
- renderers
- component composition layers
- registry metadata and build support

The root barrel is the primary API.

## Change boundaries

- Root exports, token shapes, and component names are compatibility surface.
- Registry metadata and build support matter when changing shadcn-style registry contents.
- Do not flatten grouped docs into file inventories.
- Keep `exports` and `publishConfig.exports` aligned.

## Package invariants

- Token names and token shapes are public API.
- Platform bridge semantics stay deliberate.
- Root-barrel breadth means small changes can have wide downstream impact.
- Component hierarchy and composition layers should not be casually collapsed.
- This package is broader than "tokens"; it also owns renderers and high-level composed UI.
- This package is the preferred shared product-surface layer in `/docs/libraries/cross-platform-ui`; keep web/native compatibility behind design-system exports where possible.
- Maintain paired `.tsx` / `.mobile.tsx` implementations for cross-surface components such as `DataTable`, `DataViewRenderer`, and `ListTablePage`.
- Changes to `withPlatformUI`, `mapTokensForPlatform`, stack usage, or paired renderers require updating the cross-platform UI docs and customer markdown kit.
- Form controls exported from this package must stay ThemeSpec-aware and TranslationSpec-aware. Caller props override ThemeSpec component variant defaults.
- New form primitives should be added at the design-system boundary first, then backed by `ui-kit-web`/`ui-kit` primitives per platform.

## Editing guidance by area

### Theme tokens and token bridge

- Treat token interfaces and token names as breaking-change territory.
- Preserve the deliberate web-vs-native shape differences in `mapTokensForPlatform()`.
- Keep ThemeSpec-to-Tailwind bridge helpers CSS-variable-first and generation-optional; OKLCH values should pass through unchanged.

### Platform hooks and adapters

- Keep responsive, color-scheme, and reduced-motion helpers predictable.
- Preserve the lightweight role of `withPlatformUI()`.

### Renderers

- Keep renderer exports aligned with their higher-level integration role.
- Be careful when changing form-contract related behavior, because downstream runtime code depends on it.
- FormSpec renderers should consume exported design-system controls, not private inline wrappers, so product code and contract rendering share the same theme/i18n behavior.

### Components and composition layers

- Preserve grouped layers such as atoms, molecules, organisms, templates, visualization, legal, marketing, and agent/admin surfaces.
- Avoid flattening or casually merging composition layers.

### Registry metadata and build

- If registry-facing behavior changes, keep `components.json`, `registry/registry.json`, and the build script in sync.
- Treat registry metadata as part of the package's external tooling surface.

## Docs maintenance rules

- README should explain the package as a higher-level composition layer, not just as a token package.
- AGENTS should emphasize blast radius and compatibility hotspots.
- If new public groups are added, document them explicitly.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
- If registry-facing behavior changes, also run `bun run registry:build`
