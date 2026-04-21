import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesMeetingRecorderProvidersExample = defineExample({
	meta: {
		key: 'examples.meeting-recorder-providers',
		version: '1.0.0',
		title: 'Meeting Recorder Providers',
		description:
			'Meeting recorder provider example: list meetings, transcripts, and webhooks.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'meeting-recorder-providers'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.meeting-recorder-providers',
	},
});

export default ExamplesMeetingRecorderProvidersExample;
export { ExamplesMeetingRecorderProvidersExample };
