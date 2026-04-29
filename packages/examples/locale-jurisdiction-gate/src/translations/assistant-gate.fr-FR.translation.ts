import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineTranslation } from '@contractspec/lib.contracts-spec/translations/spec';

export const AssistantGateMessagesFrFr = defineTranslation({
	meta: {
		key: 'locale-jurisdiction-gate.translation.assistant-gate',
		version: '1.0.0',
		domain: 'assistant',
		description:
			'French messages for the assistant locale and jurisdiction gate.',
		owners: [OwnersEnum.PlatformFinance],
		stability: StabilityEnum.Experimental,
		tags: [TagsEnum.I18n, 'assistant', 'policy'],
	},
	locale: 'fr-FR',
	fallback: 'en-US',
	messages: {
		'assistantGate.locale.label': { value: 'Langue' },
		'assistantGate.locale.description': {
			value: "Sélectionnez la langue validée pour la réponse de l'assistant.",
		},
		'assistantGate.jurisdiction.label': { value: 'Juridiction' },
		'assistantGate.jurisdiction.placeholder': { value: 'FR-AMF' },
		'assistantGate.kbSnapshotId.label': {
			value: 'Identifiant du snapshot documentaire',
		},
		'assistantGate.kbSnapshotId.placeholder': {
			value: 'kb_2026_03_20_policy_reviewed',
		},
		'assistantGate.allowedScope.label': { value: 'Périmètre autorisé' },
		'assistantGate.allowedScope.educationOnly': {
			value: 'Contenu éducatif uniquement',
		},
		'assistantGate.allowedScope.genericInfo': {
			value: 'Information générale',
		},
		'assistantGate.allowedScope.escalationRequired': {
			value: 'Escalade obligatoire',
		},
		'assistantGate.question.label': { value: 'Question' },
		'assistantGate.question.placeholder': {
			value:
				'Que puis-je dire sur ce produit dans la juridiction sélectionnée ?',
		},
		'assistantGate.submit.label': { value: 'Générer la réponse' },
	},
});
