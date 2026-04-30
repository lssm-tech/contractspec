import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const KnowledgeSyncSchedule = new SchemaModel({
	name: 'KnowledgeSyncSchedule',
	fields: {
		enabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		cron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		intervalMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const KnowledgeSourceRecord = new SchemaModel({
	name: 'KnowledgeSourceRecord',
	fields: {
		id: { type: ScalarTypeEnum.ID(), isOptional: false },
		tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
		spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		spaceVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		sourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
		lastSyncStatus: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		lastSyncAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		itemsProcessed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const CreateKnowledgeSourceInput = new SchemaModel({
	name: 'CreateKnowledgeSourceInput',
	fields: {
		tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
		spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		spaceVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		sourceType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		config: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
		syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
	},
});

export const UpdateKnowledgeSourceInput = new SchemaModel({
	name: 'UpdateKnowledgeSourceInput',
	fields: {
		sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
		label: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		config: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		syncSchedule: { type: KnowledgeSyncSchedule, isOptional: true },
	},
});

export const DeleteKnowledgeSourceInput = new SchemaModel({
	name: 'DeleteKnowledgeSourceInput',
	fields: {
		sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

export const DeleteKnowledgeSourceOutput = new SchemaModel({
	name: 'DeleteKnowledgeSourceOutput',
	fields: {
		success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

export const ListKnowledgeSourcesInput = new SchemaModel({
	name: 'ListKnowledgeSourcesInput',
	fields: {
		tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
		spaceKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
	},
});

export const ListKnowledgeSourcesOutput = new SchemaModel({
	name: 'ListKnowledgeSourcesOutput',
	fields: {
		sources: {
			type: KnowledgeSourceRecord,
			isOptional: false,
			isArray: true,
		},
	},
});

export const TriggerKnowledgeSyncInput = new SchemaModel({
	name: 'TriggerKnowledgeSyncInput',
	fields: {
		sourceId: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

export const TriggerKnowledgeSyncOutput = new SchemaModel({
	name: 'TriggerKnowledgeSyncOutput',
	fields: {
		success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		itemsProcessed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const EvaluateKnowledgeMutationGovernanceInput = new SchemaModel({
	name: 'EvaluateKnowledgeMutationGovernanceInput',
	fields: {
		operation: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		sourceId: { type: ScalarTypeEnum.ID(), isOptional: true },
		dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		requiresApproval: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		outboundSend: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		idempotencyKey: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		auditEvidenceRef: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		approvalRefIds: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
		outboundSendGateStatus: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
	},
});

export const EvaluateKnowledgeMutationGovernanceOutput = new SchemaModel({
	name: 'EvaluateKnowledgeMutationGovernanceOutput',
	fields: {
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		allowed: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		reasons: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
			isArray: true,
		},
		requiredEvidence: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
			isArray: true,
		},
		auditEvidenceRef: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		idempotencyKey: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		decidedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});
