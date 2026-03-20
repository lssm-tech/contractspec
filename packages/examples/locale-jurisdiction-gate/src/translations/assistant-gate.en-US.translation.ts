import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineTranslation } from '@contractspec/lib.contracts-spec/translations/spec';

export const AssistantGateMessagesEnUs = defineTranslation({
	meta: {
		key: 'locale-jurisdiction-gate.translation.assistant-gate.en-US',
		version: '1.0.0',
		domain: 'assistant',
		description:
			'US English messages for the assistant locale and jurisdiction gate.',
		owners: [OwnersEnum.PlatformFinance],
		stability: StabilityEnum.Experimental,
		tags: [TagsEnum.I18n, 'assistant', 'policy'],
	},
	locale: 'en-US',
	messages: {
		'assistantGate.locale.label': { value: 'Locale' },
		'assistantGate.locale.description': {
			value: 'Choose the reviewed locale for the assistant answer.',
		},
		'assistantGate.locale.enUs': { value: 'English (United States)' },
		'assistantGate.locale.enGb': { value: 'English (United Kingdom)' },
		'assistantGate.locale.frFr': { value: 'French (France)' },
		'assistantGate.jurisdiction.label': { value: 'Jurisdiction' },
		'assistantGate.jurisdiction.placeholder': { value: 'US-SEC' },
		'assistantGate.kbSnapshotId.label': { value: 'Knowledge snapshot ID' },
		'assistantGate.kbSnapshotId.placeholder': {
			value: 'kb_2026_03_20_policy_reviewed',
		},
		'assistantGate.allowedScope.label': { value: 'Allowed scope' },
		'assistantGate.allowedScope.educationOnly': {
			value: 'Educational content only',
		},
		'assistantGate.allowedScope.genericInfo': { value: 'Generic information' },
		'assistantGate.allowedScope.escalationRequired': {
			value: 'Escalation required',
		},
		'assistantGate.question.label': { value: 'Question' },
		'assistantGate.question.placeholder': {
			value: 'What can I say about this product in the selected jurisdiction?',
		},
		'assistantGate.submit.label': { value: 'Generate answer' },
	},
});
