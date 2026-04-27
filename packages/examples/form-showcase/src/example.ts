import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesFormShowcaseExample = defineExample({
	meta: {
		key: 'form-showcase',
		version: '1.0.0',
		title: 'Form Showcase',
		description:
			'Focused ContractSpec form template covering field kinds, conditional rules, and layout flows.',
		summary:
			'Use this template when you want only form contracts: all core fields, responsive layouts, steps, sections, arrays, and validation hints.',
		kind: 'template',
		visibility: 'public',
		stability: 'stable',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'form-showcase', 'forms', 'template', 'ui'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.form-showcase',
		docs: './docs',
	},
});

export default ExamplesFormShowcaseExample;
export { ExamplesFormShowcaseExample };
