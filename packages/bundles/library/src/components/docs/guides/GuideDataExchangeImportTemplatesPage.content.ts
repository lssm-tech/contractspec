export const accountImportTemplateCode = `import {
  createImportPlan,
  createRecordBatch,
  defineDataExchangeTemplate,
  previewImport,
} from "@contractspec/lib.data-exchange-core";
import { defineSchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

const AccountImportSchema = defineSchemaModel({
  name: "AccountImport",
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    active: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const accountImportTemplate = defineDataExchangeTemplate({
  key: "accounts.import",
  version: "1.0.0",
  title: "Account import",
  columns: [
    {
      key: "id",
      label: "Account ID",
      targetField: "id",
      required: true,
      sourceAliases: ["Account Identifier", "External ID", "No compte"],
    },
    {
      key: "status",
      label: "Status",
      targetField: "status",
      required: true,
      sourceAliases: ["Statut", "State"],
      format: { kind: "text", trim: true, case: "lowercase" },
    },
    {
      key: "amount",
      label: "Amount",
      targetField: "amount",
      required: true,
      sourceAliases: ["Montant", "Balance"],
      format: { kind: "number", decimalSeparator: ",", thousandsSeparator: "." },
    },
    {
      key: "active",
      label: "Active",
      targetField: "active",
      sourceAliases: ["Actif", "Enabled"],
      format: { kind: "boolean", trueValues: ["yes", "oui"], falseValues: ["no", "non"] },
    },
    {
      key: "tags",
      label: "Tags",
      targetField: "tags",
      format: { kind: "split", delimiter: ";" },
    },
  ],
});

const sourceBatch = createRecordBatch([
  {
    "No compte": "acc-1",
    Statut: " Active ",
    Montant: "1.234,50",
    Actif: "oui",
    Tags: "vip; beta",
  },
]);

const preview = previewImport(
  createImportPlan({
    source: { kind: "memory", batch: sourceBatch, format: "csv" },
    target: { kind: "memory", format: "json" },
    schema: AccountImportSchema,
    sourceBatch,
    template: accountImportTemplate,
  }),
);

console.log(preview.plan.mappingSource); // "template"
console.log(preview.normalizedRecords[0]);`;

export const serverDryRunCode = `import { defineDataExchangeTemplate } from "@contractspec/lib.data-exchange-core";
import { dryRunImport, executeImport } from "@contractspec/lib.data-exchange-server";

const template = defineDataExchangeTemplate({
  key: "accounts.import",
  version: "1.0.0",
  columns: [
    { key: "id", label: "Account ID", targetField: "id", required: true, sourceAliases: ["Account Identifier"] },
    { key: "amount", label: "Amount", targetField: "amount", format: { kind: "currency", currencySymbol: "€", decimalSeparator: "," } },
  ],
});

const partnerSource = {
  kind: "file",
  path: "partner-accounts.csv",
  format: "csv",
  codecOptions: { csv: { delimiter: ";", skipRows: 1 } },
} as const;

const formatProfile = {
  columns: {
    amount: { kind: "currency", currencySymbol: "€", decimalSeparator: "," },
  },
} as const;

const preview = await dryRunImport({
  source: partnerSource,
  target: { kind: "memory", format: "json" },
  schema: AccountImportSchema,
  template,
  formatProfile,
});

const blockingIssues = preview.issues.filter((issue) => issue.severity === "error");

if (blockingIssues.length === 0) {
  await executeImport({
    source: partnerSource,
    target: { kind: "memory", format: "json" },
    schema: AccountImportSchema,
    template,
    formatProfile,
  });
}`;

export const clientReviewCode = `"use client";

import { useDataExchangeController } from "@contractspec/lib.data-exchange-client";

export function ImportMappingReview({ preview }) {
  const controller = useDataExchangeController({ preview });
  const replacementSourceColumn = controller.model.ignoredSourceColumns[0];

  return (
    <section>
      {controller.model.templateRows.map((row) => (
        <button
          key={row.id}
          type="button"
          disabled={!replacementSourceColumn}
          onClick={() => {
            if (!replacementSourceColumn) return;
            controller.selectAlias(row.targetField, replacementSourceColumn);
          }}
        >
          {row.label}: {row.sourceField || "Unmatched"} -> {row.targetField}
          {row.required ? " required" : ""}
          {row.formatLabel ? \` (\${row.formatLabel})\` : ""}
        </button>
      ))}
      {controller.model.unmatchedRequiredRows.length > 0 ? (
        <p>Resolve required columns before import.</p>
      ) : null}
    </section>
  );
}`;

export const developerPrompt = `You are adding an import flow to a ContractSpec app.

Define a reusable data-exchange template for this canonical schema:
- target fields, required flags, and display labels
- known partner column aliases
- value formats for numbers, dates, booleans, JSON, split/join lists, currency, and percentages

Wire the template into core preview planning and server dry-run execution. Keep explicit mappings higher precedence than template resolution. Return the template, preview call, server dry-run call, and tests for alias matching plus localized formatting.`;

export const partnerPrompt = `A partner sent a CSV/JSON/XML file that does not match our recommended import template.

Compare the incoming headers and value samples against this ContractSpec data-exchange template. Propose:
- source-to-target column matches with confidence
- missing required target fields
- ignored source columns
- format overrides for localized numbers, booleans, dates, JSON, split/join lists, currency, or percentages

Do not execute the import. Produce a dry-run plan and the user-facing review copy.`;

export const verificationCode = `cd packages/libs/data-exchange-core && bun test && bun run typecheck && bun run lint:check
cd packages/libs/data-exchange-client && bun test && bun run typecheck && bun run lint:check
cd packages/libs/data-exchange-server && bun test && bun run typecheck && bun run lint:check`;
