import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { definePolicy } from '@contractspec/lib.contracts-spec/policy';

export const AssistantGatePolicy = definePolicy({
	meta: {
		key: 'locale-jurisdiction-gate.policy.gate',
		version: '1.0.0',
		title: 'Assistant Locale and Jurisdiction Gate',
		description:
			'Requires explicit locale, jurisdiction, knowledge snapshot, and allowed scope before assistant requests may proceed.',
		domain: 'assistant',
		scope: 'operation',
		owners: [OwnersEnum.PlatformFinance],
		tags: [TagsEnum.I18n, 'assistant', 'policy', 'jurisdiction'],
		stability: StabilityEnum.Experimental,
	},
	rules: [
		{
			effect: 'deny',
			actions: ['assistant.answer', 'assistant.explainConcept'],
			resource: { type: 'assistant-call' },
			conditions: [
				{
					expression:
						'!context.locale || !context.jurisdiction || !context.kbSnapshotId || !context.allowedScope',
				},
			],
			reason:
				'Assistant requests fail closed until locale, jurisdiction, kbSnapshotId, and allowedScope are explicit.',
		},
		{
			effect: 'deny',
			actions: ['assistant.answer', 'assistant.explainConcept'],
			resource: { type: 'assistant-call' },
			conditions: [
				{
					expression:
						"!['en-US', 'en-GB', 'fr-FR'].includes(context.locale ?? '')",
				},
			],
			reason: 'Only the explicitly reviewed assistant locales are permitted.',
		},
		{
			effect: 'allow',
			actions: ['assistant.answer', 'assistant.explainConcept'],
			resource: { type: 'assistant-call' },
			conditions: [
				{
					expression:
						"['en-US', 'en-GB', 'fr-FR'].includes(context.locale ?? '') && !!context.jurisdiction && !!context.kbSnapshotId && !!context.allowedScope",
				},
			],
			reason:
				'Explicit context is present, so the request may continue to citation and scope validation.',
		},
	],
	pii: {
		fields: ['kbSnapshotId'],
		retentionDays: 30,
	},
});
