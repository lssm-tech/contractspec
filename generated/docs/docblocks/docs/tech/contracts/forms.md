# Contracts: FormSpec

This document defines the canonical contracts for declarative forms.

## Overview

- `FormSpec` (in `@contractspec/lib.contracts-spec/forms`) declares:
  - `meta` (extends `OwnerShipMeta`) + `key`/`version` for stability.
  - `model` (`@contractspec/lib.schema` `SchemaModel`) as the single source of truth.
  - `fields` built from `FieldSpec` kinds: `text`, `email`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `autocomplete`, `address`, `phone`, `number`, `percent`, `currency`, `date`, `time`, `datetime`, `duration`, `group`, `array`.
  - `text.password` for masked current/new password fields with password-manager hints.
  - field-level `readOnly` support that preserves submitted values.
  - Optional `layout`, `layout.flow`, `actions`, `policy.flags`, `constraints` and `renderHints`.
- Relations DSL provides `visibleWhen`, `enabledWhen`, `requiredWhen` based on predicates.
- `buildZodWithRelations(spec)` augments the base zod with conditional rules and constraints.
- React adapter renders with React Hook Form + driver API for UI components.

## Rich field contracts

- `autocomplete` supports local filtering or resolver-backed search, including debounce/min-query hints and configurable submit-value mapping.
- Resolver-backed autocomplete stays runtime-neutral: forms declare `resolverKey`, dependency paths, and optional args while host renderers provide the actual fetcher.
- `email` represents one string email-address field; schema validation remains model-owned while renderers supply email input affordances.
- `address` uses the canonical `AddressFormValue` object shape.
- `phone` uses the canonical `PhoneFormValue` object shape.
- `number`, `percent`, and `currency` map numeric schema intent to native input controls while preserving locale, precision, rounding, and currency-display metadata.
- `date`, `time`, `datetime`, and `duration` map temporal schema intent to native controls while preserving locale, timezone, unit, and display metadata.
- `array` remains the canonical dynamic-field primitive and can repeat grouped item layouts.
- `text` can declare `password.purpose` as `current` or `new`; renderers map those to masked controls and `current-password` / `new-password` autocomplete hints.

## Progressive form layout

- `layout.flow.kind: "sections"` groups existing fields into accessible sections while keeping all sections visible.
- `layout.flow.kind: "steps"` uses the same section metadata for progressive, one-section-at-a-time rendering.
- `FormSectionSpec.fieldNames` references existing immediate field names; field definitions stay in `FormSpec.fields`.
- Unlisted fields remain visible so flow metadata cannot accidentally drop required model inputs.
- `text` and `textarea` can declare portable `inputGroup` addons for text and host-resolved icons.

## Layout and Groups

- `FormSpec.layout` and `group.layout` can declare 1-4 responsive columns, gap size, and default field orientation.
- `field.layout.colSpan` lets fields span one or more grid columns or the full row.
- `wrapper.orientation` remains a compatibility alias for `layout.orientation`.
- `group.legendI18n` renders as the semantic legend, falling back to `labelI18n`.

## Driver API (UI-agnostic)

Host apps supply a driver mapping slots to components:

- Required: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Autocomplete`, `AddressField`, `PhoneField`, `NumberField`, `PercentField`, `CurrencyField`, `DateField`, `TimeField`, `DateTimeField`, `DurationField`, `Button`.
- Optional: `FieldContent`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupTextarea`, `InputGroupText`, `InputGroupIcon`, and `PasswordInput`.
- Autocomplete drivers should accept optional `loading`, `error`, `emptyText`, `loadingText`, and `errorText` props so resolver-backed fields can expose async state without embedding transport details in the contract.

Use `createFormRenderer({ driver })` to obtain a `render(spec)` function.

## Arrays and Groups

- `array` items are rendered with `useFieldArray`, honoring `min`/`max` and add/remove controls.
- `array.of` can repeat grouped multi-field rows.
- `group` composes nested fields and provides optional legend/description/layout.

## Feature Flags

- Declare `policy.flags` on forms to signal gating. Gate usage at host boundary; avoid scattering flags across individual fields.

## Example

Use the exported `RichFieldsShowcaseForm` as the canonical reference for readonly, password, autocomplete, address, phone, temporal, layout, and input-group field authoring.
