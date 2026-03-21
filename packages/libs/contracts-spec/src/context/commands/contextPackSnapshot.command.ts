import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import type { DocBlock } from '../../docs/types';
import { docRef } from '../../docs/registry';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';
import { ContextSnapshotCreatedEvent } from '../events/contextSnapshotCreated.event';

const ContextPackSnapshotInput = new SchemaModel({
	name: 'ContextPackSnapshotInput',
	fields: {
		packKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		packVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		requestedBy: { type: ScalarTypeEnum.ID(), isOptional: true },
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const ContextPackSnapshotOutput = new SchemaModel({
	name: 'ContextPackSnapshotOutput',
	fields: {
		snapshotId: { type: ScalarTypeEnum.ID(), isOptional: false },
		packKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		packVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		itemCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ContextPackSnapshotDocBlock = {
	id: 'docs.tech.context.pack.snapshot',
	title: 'Create context snapshot',
	summary: 'Create an immutable context snapshot from a pack.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/context/pack/snapshot',
	tags: ['context', 'snapshot', 'create'],
	body: `# context.pack.snapshot

Creates a versioned snapshot that is used as the immutable context for agent execution.
`,
} satisfies DocBlock;

export const ContextPackSnapshotCommand = defineCommand({
	meta: {
		key: 'context.pack.snapshot',
		title: 'Create Context Snapshot',
		version: '1.0.0',
		description: 'Create an immutable snapshot from a context pack.',
		goal: 'Persist a versioned, auditable context snapshot for agents.',
		context:
			'Used when launching background agents or when operators want to lock context state.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'snapshot', 'create'],
		stability: CONTEXT_STABILITY,
		docId: [docRef(ContextPackSnapshotDocBlock.id)],
	},
	capability: {
		key: 'context.system',
		version: '1.0.0',
	},
	io: {
		input: ContextPackSnapshotInput,
		output: ContextPackSnapshotOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
	sideEffects: {
		emits: [
			{
				ref: ContextSnapshotCreatedEvent.meta,
				when: 'A new snapshot has been created and persisted.',
			},
		],
	},
});
