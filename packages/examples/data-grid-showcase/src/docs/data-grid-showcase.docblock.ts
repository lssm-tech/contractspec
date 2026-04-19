import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const dataGridShowcaseDocBlocks: DocBlock[] = [
	{
		id: 'docs.examples.data-grid-showcase',
		title: 'Data Grid Showcase',
		summary:
			'Canonical example for the full ContractSpec data-table stack across contract, primitive, and composed surfaces.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/data-grid-showcase',
		tags: ['table', 'data-grid', 'examples'],
		body: `## What it covers

- Client-mode tables using \`useContractTable\` + \`@contractspec/lib.design-system\`.
- Server-mode tables using the same controller API with remote sorting/pagination.
- Declarative DataView tables via \`defineDataView\` + \`useDataViewTable\`.
- Raw web primitive rendering through \`@contractspec/lib.ui-kit-web/ui/data-table\`.
- Native-first primitive rendering through \`@contractspec/lib.ui-kit/ui/data-table\` (shown as code in the browser docs lane).

## Capabilities

- Client and server execution modes.
- Single and multiple row selection.
- Sorting, pagination, row selection, column visibility, column resizing, column pinning, and row expansion.
- Loading states, empty states, row-press feedback, and explicit design-system header actions / toolbar / footer slots.
- Shared rendering through the contract layer, raw primitives, and the opinionated design-system wrapper.

## Notes

- This package stays intentionally narrow and demonstrative.
- The same table stack is reused by the larger business examples, but this package is the canonical reference.`,
	},
	{
		id: 'docs.examples.data-grid-showcase.goal',
		title: 'Data Grid Showcase — Goal',
		summary: 'Why this example exists.',
		kind: 'goal',
		visibility: 'public',
		route: '/docs/examples/data-grid-showcase/goal',
		tags: ['table', 'goal'],
		body: `## Goal

- Give teams one compact example that shows every supported table capability without unrelated business complexity.
- Demonstrate how the same account-grid scenario flows through \`contracts-spec\`, \`ui-kit\`, \`ui-kit-web\`, and \`design-system\` without changing the underlying controller model.`,
	},
	{
		id: 'docs.examples.data-grid-showcase.usage',
		title: 'Data Grid Showcase — Usage',
		summary: 'How to use the example while adopting table primitives.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/data-grid-showcase/usage',
		tags: ['table', 'usage'],
		body: `## Usage

1. Start in the client lane to see the composed design-system surface with header actions, toolbar, footer, loading, and empty-state slots.
2. Switch to server mode to see remote sorting/pagination on the same controller API.
3. Open the DataView lane to inspect the declarative contract path.
4. Open the web primitive lane to see the unwrapped browser renderer.
5. Use the native primitive lane when you need the Expo / React Native code path.

## Adoption pattern

- Use \`useContractTable\` when your example or product code already owns row fetching and column definitions.
- Use \`useDataViewTable\` when the table should stay declarative and spec-driven.
- Use \`@contractspec/lib.design-system\` when you want the product-facing card shell, and drop down to \`ui-kit-web\` or \`ui-kit\` when you need the raw primitive.`,
	},
];

registerDocBlocks(dataGridShowcaseDocBlocks);
