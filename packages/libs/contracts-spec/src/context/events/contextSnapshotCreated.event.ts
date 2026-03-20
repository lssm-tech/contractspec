import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';

export const ContextSnapshotCreatedPayload = new SchemaModel({
	name: 'ContextSnapshotCreatedPayload',
	fields: {
		snapshotId: { type: ScalarTypeEnum.ID(), isOptional: false },
		packKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		packVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		itemCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ContextSnapshotCreatedEvent = defineEvent({
	meta: {
		key: 'context.snapshot.created',
		version: '1.0.0',
		description: 'Emitted when a context snapshot is created.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'snapshot'],
		stability: CONTEXT_STABILITY,
		docId: [docId('docs.tech.context.snapshot.created')],
	},
	capability: {
		key: 'context.system',
		version: '1.0.0',
	},
	pii: [],
	payload: ContextSnapshotCreatedPayload,
});
