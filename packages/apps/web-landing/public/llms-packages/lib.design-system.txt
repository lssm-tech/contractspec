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

Focused public subpaths are available when consumers do not need the full root
barrel:

```ts
import { themeSpecToTailwindPreset } from "@contractspec/lib.design-system/theme";
import { Select } from "@contractspec/lib.design-system/controls";
import { FormDialog } from "@contractspec/lib.design-system/forms";
import { HStack } from "@contractspec/lib.design-system/layout";
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
  <Select
    componentKey="Select"
    groups={[
      {
        labelI18n: "status.lifecycle",
        options: [{ labelI18n: "status.draft", value: "draft" }],
      },
      {
        labelI18n: "status.release",
        options: [{ labelI18n: "status.published", value: "published" }],
      },
    ]}
  />
</DesignSystemThemeProvider>;
```

When both `options` and `groups` are provided to `Select`, grouped options are
used and the flat `options` list is ignored.

### Use form controls from the design-system boundary

The root barrel exposes themed and translation-aware controls for product
surfaces: `Button`, `Input`, `Textarea`, `Select`, `NativeSelect`,
`Autocomplete`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch`, `DatePicker`,
`TimePicker`, `DateTimePicker`, `DateRangePicker`, `Field*`, `InputGroup`,
`InputOTP`, `LoadingButton`, plus `Box`, `HStack`, and `VStack`.

`Field*` includes semantic `FieldSet`, `FieldLegend`, `FieldGroup`,
`FieldContent`, `FieldLabel`, `FieldDescription`, `FieldError`, and
`FieldSeparator` wrappers so contract-driven forms can preserve accessible
legend, description, invalid, and grouped-control structure.

The `Autocomplete` control renders through the shared combobox primitive on web
and keeps native rendering aligned for query, selected options, loading, error,
and empty states. FormSpec renderers pass resolver-backed async state through
these props without requiring product surfaces to know the underlying transport.

### Compose application shells

Use the shell subpath for app frames that need sidebar navigation, topbar
breadcrumbs, command search, account actions, and a right-side page outline.
The same typed shell contract has web and native entrypoints.

```tsx
import { AppShell } from "@contractspec/lib.design-system/shell";

<AppShell
  title="Workspace"
  commands={[
    {
      heading: "Actions",
      items: [{ id: "new-project", label: "New project" }],
    },
  ]}
  navigation={[
    {
      title: "Main",
      items: [
        {
          label: "Projects",
          href: "/projects",
          children: [{ label: "Active", href: "/projects/active" }],
        },
      ],
    },
  ]}
  breadcrumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]}
  pageOutline={[
    { id: "summary", label: "Summary" },
    { id: "details", label: "Details", level: 2 },
    { id: "audit", label: "Audit trail", level: 3 },
  ]}
>
  {children}
</AppShell>;
```

On desktop web, `AppShell` renders a sidebar, sticky topbar, content region, and
optional `PageOutline` rail. On small web screens, navigation and page outline
move behind accessible menu triggers. On native, the shell maps primary
navigation to bottom tabs and keeps overflow navigation, actions, user content,
and page outline inside the menu sheet.

`AppShell` also accepts a prop-driven `notifications` center for in-app
notifications. Hosts provide structural `items`, `unreadCount`, loading/empty
state, and callbacks such as `onSelect`, `onMarkRead`, and `onMarkAllRead`; the
design-system shell renders the web topbar trigger and native menu section
without importing or owning any notification runtime package.

Shell navigation and command items may carry optional `policy` metadata plus a `policyBehavior` of `hide`, `disable`, or `show-with-lock`. Use `filterShellNavigationForPolicy()` / `annotateShellCommandsDecisions()` with decisions produced by your application runtime; AppShell only adapts affordances and does not fetch permissions or enforce backend access.

### Render actionable object references

Use `ObjectReferenceHandler` when product surfaces render references that usually
need quick interaction, such as addresses, phone numbers, users, customers,
files, URLs, or tenant-specific objects.

```tsx
import {
  ObjectReferenceHandler,
  createMapsReferenceActions,
} from "@contractspec/lib.design-system";

const address = {
  id: "customer-site",
  kind: "address",
  label: "10 Downing Street",
  value: "10 Downing Street, London",
  properties: [
    { id: "site-phone", kind: "phone", label: "Phone", value: "+33 1 23 45 67 89" },
    { id: "site-email", kind: "email", label: "Email", value: "hello@example.com" },
  ],
} as const;

<ObjectReferenceHandler
  reference={address}
  interactivityVisibility="icon"
  actions={createMapsReferenceActions(address)}
  openTarget="new-page"
  panelMode="responsive"
/>;
```

The descriptor and action descriptor types are intentionally data-only:
`id`, `kind`, `label`, `value`, `href`, `openTarget`, nested `properties`,
`sections`, `metadata`, and optional `iconKey`. Nested properties are regular
object reference descriptors, so a `user` reference can display email, phone,
address, file, and URL interactions in the same panel.
Runtime behavior belongs in props such as `actionHandlers`, `copyHandler`,
`openHref`, `renderTrigger`, `renderDetail`, `renderAction`, `renderProperty`,
`renderSection`, and `iconRenderer`. This keeps the surface compatible with
future declarative ContractSpec schema work without making React callbacks part
of the descriptor contract.

Web uses the exported `AdaptivePanel` primitive by default:
`panelMode="responsive"` renders a sheet on desktop and a bottom drawer on small
screens. Use `AdaptivePanel` directly for the same sheet/drawer decision outside
object references, or set `panelMode="sheet"` / `panelMode="drawer"` to force
one presentation. Detail links default to same-page navigation; set
`openTarget="new-page"` on the handler, reference, or action to open in a new
page. Native exports the same prop contract through the focused object-reference
subpath and uses a disclosure-style fallback until `@contractspec/lib.ui-kit`
provides a real native sheet primitive.

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
DataView-driven tables also honor field and column overflow hints from
`DataViewSpec`: column hints override field hints, markdown wraps by default,
compact scalar formats truncate, `expand` adds detail to the row expansion
surface, and `hideColumn` starts hidden when column visibility is enabled.
Collection `DataViewSpec` contracts can also declare `view.collection` defaults
for list/grid/table mode switching, toolbar controls, query page size, and
density. They can also declare `collection.dataDepth` and field-level
`visibility.minDataDepth` so one spec can project summary, standard, detailed,
or exhaustive fields. `DataViewRenderer` uses those defaults for web and native
renderers while keeping caller props authoritative through `viewMode`,
`density`, `dataDepth`, `onViewModeChange`, `onDensityChange`, and
`onDataDepthChange`. Personalization integrations should resolve preferences in
the host app and pass ordinary renderer props; the design system intentionally
does not import `@contractspec/lib.personalization`.

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
- form-contract renderer support, including readonly, email, password, autocomplete, address, phone, date, time, datetime, semantic FormSpec groups, grid layout hints, progressive FormSpec sections/steps, mobile-safe FormSpec column helper output, and text/textarea/email input groups
- translation-aware rendering through `DesignSystemTranslationProvider` and `createTranslationResolver`
- theme-aware form controls and stack primitives that consume ThemeSpec component variant props
- hooks such as `useListUrlState`, including scoped list filters where locked constraints are excluded from user-editable URL state
- DataViewRenderer filter chips for scoped DataView filters, including disabled locked chips on web and native surfaces
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

- `.` for backward-compatible root imports across theme, platform, renderers, controls, and composed components
- `./theme` for ThemeSpec runtime, platform token mapping, and Tailwind bridge helpers
- `./controls` for themed and translated controls
- `./forms` for form controls, layouts, and `ZodForm`
- `./layout` for `Box`, `HStack`, and `VStack`
- `./renderers` for focused renderer imports such as `formRenderer`
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
