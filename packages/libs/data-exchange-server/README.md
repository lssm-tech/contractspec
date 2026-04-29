# @contractspec/lib.data-exchange-server

Website: https://contractspec.io

**Server-side adapters, execution services, and workflow templates for SchemaModel-first data interchange.**

## What It Provides

- File, HTTP, SQL, and storage adapter families.
- Dry-run, validation, preview, execute, retry, and audit services.
- `WorkflowSpec` templates for interchange orchestration.

## Usage

Import the root entrypoint from `@contractspec/lib.data-exchange-server`, or use `./adapters`, `./services`, and `./workflow`.

## Template-Aware Imports

Server dry-runs and executions accept the same import templates as core. This lets users upload partner-specific CSV/JSON/XML layouts while the server previews normalized records before writing them.

```ts
import { defineDataExchangeTemplate } from "@contractspec/lib.data-exchange-core";
import { dryRunImport, executeImport } from "@contractspec/lib.data-exchange-server";

const template = defineDataExchangeTemplate({
	key: "invoices.import",
	version: "1.0.0",
	columns: [
		{
			key: "id",
			label: "Invoice ID",
			targetField: "id",
			required: true,
			sourceAliases: ["Invoice Number", "No facture"],
		},
		{
			key: "amount",
			label: "Amount",
			targetField: "amount",
			format: {
				kind: "number",
				decimalSeparator: ",",
				thousandsSeparator: ".",
			},
		},
	],
});

const preview = await dryRunImport({
	source: {
		kind: "file",
		path: "partner.csv",
		format: "csv",
		codecOptions: { csv: { delimiter: ";", skipRows: 1 } },
	},
	target: { kind: "memory", format: "json" },
	schema: InvoiceImportSchema,
	template,
});

if (preview.issues.every((issue) => issue.severity !== "error")) {
	await executeImport({
		source: {
			kind: "file",
			path: "partner.csv",
			format: "csv",
			codecOptions: { csv: { delimiter: ";", skipRows: 1 } },
		},
		target: { kind: "memory", format: "json" },
		schema: InvoiceImportSchema,
		template,
	});
}
```

Execution audit entries record whether mappings came from explicit mappings, template resolution, or inference.
