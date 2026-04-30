import {
	type AnyOperationSpec,
	defineCommand,
	defineQuery,
} from '../operations/';
import type { OperationSpecRegistry } from '../operations/registry';
import {
	CreateKnowledgeSourceInput,
	DeleteKnowledgeSourceInput,
	DeleteKnowledgeSourceOutput,
	EvaluateKnowledgeMutationGovernanceInput,
	EvaluateKnowledgeMutationGovernanceOutput,
	KnowledgeSourceRecord,
	ListKnowledgeSourcesInput,
	ListKnowledgeSourcesOutput,
	TriggerKnowledgeSyncInput,
	TriggerKnowledgeSyncOutput,
	UpdateKnowledgeSourceInput,
} from './operation-models';

export const CreateKnowledgeSource = defineCommand({
	meta: {
		key: 'knowledge.source.create',
		title: 'Create Knowledge Source',
		version: '1.0.0',
		description: 'Create a knowledge source binding for a tenant.',
		goal: 'Onboard a new knowledge ingestion source such as Notion or uploads.',
		context:
			'Used by Ops and App Studio to configure knowledge ingestion per tenant and space.',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'sources'],
		stability: 'experimental',
	},
	io: {
		input: CreateKnowledgeSourceInput,
		output: KnowledgeSourceRecord,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.manage', version: '1.0.0' }],
	},
});

export const UpdateKnowledgeSource = defineCommand({
	meta: {
		key: 'knowledge.source.update',
		title: 'Update Knowledge Source',
		version: '1.0.0',
		description: 'Update metadata or configuration for a knowledge source.',
		goal: 'Allow rotation of credentials, sync schedules, and labels.',
		context:
			'Supports editing how a tenant ingests knowledge (e.g., toggling sync cadence).',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'sources'],
		stability: 'experimental',
	},
	io: {
		input: UpdateKnowledgeSourceInput,
		output: KnowledgeSourceRecord,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.manage', version: '1.0.0' }],
	},
});

export const DeleteKnowledgeSource = defineCommand({
	meta: {
		key: 'knowledge.source.delete',
		title: 'Delete Knowledge Source',
		version: '1.0.0',
		description: 'Delete a knowledge source binding for a tenant.',
		goal: 'Remove obsolete or compromised knowledge ingestion paths.',
		context:
			'Ensures ephemeral or external sources can be removed cleanly without leaving residual bindings.',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'sources'],
		stability: 'experimental',
	},
	io: {
		input: DeleteKnowledgeSourceInput,
		output: DeleteKnowledgeSourceOutput,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.manage', version: '1.0.0' }],
	},
});

export const ListKnowledgeSources = defineQuery({
	meta: {
		key: 'knowledge.source.list',
		title: 'List Knowledge Sources',
		version: '1.0.0',
		description: 'List knowledge sources configured for a tenant.',
		goal: 'Provide visibility into knowledge ingest configuration and schedules.',
		context:
			'Used by App Studio and Ops flows to surface knowledge sources and their health.',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'sources'],
		stability: 'experimental',
	},
	io: {
		input: ListKnowledgeSourcesInput,
		output: ListKnowledgeSourcesOutput,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.read', version: '1.0.0' }],
	},
});

export const TriggerKnowledgeSourceSync = defineCommand({
	meta: {
		key: 'knowledge.source.triggerSync',
		title: 'Trigger Knowledge Source Sync',
		version: '1.0.0',
		description: 'Trigger an immediate sync for a knowledge source.',
		goal: 'Support manual or automated sync retries for knowledge ingestion.',
		context:
			'Invoked by Ops tooling or monitors when knowledge content must be refreshed or reprocessed.',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'sources'],
		stability: 'experimental',
	},
	io: {
		input: TriggerKnowledgeSyncInput,
		output: TriggerKnowledgeSyncOutput,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.manage', version: '1.0.0' }],
	},
});

export const EvaluateKnowledgeMutationGovernance = defineCommand({
	meta: {
		key: 'knowledge.mutation.evaluateGovernance',
		title: 'Evaluate Knowledge Mutation Governance',
		version: '1.0.0',
		description:
			'Evaluate dry-run, approval, idempotency, audit, and outbound-send evidence before mutating an external knowledge provider.',
		goal: 'Create an auditable decision envelope for governed knowledge mutations.',
		context:
			'Used by runtime flows before sending email, changing Drive permissions, or mutating provider-backed knowledge sources.',
		owners: ['@platform.knowledge'],
		tags: ['knowledge', 'governance', 'mutation'],
		stability: 'experimental',
	},
	io: {
		input: EvaluateKnowledgeMutationGovernanceInput,
		output: EvaluateKnowledgeMutationGovernanceOutput,
	},
	policy: {
		auth: 'admin',
		policies: [{ key: 'platform.knowledge.manage', version: '1.0.0' }],
	},
});

export const knowledgeContracts: Record<string, AnyOperationSpec> = {
	CreateKnowledgeSource,
	UpdateKnowledgeSource,
	DeleteKnowledgeSource,
	ListKnowledgeSources,
	TriggerKnowledgeSourceSync,
	EvaluateKnowledgeMutationGovernance,
};

export function registerKnowledgeContracts(registry: OperationSpecRegistry) {
	return registry
		.register(CreateKnowledgeSource)
		.register(UpdateKnowledgeSource)
		.register(DeleteKnowledgeSource)
		.register(ListKnowledgeSources)
		.register(TriggerKnowledgeSourceSync)
		.register(EvaluateKnowledgeMutationGovernance);
}
