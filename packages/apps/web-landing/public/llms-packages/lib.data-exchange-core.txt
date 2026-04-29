# @contractspec/lib.data-exchange-core

Website: https://contractspec.io

**SchemaModel-first core primitives for data import, export, mapping, preview, and reconciliation planning.**

## What It Provides

- Headless CSV, JSON, and XML codecs.
- Normalized `RecordBatch` contracts for runtime data interchange.
- `SchemaModel` mapping inference, coercion, and validation helpers.
- Import/export planning and preview diff APIs.

## Installation

`npm install @contractspec/lib.data-exchange-core`

or

`bun add @contractspec/lib.data-exchange-core`

## Usage

Import the root entrypoint from `@contractspec/lib.data-exchange-core`, or use subpaths such as `./codecs`, `./mapping`, `./plans`, `./preview`, `./records`, `./schema`, and `./types`.

## Import Templates

Developers can define the recommended import shape once, then let users upload files with different column labels or value formats:

```ts
import {
	createImportPlan,
	createRecordBatch,
	defineDataExchangeTemplate,
	previewImport,
} from "@contractspec/lib.data-exchange-core";

const template = defineDataExchangeTemplate({
	key: "accounts.import",
	version: "1.0.0",
	columns: [
		{
			key: "id",
			label: "Account ID",
			targetField: "id",
			required: true,
			sourceAliases: ["Account Identifier", "External ID"],
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

const sourceBatch = createRecordBatch([
	{ "Account Identifier": "acc-1", Amount: "1.234,50" },
]);

const preview = previewImport(
	createImportPlan({
		source: { kind: "memory", batch: sourceBatch, format: "csv" },
		target: { kind: "memory", format: "json" },
		schema: AccountImportSchema,
		sourceBatch,
		template,
	})
);
```

Template resolution uses exact headers, aliases, normalized labels, and SchemaModel fallback inference. Explicit `mappings` still override template mappings.
`defineImportTemplate` remains available as a backwards-compatible import-specific alias.
