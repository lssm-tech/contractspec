# @contractspec/lib.design-system

`@contractspec/lib.design-system` provides higher-level design-system components, tokens, platform adapters, renderers, and composed layouts used across web, native, marketing, legal, agent, and application surfaces.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.design-system`

or

`npm install @contractspec/lib.design-system`

## What belongs here

This package owns the higher-level design-system layer:

- Theme tokens and token bridging.
- Platform helpers and responsive hooks.
- Renderers and form-contract integration.
- Higher-level atoms, molecules, organisms, templates, and visualization components.
- Registry metadata and shadcn-style component registry support.

Use this package when you want the composed design-system layer. Do not use it when a lower-level primitive from `ui-kit` or `ui-kit-web` is enough.

## Core workflows

### Import a higher-level design-system component

```ts
import { AppLayout, Button, HeroSection } from "@contractspec/lib.design-system";
```

### Work with tokens and platform helpers

```ts
import {
  createTranslationResolver,
  defaultTokens,
  mapTokensForPlatform,
  resolvePlatformTheme,
  resolveThemeRefTokens,
  withPlatformUI,
} from "@contractspec/lib.design-system";

const nativeTokens = mapTokensForPlatform("native", defaultTokens);
const ui = withPlatformUI({
  tokens: defaultTokens,
  platform: "web",
});
```

### Resolve contract-backed themes

```ts
import { ThemeRegistry } from "@contractspec/lib.contracts-spec/themes";
import { resolvePlatformTheme } from "@contractspec/lib.design-system";

const registry = new ThemeRegistry([themeSpec]);

const webTokens = resolvePlatformTheme(
  registry,
  { key: "design.brand", version: "1.0.0" },
  "web",
  { targets: ["tenant:acme"] }
);
```

### Translate ThemeSpec into Tailwind tokens

Use the Tailwind bridge when a `ThemeSpec` should drive CSS variables and
utility names without requiring a generated file:

```ts
import {
  resolveThemeModeTokens,
  themeSpecToCssVariables,
  themeSpecToTailwindCss,
  themeSpecToTailwindPreset,
} from "@contractspec/lib.design-system";

const tokens = resolveThemeModeTokens(themeSpec, "light", {
  targets: ["tenant:acme"],
});

export default themeSpecToTailwindPreset(tokens);

const variables = themeSpecToCssVariables(themeSpec, {
  targets: ["tenant:acme"],
});

const cssText = themeSpecToTailwindCss(variables, {
  includeCustomVariant: true,
});
```

The bridge emits stable variables such as `--ds-color-primary`,
`--ds-radius-md`, and `--ds-space-sm`, plus Tailwind v4 `@theme inline`
aliases like `--color-primary: var(--ds-color-primary)`. Color values are
passed through unchanged, so OKLCH tokens such as
`oklch(0.72 0.11 221.19)` can be authored directly in `ThemeSpec`.

### Provide translations to contract-driven renderers

```tsx
import {
  createTranslationResolver,
  DesignSystemTranslationProvider,
} from "@contractspec/lib.design-system";

const resolver = createTranslationResolver({
  registry: translationRegistry,
  locale: "fr",
  specKeys: ["design-system.form", "design-system.data-view"],
});

<DesignSystemTranslationProvider resolver={resolver}>
  {children}
</DesignSystemTranslationProvider>;
```

### Provide contract-backed themes to controls

```tsx
import {
  DesignSystemThemeProvider,
  Input,
  Select,
} from "@contractspec/lib.design-system";

<DesignSystemThemeProvider
  theme={themeSpec}
  targets={["tenant:acme"]}
  mode="dark"
  applyCssVariables
>
  <Input
    componentKey="Input"
    themeVariant="default"
    placeholderI18n="form.customerName.placeholder"
  />
  <Select
    componentKey="Select"
    options={[{ labelI18n: "status.draft", value: "draft" }]}
  />
</DesignSystemThemeProvider>;
```

### Use form controls from the design-system boundary

The root barrel exposes themed and translation-aware controls for product
surfaces: `Button`, `Input`, `Textarea`, `Select`, `NativeSelect`,
`Autocomplete`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch`, `DatePicker`,
`TimePicker`, `DateTimePicker`, `DateRangePicker`, `Field*`, `InputGroup`,
`InputOTP`, `LoadingButton`, plus `Box`, `HStack`, and `VStack`.

### Render forms on mobile through the shared renderer

Use the focused shared renderer subpath when rendering `FormSpec` contracts in
Expo or React Native apps:

```tsx
import { formRenderer } from "@contractspec/lib.design-system/renderers";
```

Expo apps must keep the presentation Metro aliases enabled so design-system
imports of `@contractspec/lib.ui-kit-web/ui/*` are remapped to
`@contractspec/lib.ui-kit/ui/*` at bundle time:

```js
const {
  withPresentationMetroAliases,
} = require("@contractspec/lib.presentation-runtime-core");

module.exports = withPresentationMetroAliases(config, { monorepoRoot });
```

### Render the canonical account grid

The canonical data-table example lives in
[`@contractspec/example.data-grid-showcase`](../../examples/data-grid-showcase/README.md).
Its composed lane uses `DataTable`, `DataTableToolbar`, and `DataViewTable`
from this package:

```tsx
import {
  Button,
  DataTable,
  DataTableToolbar,
  DataViewTable,
} from '@contractspec/lib.design-system';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { DataGridShowcaseDataView } from '@contractspec/example.data-grid-showcase/contracts/data-grid-showcase.data-view';
import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function AccountHealthTable() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'multiple',
    initialState: {
      sorting: [{ id: 'arr', desc: true }],
      pagination: { pageIndex: 0, pageSize: 4 },
      columnVisibility: { notes: false },
      columnPinning: { left: ['account'], right: [] },
    },
    renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
    getCanExpand: () => true,
  });

  return (
    <>
      <DataTable
        controller={controller}
        title="Account health"
        description="Composed table surface for the canonical account grid."
        headerActions={<Button variant="outline">Reset</Button>}
        toolbar={
          <DataTableToolbar
            controller={controller}
            searchPlaceholder="Search accounts"
            actionsStart={
              <Button variant="outline" size="sm">
                Risk Only
              </Button>
            }
          />
        }
        loading={false}
        emptyState={<div>No rows available.</div>}
        footer={\`Page \${controller.pageIndex + 1} of \${controller.pageCount}\`}
      />

      <DataViewTable
        spec={DataGridShowcaseDataView}
        items={SHOWCASE_ROWS}
      />
    </>
  );
}
```

`DataTable` remains the composed card/container surface. `DataTableToolbar` is
the recommended ergonomic layer for search, chips, selection summary, and
hidden-column recovery without widening the primitive table API.

## API map

### Theme and platform

- `defaultTokens` and token interfaces from `./theme/tokens`
- `mapTokensForPlatform` from `./theme/tokenBridge`
- `resolveThemeSpecTokens`, `resolveThemeRefTokens`, and `resolvePlatformTheme` from `./theme/contracts`
- `resolveThemeModeTokens`, `themeSpecToCssVariables`, `themeSpecToTailwindTheme`, `themeSpecToTailwindPreset`, and `themeSpecToTailwindCss`
- `DesignSystemThemeProvider`, `useDesignSystemTheme`, and `useComponentTheme`
- theme variants
- `withPlatformUI`
- `useColorScheme`
- `useReducedMotion`
- `useResponsive`

### Renderers and hooks

- renderer exports from `./renderers`
- form-contract renderer support, including readonly, autocomplete, address, phone, date, time, and datetime FormSpec fields
- translation-aware rendering through `DesignSystemTranslationProvider` and `createTranslationResolver`
- theme-aware form controls and stack primitives that consume ThemeSpec component variant props
- hooks such as `useListUrlState`
- navigation-related shared types

### Component composition layers

- atoms
- forms
- legal
- marketing
- molecules
- organisms
- templates
- visualization
- agent and approval components

The root barrel is the primary API and already groups these exports in one place.

## Public surface

The root barrel at `src/index.ts` is the main public API for this package.

The export map is broad, but it is centralized:

- theme and platform helpers
- renderer exports
- high-level components grouped by composition layer
- hooks and shared types

The package also ships registry metadata and build support:

- `components.json`
- `registry/registry.json`
- `bun run registry:build`

## Operational semantics and gotchas

- Token names and token shapes are compatibility surface.
- `mapTokensForPlatform()` deliberately returns different token shapes for web and native, and can now map resolved contract-backed tokens.
- `withPlatformUI()` is a lightweight adapter, not a full runtime framework.
- `DesignSystemThemeProvider` resolves `ThemeSpec` / `ThemeRef` tokens, scoped overrides, and component variant default props. Explicit caller props win over theme defaults.
- The root barrel is broad and therefore high-blast-radius.
- This package depends on both `ui-kit` and `ui-kit-web`.
- The package includes legal, marketing, agent, app-shell, and visualization compositions, not just low-level primitives.

## When not to use this package

- Do not use it for tiny low-level utilities.
- Do not use it for router-agnostic links.
- Do not use it when a single lower-level primitive from `ui-kit` or `ui-kit-web` is enough.

## Related packages

- `@contractspec/lib.ui-kit`
- `@contractspec/lib.ui-kit-web`
- `@contractspec/lib.ui-kit-core`
- `@contractspec/lib.ui-link`

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
