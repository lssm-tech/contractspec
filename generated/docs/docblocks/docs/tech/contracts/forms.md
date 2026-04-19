# Contracts: FormSpec

This document defines the canonical contracts for declarative forms.

## Overview

- `FormSpec` (in `@contractspec/lib.contracts-spec/forms`) declares:
  - `meta` (extends `OwnerShipMeta`) + `key`/`version` for stability.
  - `model` (`@contractspec/lib.schema` `SchemaModel`) as the single source of truth.
  - `fields` built from `FieldSpec` kinds: `text`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `autocomplete`, `address`, `phone`, `date`, `time`, `datetime`, `group`, `array`.
  - field-level `readOnly` support that preserves submitted values.
  - Optional `actions`, `policy.flags`, `constraints` and `renderHints`.
- Relations DSL provides `visibleWhen`, `enabledWhen`, `requiredWhen` based on predicates.
- `buildZodWithRelations(spec)` augments the base zod with conditional rules and constraints.
- React adapter renders with React Hook Form + driver API for UI components (shadcn driver provided).

## Rich field contracts

- `autocomplete` supports local or resolver-backed search and configurable submit-value mapping.
- `address` uses the canonical `AddressFormValue` object shape.
- `phone` uses the canonical `PhoneFormValue` object shape.
- `date`, `time`, and `datetime` map directly to the corresponding schema scalar intent.
- `array` remains the canonical dynamic-field primitive and can now repeat grouped item layouts.

## Driver API (UI-agnostic)

Host apps supply a driver mapping slots → components:

- Required: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Autocomplete`, `AddressField`, `PhoneField`, `DateField`, `TimeField`, `DateTimeField`, `Button`.
- Optional: `FieldGroup`, `FieldSet`, `FieldLegend` and input group helpers.

Use `createFormRenderer({ driver })` to obtain a `render(spec)` function.

## Arrays and Groups

- `array` items are rendered with `useFieldArray`, honoring `min`/`max` and add/remove controls.
- `array.of` can repeat grouped multi-field rows.
- `group` composes nested fields and provides optional legend/description.

## Feature Flags

- Declare `policy.flags` on forms to signal gating. Gate usage at host boundary; avoid scattering flags across individual fields.

## Example

Use the exported `RichFieldsShowcaseForm` as the canonical reference for readonly, autocomplete, address, phone, and temporal field authoring.
