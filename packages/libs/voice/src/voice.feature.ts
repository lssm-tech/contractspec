import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const VoiceFeature = defineFeature({
	meta: {
		key: 'libs.voice',
		version: '1.0.0',
		title: 'Voice',
		description: 'Voice capabilities: TTS, STT, and conversational AI',
		domain: 'voice',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'voice'],
		stability: 'experimental',
	},
});
