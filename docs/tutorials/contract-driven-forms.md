# Build A Contract-Driven Form

This tutorial shows how to model a customer-facing form with ContractSpec so the data shape, field list, layout, policy hints, and submit action stay in one reusable contract.

Use this when you want a form that can be rendered in a web app today and reused later for generated docs, mobile screens, Studio review, or agent-facing workflows.

## What You Will Build

- A `FormSpec` backed by a Zod model.
- A `FormRegistry` that exposes the latest form version by key.
- A React renderer call that submits through your existing endpoint.
- A rollout checklist for safe form evolution.

## Start From The Form Showcase Template

If you want a form-only reference before building from scratch, use the focused Form Showcase example:

- Package: `@contractspec/example.form-showcase`
- Source: `packages/examples/form-showcase`
- Docs route: `/docs/examples/form-showcase`
- Template catalog: `/templates?tag=forms`
- Sandbox route: `/sandbox?template=form-showcase`

It covers text, email, textarea, select, checkbox, radio, switch, autocomplete, address, phone, date, time, datetime, group, and array fields, plus sections, steps, responsive columns, conditionals, constraints, and PII metadata.

## Install The Packages

```bash
bun add @contractspec/lib.contracts-spec @contractspec/lib.schema zod
bun add @contractspec/lib.design-system
```

If you use your own component library, keep the first line and replace the design-system renderer with a custom `createFormRenderer({ driver })` adapter from `@contractspec/lib.contracts-runtime-client-react/form-render`.

## Define The Form Contract

Create `src/contracts/forms/lead-capture.form.ts`.

```ts
import {
  defineFormSpec,
  FormRegistry,
  responsiveFormColumns,
} from "@contractspec/lib.contracts-spec/forms";
import { fromZod } from "@contractspec/lib.schema";
import { z } from "zod";

const LeadCaptureModel = fromZod(
  z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    company: z.string().min(1),
    intent: z.enum(["demo", "pricing", "pilot"]),
    notes: z.string().max(1000).optional(),
    newsletter: z.boolean().optional(),
  }),
  { name: "LeadCaptureModel" },
);

export const LeadCaptureForm = defineFormSpec({
  meta: {
    key: "marketing.lead.form",
    version: "1.0.0",
    title: "Lead capture form",
    description: "Collect qualified OSS and Studio leads.",
    domain: "marketing",
    owners: ["@growth"],
    tags: ["forms", "leads"],
    stability: "experimental",
  },
  model: LeadCaptureModel,
  layout: {
    columns: responsiveFormColumns(2),
    gap: "md",
    flow: {
      kind: "sections",
      sections: [
        {
          key: "identity",
          titleI18n: "Who you are",
          fieldNames: ["fullName", "email", "company"],
        },
        {
          key: "request",
          titleI18n: "What you need",
          fieldNames: ["intent", "notes", "newsletter"],
        },
      ],
    },
  },
  fields: [
    {
      kind: "text",
      name: "fullName",
      labelI18n: "Full name",
      required: true,
      autoComplete: "name",
    },
    {
      kind: "email",
      name: "email",
      labelI18n: "Work email",
      required: true,
      autoComplete: "email",
    },
    {
      kind: "text",
      name: "company",
      labelI18n: "Company",
      required: true,
      autoComplete: "organization",
    },
    {
      kind: "select",
      name: "intent",
      labelI18n: "Primary goal",
      required: true,
      options: [
        { labelI18n: "Book a demo", value: "demo" },
        { labelI18n: "Understand pricing", value: "pricing" },
        { labelI18n: "Plan a pilot", value: "pilot" },
      ],
    },
    {
      kind: "textarea",
      name: "notes",
      labelI18n: "Context",
      rows: 4,
      layout: { colSpan: "full" },
    },
    {
      kind: "checkbox",
      name: "newsletter",
      labelI18n: "Send product updates",
    },
  ],
  actions: [
    {
      key: "submit",
      labelI18n: "Send request",
      op: { name: "lead.create", version: "1.0.0" },
    },
  ],
  policy: {
    flags: ["lead-capture"],
    pii: ["fullName", "email", "company", "notes"],
  },
  renderHints: { ui: "shadcn", form: "react-hook-form" },
});

export const formRegistry = new FormRegistry().register(LeadCaptureForm);
```

The important split is deliberate:

- `model` owns runtime data shape and validation intent.
- `fields` owns visible controls and accessibility labels.
- `layout` owns responsive columns and section or step flow.
- `actions` links buttons to contract operations.
- `policy` documents flags and PII so the host can gate and audit usage.

## Render The Form In React

Create `src/components/LeadCapturePanel.tsx`.

```tsx
"use client";

import { formRenderer } from "@contractspec/lib.design-system/renderers/form-contract";
import { LeadCaptureForm } from "../contracts/forms/lead-capture.form";

export function LeadCapturePanel() {
  return formRenderer.render(LeadCaptureForm, {
    defaultValues: { newsletter: true },
    overrides: {
      onSubmitOverride: async (values, actionKey) => {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ actionKey, values }),
        });
      },
    },
  });
}
```

The renderer reads field kinds such as `text`, `email`, `textarea`, `select`, and `checkbox`, applies the declared layout, and keeps submit metadata attached to the action key.

## Wire The Submit Endpoint

The form can submit to any handler you already own. Keep business logic outside the UI component.

```ts
export async function POST(request: Request) {
  const { values } = await request.json();

  // Persist, enqueue, or forward to your CRM here.
  return Response.json({
    ok: true,
    receivedEmail: values.email,
  });
}
```

For stricter systems, bind `actions[0].op` to a `defineCommand(...)` operation and execute through an `OperationSpecRegistry` so the same contract drives REST, GraphQL, MCP, and generated docs.

## Validate And Version

```bash
contractspec validate src/contracts/forms/lead-capture.form.ts
```

Expected result:

```txt
Validation passed
```

Treat a public form as compatibility surface:

- Add optional fields without changing existing field meaning.
- Bump `meta.version` for required fields, renamed fields, or changed submit semantics.
- Keep PII declarations current when collecting personal or sensitive data.
- Prefer `layout.flow.kind: "steps"` for long forms and `layout.flow.kind: "sections"` for short forms.
- Use `responsiveFormColumns(...)` instead of desktop-only layouts.

## Customer Rollout Checklist

- The Zod model rejects invalid input before persistence.
- Every field has a visible label or semantic group legend.
- Submit logic does not live inside the renderer configuration beyond calling a handler.
- Feature flags and PII are declared in `policy`.
- The route, docs, and tests reference the same form key and version.
- Form changes are reviewed like API changes once customers depend on them.
