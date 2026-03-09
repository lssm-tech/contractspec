# @contractspec/lib.contracts-runtime-client-react

React runtime adapters for rendering ContractSpec forms and feature presentations.

Website: https://contractspec.io/

## Why this package exists

This package is the React client runtime layer extracted from `@contractspec/lib.contracts`.

It keeps rendering concerns separate from core contract definitions, while still preserving contract-first behavior:

- render presentation specs through a transform engine
- render form specs through pluggable UI driver slots
- keep UI toolkit choice external (shadcn, RN reusable components, custom)

## Package boundary (important)

Use this package for:

- Rendering `PresentationSpec` targets in React workflows.
- Rendering `FormSpec` with `react-hook-form` and Zod resolver integration.
- Bridging contract fields to your design-system components via `DriverSlots`.

Do not use this package for:

- Defining contracts (use `@contractspec/lib.contracts-spec`).
- Owning your design-system components themselves.

## Installation

```bash
npm install @contractspec/lib.contracts-runtime-client-react @contractspec/lib.contracts-spec
# or
bun add @contractspec/lib.contracts-runtime-client-react @contractspec/lib.contracts-spec
```

Required peer dependencies:

- `react`
- `react-dom`
- `react-hook-form`
- `@hookform/resolvers`
- `@blocknote/core`

## Export map

- Presentation helpers:
  - `createEngineWithDefaults`
  - `renderFeaturePresentation`
  - `createFeatureModule`
  - `registerFeature`
- Form helpers:
  - `createFormRenderer`
  - `DriverSlots` (type)
- Driver wrappers:
  - `shadcnDriver`
  - `rnReusablesDriver`

## Quick start

### Presentation rendering

```ts
import {
  createEngineWithDefaults,
  renderFeaturePresentation,
} from "@contractspec/lib.contracts-runtime-client-react";
import type { PresentationSpec } from "@contractspec/lib.contracts-spec/presentations";

declare const presentation: PresentationSpec;

const engine = createEngineWithDefaults();

const markdownOutput = await renderFeaturePresentation(
  engine,
  "markdown",
  presentation
);

console.log(markdownOutput);
```

### Form rendering with driver slots

```tsx
import {
  createFormRenderer,
  shadcnDriver,
  type DriverSlots,
} from "@contractspec/lib.contracts-runtime-client-react";
import type { FormSpec } from "@contractspec/lib.contracts-spec/forms";

declare const slots: DriverSlots;
declare const formSpec: FormSpec;

const renderer = createFormRenderer({
  driver: shadcnDriver(slots),
  onSubmitOverride: async (values, actionKey) => {
    console.log("submit", actionKey, values);
  },
});

export function ContractForm() {
  return renderer.render(formSpec);
}
```

## Driver model (key concept)

`createFormRenderer` is UI-library agnostic.

You provide a `DriverSlots` object (Field, Input, Select, Checkbox, RadioGroup, Switch, Button, etc.), and the runtime maps form contract field kinds (`text`, `textarea`, `select`, `group`, `array`, ...) to your components.

This allows:

- shared form contract logic
- custom visual identity per app
- lower coupling between schema contracts and specific UI component libraries

## Runtime behavior details

- Entry point is client-oriented (`"use client"`).
- Form renderer integrates with `react-hook-form` + Zod resolver.
- Supports conditional visibility/enablement and relation predicates from form specs.
- Supports static and resolver-based options for select/radio fields.
- Supports array fields and nested/grouped field rendering.

## AI assistant guidance

When generating code:

- Use this package when task asks to render contract-defined forms or presentations in React.
- Keep `DriverSlots` in app code so generated components stay design-system aligned.
- For non-React targets, do not use this package; use transport/runtime packages that match the target.

When debugging:

- If form fields do not render, verify driver slot coverage for the field kind.
- If resolver options stay empty, verify `resolverKey` and dependency paths in form contract.

## Surface-runtime slot integration

When using `@contractspec/lib.surface-runtime`, feature and form renderers can fill slots (e.g. `entity-section`, `form`, `entity-field`):

1. **Slot content**: Pass `FeatureRender` output or form components as `slotContent` to `BundleRenderer` for slots that `accepts` include `form` or `entity-section`.
2. **Field renderer registry**: Register custom field renderers via `@contractspec/lib.surface-runtime/runtime/field-renderer-registry` so entity fields render correctly in surface slots.
3. **Widget registry**: For `custom-widget` slots, wire your form or feature components through the widget registry.

Example: a slot with `accepts: ['form', 'entity-section']` can render `createFormRenderer(...).render(formSpec)` or `renderFeaturePresentation` output as its content.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts/client/react/feature-render` -> `@contractspec/lib.contracts-runtime-client-react/feature-render`
- `@contractspec/lib.contracts/client/react/form-render` -> `@contractspec/lib.contracts-runtime-client-react/form-render`
- `@contractspec/lib.contracts/client/react/drivers/*` -> `@contractspec/lib.contracts-runtime-client-react/drivers/*`
