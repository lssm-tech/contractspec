# @contractspec/example.form-showcase

Focused ContractSpec form example and template covering field kinds, conditional rules, and layout flows.

## What This Demonstrates

- Schema-backed `defineFormSpec` authoring with `fromZod`.
- Every current form field kind: text, email, textarea, select, checkbox, radio, switch, autocomplete, address, phone, date, time, datetime, group, and array.
- Layout variants including responsive columns, full-width spans, section flows, step flows, nested groups, horizontal/responsive orientation, and repeated group arrays.
- Form metadata for input groups, password fields, read-only/computed hints, conditional visibility/enabled/required rules, custom constraints, PII hints, and submit actions.
- A `FormRegistry` that downstream apps can import and filter.
- A `FormShowcasePreview` UI that demonstrates the specs with real form controls across field kinds, sections, arrays, groups, and step layouts.

## Running Locally

From `packages/examples/form-showcase`:

- `bun run build`
- `bun run typecheck`
- `bun run test`
- `bun run smoke`
- `bun run preflight`

## Usage

Import the registry or individual form specs:

```ts
import {
	FormShowcaseRegistry,
	FormShowcaseAllFieldsForm,
	FormShowcaseProgressiveStepsForm,
} from "@contractspec/example.form-showcase/forms";
```

Use this package as a form-only template when you want a compact reference for ContractSpec form authoring without a larger business app around it.

## Public Entry Points

- `@contractspec/example.form-showcase`
- `@contractspec/example.form-showcase/example`
- `@contractspec/example.form-showcase/forms`
- `@contractspec/example.form-showcase/forms/all-fields.form`
- `@contractspec/example.form-showcase/forms/form-showcase.docs`
- `@contractspec/example.form-showcase/forms/progressive-steps.form`
- `@contractspec/example.form-showcase/docs`
- `@contractspec/example.form-showcase/ui`
- `@contractspec/example.form-showcase/ui/FormShowcasePreview`

## Notes

- This package intentionally does not ship a production custom renderer. Its preview uses real controls and the same sample data to demonstrate the contract capabilities, while host apps can map `FieldSpec` objects to their own design-system components for fully interactive forms.
- The example is available in the templates catalog through `surfaces.templates: true`.
