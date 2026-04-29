# @contractspec/lib.data-exchange-client

Website: https://contractspec.io

**Shared controllers plus web and native UI surfaces for mapping, preview, validation, and audit review.**

## What It Provides

- Shared data-exchange view models and stateful controllers.
- Web mapping studio components built on the existing web data-table stack.
- Native mapping studio components built on the existing mobile data-table stack.

## Template Mapping UI State

The shared controller exposes template-aware rows so web and native surfaces can show recommended columns, matched source columns, confidence, formatting summaries, required gaps, and ignored source columns.

```tsx
import { useDataExchangeController } from "@contractspec/lib.data-exchange-client";

function ImportReview({ preview }) {
	const controller = useDataExchangeController({ preview });

	return (
		<ul>
			{(controller.model.templateRows ?? []).map((row) => (
				<li key={row.id}>
					{row.label}: {row.sourceField || "Unmatched"} -&gt;{" "}
					{row.targetField}
					{row.formatLabel ? ` (${row.formatLabel})` : ""}
				</li>
			))}
		</ul>
	);
}
```

Users can remap columns, select aliases, update field formats, reset to the developer template, or accept inferred mappings through controller actions.
