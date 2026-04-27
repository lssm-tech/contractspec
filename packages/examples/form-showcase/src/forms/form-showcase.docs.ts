import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';

export const FormShowcaseDocBlocks = [
	{
		id: 'docs.examples.form-showcase',
		title: 'Form Showcase',
		summary:
			'Focused form-only example for ContractSpec field kinds, layout flows, and validation metadata.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/form-showcase',
		tags: ['forms', 'example', 'template'],
		body: `## What it covers

- Every current ContractSpec form field kind.
- Responsive columns, full-width spans, section flows, step flows, nested groups, and repeated group arrays.
- Input groups, password hints, read-only fields, conditionals, constraints, PII metadata, and actions.

## Why it exists

Use this example when you want a form-only template without unrelated application code. It keeps the authoring surface small enough to clone while still showing how a customer form can stay schema-backed, validated, and renderer-agnostic.`,
	},
	{
		id: 'docs.examples.form-showcase.usage',
		title: 'Form Showcase Usage',
		summary: 'How to use the form-only template while adopting FormSpec.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/form-showcase/usage',
		tags: ['forms', 'usage', 'template'],
		body: `## Usage

1. Import \`FormShowcaseAllFieldsForm\` to inspect the complete field-kind matrix.
2. Import \`FormShowcaseProgressiveStepsForm\` to inspect step-based layout.
3. Use \`FormShowcaseRegistry\` when your app needs to discover available form specs by tag, owner, or key.
4. Map each \`FieldSpec.kind\` to your existing design-system controls instead of forking the form definitions.`,
	},
] satisfies DocBlock[];
