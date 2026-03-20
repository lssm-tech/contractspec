import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineTranslation } from '@contractspec/lib.contracts-spec/translations/spec';

export const AssistantGateMessagesEnGb = defineTranslation({
	meta: {
		key: 'locale-jurisdiction-gate.translation.assistant-gate.en-GB',
		version: '1.0.0',
		domain: 'assistant',
		description:
			'British English messages for the assistant locale and jurisdiction gate.',
		owners: [OwnersEnum.PlatformFinance],
		stability: StabilityEnum.Experimental,
		tags: [TagsEnum.I18n, 'assistant', 'policy'],
	},
	locale: 'en-GB',
	fallback: 'en-US',
	messages: {
		'assistantGate.locale.label': { value: 'Locale' },
		'assistantGate.locale.description': {
			value: 'Select the reviewed locale for the assistant response.',
		},
		'assistantGate.jurisdiction.label': { value: 'Jurisdiction' },
		'assistantGate.jurisdiction.placeholder': { value: 'UK-FCA' },
		'assistantGate.kbSnapshotId.label': { value: 'Knowledge snapshot ID' },
		'assistantGate.kbSnapshotId.placeholder': {
			value: 'kb_2026_03_20_policy_reviewed',
		},
		'assistantGate.allowedScope.label': { value: 'Permitted scope' },
		'assistantGate.allowedScope.educationOnly': {
			value: 'Educational content only',
		},
		'assistantGate.allowedScope.genericInfo': { value: 'General information' },
		'assistantGate.allowedScope.escalationRequired': {
			value: 'Escalation required',
		},
		'assistantGate.question.label': { value: 'Question' },
		'assistantGate.question.placeholder': {
			value: 'What may I say about this product in the selected jurisdiction?',
		},
		'assistantGate.submit.label': { value: 'Generate response' },
	},
});
