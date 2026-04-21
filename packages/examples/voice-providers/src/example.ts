import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVoiceProvidersExample = defineExample({
	meta: {
		key: 'voice-providers',
		version: '1.0.0',
		title: 'Voice Providers',
		description:
			'Voice provider example: Gradium and Fal text-to-speech integration patterns.',
		kind: 'template',
		visibility: 'public',
		stability: 'beta',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'voice-providers', 'voice', 'gradium', 'fal'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.voice-providers',
	},
});

export default ExamplesVoiceProvidersExample;
export { ExamplesVoiceProvidersExample };
