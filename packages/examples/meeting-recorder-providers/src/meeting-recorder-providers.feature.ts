import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MeetingRecorderProvidersFeature = defineFeature({
	meta: {
		key: 'meeting-recorder-providers',
		version: '1.0.0',
		title: 'Meeting Recorder Providers',
		description:
			'Meeting recorder provider integration with transcripts and webhook handling',
		domain: 'integration',
		owners: ['@examples'],
		tags: ['meeting', 'recorder', 'transcripts', 'webhooks'],
		stability: 'experimental',
	},

	integrations: [
		{ key: 'meeting-recorder.integration.provider', version: '1.0.0' },
	],

	docs: [
		'docs.examples.meeting-recorder-providers',
		'docs.examples.meeting-recorder-providers.usage',
	],
});
