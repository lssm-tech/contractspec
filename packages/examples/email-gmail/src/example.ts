import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesEmailGmailExample = defineExample({
	meta: {
		key: 'examples.email-gmail',
		version: '1.0.0',
		title: 'Email Gmail',
		description:
			'Gmail integration example: inbound threads and outbound messages.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'email-gmail'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.email-gmail',
	},
});

export default ExamplesEmailGmailExample;
export { ExamplesEmailGmailExample };
