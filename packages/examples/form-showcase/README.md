# @contractspec/example.form-showcase

Focused ContractSpec form example and template covering field kinds, conditional rules, and layout flows.

## What This Demonstrates

- Schema-backed `defineFormSpec` authoring with `fromZod`.
- Every current form field kind: text, email, textarea, select, checkbox, radio, switch, autocomplete, address, phone, date, time, datetime, group, and array.
- Layout variants including responsive columns, full-width spans, section flows, step flows, nested groups, horizontal/responsive orientation, and repeated group arrays.
- Form metadata for input groups, password fields, read-only/computed hints, conditional visibility/enabled/required rules, custom constraints, PII hints, and submit actions.
- A `FormRegistry` that downstream apps can import and filter.

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

## Notes

- This package intentionally does not ship a custom renderer. Host apps should map `FieldSpec` objects to their existing design-system components.
- The example is available in the templates catalog through `surfaces.templates: true`.
