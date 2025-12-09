# ThemeSpec Overview

## Purpose

`ThemeSpec` defines a structured, versioned source of truth for design tokens, component variants, and scoped overrides. Use it to describe how tenants or individual users should experience the design system without hand-maintaining ad-hoc theme files. Specs live in `@lssm/lib.contracts`, making them accessible to generators, docs, and runtime tooling.

## Location

- Types & registry: `packages/libs/contracts/src/themes.ts`
- Design tokens bridge: `packages/libs/design-system/src/theme/*`

## Schema

```ts
export interface ThemeSpec {
  meta: ThemeMeta;            // ownership metadata + { name, version, extends?, scopes? }
  tokens: ThemeTokens;        // design tokens grouped by colors, radii, space, etc.
  components?: ComponentVariantSpec[]; // per-component variant configuration
  overrides?: ThemeOverride[];         // scoped tenant/user overrides
}
```

- **ThemeMeta**
  - `name`: fully-qualified identifier (e.g., `design.pastel`)
  - `version`: increment when tokens/variants change in a breaking way
  - `extends?`: optional `{ name, version }` pointer to a base theme
  - `scopes?`: default scopes where the theme applies (`global`, `tenant`, `user`)
- **ThemeTokens**
  - `colors`, `radii`, `space`, `typography`, `shadows`, `motion`
  - Each entry is a map of `{ value: T; description?: string }`
- **ComponentVariantSpec**
  - `component`: design-system component key (e.g., `Button`, `NavMain`)
  - `variants`: map of variant names → `{ props?, tokens? }`
- **ThemeOverride**
  - `scope`: `'global' | 'tenant' | 'user'`
  - `target`: identifier (e.g., `tenant:artisanos`, `user:123`)
  - `tokens?` / `components?`: partial token/variant overrides for the target

## Registry Usage

```ts
import { ThemeRegistry } from '@lssm/lib.contracts/themes';
import { PastelTheme } from './themes/design.pastel';

const themes = new ThemeRegistry();
themes.register(PastelTheme);

const theme = themes.get('design.pastel');
const tenantVariant = themes
  .get('design.pastel')
  ?.overrides?.find((o) => o.target === 'tenant:artisanos');
```

The registry guarantees `name + version` uniqueness and exposes `list()` for discovery tooling.

## Rendering

The design system consumes specs (via adapters you provide) to build runtime tokens. A simple adapter might:

1. Resolve the base theme + applicable overrides.
2. Merge token maps using `ThemeTokens`.
3. Feed the result into `mapTokensForPlatform` in `@lssm/lib.design-system`.

```ts
import { ThemeRegistry } from '@lssm/lib.contracts/themes';
import { mapTokensForPlatform } from '@lssm/lib.design-system';

function resolveTokens(registry: ThemeRegistry, ref: ThemeRef, ctx: { tenant?: string; user?: string }) {
  const spec = registry.get(ref.name, ref.version);
  if (!spec) throw new Error('Theme not found');

  const tokens = deepMerge(spec.tokens, collectOverrides(spec.overrides, ctx));
  return mapTokensForPlatform(tokens);
}
```

## Authoring Guidelines

1. Keep token names aligned with the design-system defaults (`background`, `mutedForeground`, etc.).
2. Use `extends` to create layered themes (base brand → tenant tweaks → user-level overrides).
3. Document variants with `description` to help designers and automation understand intent.
4. Prefer scoped overrides (`tenant:foo`) instead of duplicating the entire theme per tenant.
5. When tokens influence multiple components, capture them in `tokens` and keep `components` for API-level variant wiring.

## CLI (Future Work)

The `contractspec` CLI does not yet scaffold theme specs. Planned additions:

- `contractspec create --type theme`
- `contractspec build <theme.theme.ts>` → generate design-system adapters

For now, author specs manually and register them alongside contract bundles.

