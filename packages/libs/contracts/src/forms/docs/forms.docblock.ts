import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '../../docs/registry';

export const tech_contracts_forms_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.forms',
    title: 'Contracts: FormSpec',
    summary:
      'This document defines the canonical contracts for declarative forms.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/forms',
    tags: ['tech', 'contracts', 'forms'],
    body: '# Contracts: FormSpec\n\nThis document defines the canonical contracts for declarative forms.\n\n## Overview\n\n- `FormSpec` (in `@contractspec/lib.contracts/forms`) declares:\n  - `meta` (extends `OwnerShipMeta`) + `key`/`version` for stability.\n  - `model` (`@contractspec/lib.schema` `SchemaModel`) as the single source of truth.\n  - `fields` built from `FieldSpec` kinds: `text`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `group`, `array`.\n  - Optional `actions`, `policy.flags`, `constraints` and `renderHints`.\n- Relations DSL provides `visibleWhen`, `enabledWhen`, `requiredWhen` based on predicates.\n- `buildZodWithRelations(spec)` augments the base zod with conditional rules and constraints.\n- React adapter renders with React Hook Form + driver API for UI components (shadcn driver provided).\n\n## Driver API (UI-agnostic)\n\nHost apps supply a driver mapping slots \u2192 components:\n\n- Required: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Button`.\n- Optional: `FieldGroup`, `FieldSet`, `FieldLegend` and input group helpers.\n\nUse `createFormRenderer({ driver })` to obtain a `render(spec)` function.\n\n## Arrays and Groups\n\n- `array` items are rendered with `useFieldArray`, honoring `min`/`max` and add/remove controls.\n- `group` composes nested fields and provides optional legend/description.\n\n## Feature Flags\n\n- Declare `policy.flags` on forms to signal gating. Gate usage at host boundary; avoid scattering flags across individual fields.\n\n## Example\n\nSee `packages/hcircle/apps/web-coliving/src/forms/bug-report.spec.ts` for a concrete form spec and `components/forms/BugReportFormDemo.tsx` for rendering with a minimal shadcn driver mapping.\n',
  },
];
registerDocBlocks(tech_contracts_forms_DocBlocks);
