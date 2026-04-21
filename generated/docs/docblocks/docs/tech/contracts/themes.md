# ThemeSpec Overview

## Purpose

`ThemeSpec` defines a structured, versioned source of truth for design tokens, component variants, and scoped overrides. Use it to describe how tenants or individual users should experience the design system without hand-maintaining ad-hoc theme files.

## Location

- Types, helper, registry, and validation: `packages/libs/contracts-spec/src/themes.ts` and `packages/libs/contracts-spec/src/themes.validation.ts`
- Design tokens bridge: `packages/libs/design-system/src/theme/*`

## Schema

```ts
export interface ThemeSpec {
  meta: ThemeMeta;            // ownership metadata + { key, version, extends?, scopes? }
  tokens: ThemeTokens;
  components?: ComponentVariantSpec[];
  overrides?: ThemeOverride[];
  modes?: Record<string, ThemeModeSpec>; // use keys like "light" and "dark"
}
```

- **ThemeMeta**
  - `key`: fully-qualified identifier (for example `design.pastel`)
  - `version`: semver string such as `1.0.0`
  - `extends?`: optional `ThemeRef` to a base theme
  - `scopes?`: default scopes where the theme applies (`global`, `tenant`, `user`)
- **ThemeTokens**
  - `colors`, `radii`, `space`, `typography`, `shadows`, `motion`
  - each entry is a map of `{ value, description? }`
- **ComponentVariantSpec**
  - `component`: design-system component key (for example `Button`, `NavMain`)
  - `variants`: map of variant names to `{ props?, tokens? }`
- **ThemeOverride**
  - `scope`: `'global' | 'tenant' | 'user'`
  - `target`: scoped identifier such as `tenant:artisanos` or `user:123`
  - `tokens?` / `components?`: partial overrides for that target

## Authoring

```ts
import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

export const PastelTheme = defineTheme({
  meta: {
    key: 'design.pastel',
    version: '1.0.0',
    title: 'Pastel',
    description: 'Soft pastel palette for marketing surfaces.',
    domain: 'design-system',
    owners: ['platform.design'],
    tags: ['theme', 'marketing'],
    stability: 'experimental',
    scopes: ['tenant'],
  },
  tokens: {
    colors: {
      background: { value: '#fdf2f8', format: 'hex', usage: 'semantic' },
      primary: {
        value: 'oklch(0.72 0.11 221.19)',
        format: 'oklch',
        usage: 'semantic',
      },
    },
  },
  modes: {
    dark: {
      tokens: {
        colors: {
          background: {
            value: 'oklch(0.24 0.03 255)',
            format: 'oklch',
            usage: 'semantic',
          },
          primary: {
            value: 'oklch(0.64 0.15 246)',
            format: 'oklch',
            usage: 'semantic',
          },
        },
      },
    },
  },
});
```

`tokens` stays the default/light-compatible token bag. Use `modes.dark.tokens` to overlay dark-mode values and preserve full CSS color strings such as OKLCH.

Use `validateThemeSpec()` or `assertThemeSpecValid()` in CI and setup flows to catch duplicate overrides, empty targets, self-referential inheritance, invalid mode keys, and missing ownership metadata before publish time.

## Registry Usage

```ts
import { ThemeRegistry } from '@contractspec/lib.contracts-spec/themes';

const themes = new ThemeRegistry();
themes.register(PastelTheme);

const theme = themes.get('design.pastel', '1.0.0');
const tenantVariant = theme?.overrides?.find(
  (override) => override.target === 'tenant:artisanos'
);
```

The registry guarantees `key + version` uniqueness and exposes `list()` for discovery tooling.

## Rendering

The design system consumes specs through adapters you provide:

1. Resolve the base theme plus applicable overrides.
2. Merge default tokens plus the selected light/dark mode token map using `ThemeTokens`.
3. Feed the result into `mapTokensForPlatform` or the Tailwind bridge in `@contractspec/lib.design-system`.

```ts
function resolveTokens(
  registry: ThemeRegistry,
  ref: ThemeRef,
  ctx: { tenant?: string; user?: string }
) {
  const spec = registry.get(ref.key, ref.version);
  if (!spec) throw new Error('Theme not found');

  const tokens = deepMerge(spec.tokens, collectOverrides(spec.overrides, ctx));
  return mapTokensForPlatform(tokens);
}
```

## CLI

```
contractspec create theme
```

Use the theme wizard to scaffold a `.theme.ts` file that already imports and calls `defineTheme(...)`.
