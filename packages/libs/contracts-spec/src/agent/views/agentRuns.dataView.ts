import { defineDataView } from '../../data-views';
import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';
import { AgentStatusQuery } from '../queries/agentStatus.query';

export const AgentRunsDataViewDocBlock = {
	id: 'docs.tech.agent.run.index',
	title: 'Agent run index view',
	summary: 'Data view for listing agent runs.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/run/index',
	tags: ['agent', 'data-view'],
	body: `# agent.run.index

List view over agent runs and their status.
`,
} satisfies DocBlock;

export const AgentRunsDataView = defineDataView({
	meta: {
		key: 'agent.run.index',
		title: 'Agent Runs',
		version: '1.0.0',
		description: 'List background agent runs and their status.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run', 'index'],
		stability: AGENT_STABILITY,
		entity: 'agent_run',
		docId: [docId('docs.tech.agent.run.index')],
	},
	source: {
		primary: {
			key: AgentStatusQuery.meta.key,
			version: AgentStatusQuery.meta.version,
		},
	},
	view: {
		kind: 'list',
		fields: [
			{ key: 'runId', label: 'Run', dataPath: 'runId' },
			{ key: 'agentKey', label: 'Agent', dataPath: 'agentKey' },
			{ key: 'status', label: 'Status', dataPath: 'status' },
			{ key: 'submittedAt', label: 'Submitted', dataPath: 'submittedAt' },
			{ key: 'startedAt', label: 'Started', dataPath: 'startedAt' },
			{ key: 'completedAt', label: 'Completed', dataPath: 'completedAt' },
			{
				key: 'contextSnapshotId',
				label: 'Context Snapshot',
				dataPath: 'contextSnapshotId',
			},
		],
		primaryField: 'runId',
		secondaryFields: ['agentKey', 'status'],
		filters: [
			{ key: 'runId', label: 'Run ID', field: 'runId', type: 'search' },
			{ key: 'status', label: 'Status', field: 'status', type: 'search' },
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});
