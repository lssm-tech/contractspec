import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineQuery } from '../../operations';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

const AgentStatusInput = new SchemaModel({
	name: 'AgentStatusInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: true },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const AgentRunSummary = new SchemaModel({
	name: 'AgentRunSummary',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		agentKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		submittedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
		lastError: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const AgentStatusOutput = new SchemaModel({
	name: 'AgentStatusOutput',
	fields: {
		runs: { type: AgentRunSummary, isOptional: false, isArray: true },
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const AgentStatusDocBlock = {
	id: 'docs.tech.agent.status',
	title: 'Agent status',
	summary: 'Query agent run status.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/status',
	tags: ['agent', 'status'],
	body: `# agent.status

Returns status summaries for one or many agent runs.
`,
} satisfies DocBlock;

export const AgentStatusQuery = defineQuery({
	meta: {
		key: 'agent.status',
		title: 'Agent Run Status',
		version: '1.0.0',
		description: 'Get status for agent runs.',
		goal: 'Provide status and progress visibility for background agents.',
		context: 'Used by Studio and operators to monitor agent execution.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'status'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.status')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	io: {
		input: AgentStatusInput,
		output: AgentStatusOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
