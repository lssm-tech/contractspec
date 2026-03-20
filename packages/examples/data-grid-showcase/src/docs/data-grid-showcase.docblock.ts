import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
import { registerDocBlocks } from "@contractspec/lib.contracts-spec/docs";

const dataGridShowcaseDocBlocks: DocBlock[] = [
	{
		id: "docs.examples.data-grid-showcase",
		title: "Data Grid Showcase",
		summary:
			"Focused example for the ContractSpec-native table stack across generic and DataView-driven APIs.",
		kind: "reference",
		visibility: "public",
		route: "/docs/examples/data-grid-showcase",
		tags: ["table", "data-grid", "examples"],
		body: `## What it covers

- Generic client-mode tables using \`useContractTable\`.
- Generic server-mode tables using the same controller API with remote sorting/pagination.
- Declarative DataView tables via \`useDataViewTable\`.

## Capabilities

- Sorting, pagination, row selection, column visibility, column resizing, column pinning, and row expansion.
- Shared design-system rendering through \`DataTable\`.

## Notes

- This package is intentionally narrow and demonstrative.
- The same table stack is reused by the larger business examples.`,
	},
	{
		id: "docs.examples.data-grid-showcase.goal",
		title: "Data Grid Showcase — Goal",
		summary: "Why this example exists.",
		kind: "goal",
		visibility: "public",
		route: "/docs/examples/data-grid-showcase/goal",
		tags: ["table", "goal"],
		body: `## Goal

- Give teams one compact example that shows the ContractSpec table primitive without unrelated business complexity.
- Demonstrate that the same rendering surface can sit on top of either a generic headless controller or a declarative DataView contract.`,
	},
	{
		id: "docs.examples.data-grid-showcase.usage",
		title: "Data Grid Showcase — Usage",
		summary: "How to use the example while adopting table primitives.",
		kind: "usage",
		visibility: "public",
		route: "/docs/examples/data-grid-showcase/usage",
		tags: ["table", "usage"],
		body: `## Usage

1. Start in the client-mode lane to understand the generic controller shape.
2. Switch to server mode to see sorting/pagination stay on the same API.
3. Open the DataView lane to see the adapter path with a declarative table contract.

## Adoption pattern

- Use \`useContractTable\` when your example or product code already owns row fetching and column definitions.
- Use \`useDataViewTable\` when the table should stay declarative and spec-driven.`,
	},
];

registerDocBlocks(dataGridShowcaseDocBlocks);
