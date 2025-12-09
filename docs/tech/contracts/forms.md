# Contracts: FormSpec

This document defines the canonical contracts for declarative forms.

## Overview

- `FormSpec` (in `@lssm/lib.contracts/forms`) declares:
  - `meta` (extends `OwnerShipMeta`) + `key`/`version` for stability.
  - `model` (`@lssm/lib.schema` `SchemaModel`) as the single source of truth.
  - `fields` built from `FieldSpec` kinds: `text`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `group`, `array`.
  - Optional `actions`, `policy.flags`, `constraints` and `renderHints`.
- Relations DSL provides `visibleWhen`, `enabledWhen`, `requiredWhen` based on predicates.
- `buildZodWithRelations(spec)` augments the base zod with conditional rules and constraints.
- React adapter renders with React Hook Form + driver API for UI components (shadcn driver provided).

## Driver API (UI-agnostic)

Host apps supply a driver mapping slots → components:

- Required: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Button`.
- Optional: `FieldGroup`, `FieldSet`, `FieldLegend` and input group helpers.

Use `createFormRenderer({ driver })` to obtain a `render(spec)` function.

## Arrays and Groups

- `array` items are rendered with `useFieldArray`, honoring `min`/`max` and add/remove controls.
- `group` composes nested fields and provides optional legend/description.

## Feature Flags

- Declare `policy.flags` on forms to signal gating. Gate usage at host boundary; avoid scattering flags across individual fields.

## Example

See `packages/hcircle/apps/web-coliving/src/forms/bug-report.spec.ts` for a concrete form spec and `components/forms/BugReportFormDemo.tsx` for rendering with a minimal shadcn driver mapping.
