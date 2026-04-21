import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineEvent } from '../../events';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

export const AgentRunFailedPayload = new SchemaModel({
	name: 'AgentRunFailedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		agentKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		problem: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

export const AgentRunFailedDocBlock = {
	id: 'docs.tech.agent.run.failed',
	title: 'Agent run failed event',
	summary: 'Emitted when an agent run fails.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/run/failed',
	tags: ['agent', 'event'],
	body: `# agent.run.failed

Emitted when a run terminates with failure.
`,
} satisfies DocBlock;

export const AgentRunFailedEvent = defineEvent({
	meta: {
		key: 'agent.run.failed',
		version: '1.0.0',
		description: 'Emitted when an agent run fails.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.run.failed')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	pii: ['errorMessage'],
	payload: AgentRunFailedPayload,
});
