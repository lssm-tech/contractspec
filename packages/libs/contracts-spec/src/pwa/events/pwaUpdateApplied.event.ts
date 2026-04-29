import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import { defineEvent } from '../../events';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from '../constants';

export const PwaUpdateEventPayload = new SchemaModel({
	name: 'PwaUpdateEventPayload',
	fields: {
		appId: { type: ScalarTypeEnum.ID(), isOptional: false },
		fromVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		toVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		blocking: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const PwaUpdateAppliedEvent = defineEvent({
	meta: {
		key: 'pwa.update.applied',
		version: '1.0.0',
		description: 'Emitted when a frontend PWA update is applied.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: [...PWA_TAGS, 'applied'],
		stability: PWA_STABILITY,
		docId: [docId('docs.tech.contracts.pwa-updates')],
	},
	capability: { key: 'pwa.update-management', version: '1.0.0' },
	payload: PwaUpdateEventPayload,
});
