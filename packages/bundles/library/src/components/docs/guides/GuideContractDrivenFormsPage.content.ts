export const leadCaptureFormCode = `import {
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
        { key: "identity", titleI18n: "Who you are", fieldNames: ["fullName", "email", "company"] },
        { key: "request", titleI18n: "What you need", fieldNames: ["intent", "notes", "newsletter"] },
      ],
    },
  },
  fields: [
    { kind: "text", name: "fullName", labelI18n: "Full name", required: true, autoComplete: "name" },
    { kind: "email", name: "email", labelI18n: "Work email", required: true, autoComplete: "email" },
    { kind: "text", name: "company", labelI18n: "Company", required: true, autoComplete: "organization" },
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
    { kind: "textarea", name: "notes", labelI18n: "Context", rows: 4, layout: { colSpan: "full" } },
    { kind: "checkbox", name: "newsletter", labelI18n: "Send product updates" },
  ],
  actions: [{ key: "submit", labelI18n: "Send request", op: { name: "lead.create", version: "1.0.0" } }],
  policy: { flags: ["lead-capture"], pii: ["fullName", "email", "company", "notes"] },
  renderHints: { ui: "shadcn", form: "react-hook-form" },
});

export const formRegistry = new FormRegistry().register(LeadCaptureForm);`;

export const leadCapturePanelCode = `"use client";

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
}`;

export const formShowcaseTemplateCode = `bun add @contractspec/example.form-showcase

# Full form-only example docs
open https://www.contractspec.io/docs/examples/form-showcase

# Template catalog filtered to forms
open https://www.contractspec.io/templates?tag=forms

# Sandbox spec preview
open https://www.contractspec.io/sandbox?template=form-showcase`;
