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

export const AgentApprovalRequestedPayload = new SchemaModel({
	name: 'AgentApprovalRequestedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		approvalId: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		requestedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const AgentApprovalRequestedDocBlock = {
	id: 'docs.tech.agent.approval.requested',
	title: 'Agent approval requested event',
	summary: 'Emitted when approval is required.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/approval/requested',
	tags: ['agent', 'event', 'approval'],
	body: `# agent.approval.requested

Emitted when an approval gate is triggered.
`,
} satisfies DocBlock;

export const AgentApprovalRequestedEvent = defineEvent({
	meta: {
		key: 'agent.approval.requested',
		version: '1.0.0',
		description: 'Emitted when an approval is required for an agent action.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'approval'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.approval.requested')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	pii: ['reason'],
	payload: AgentApprovalRequestedPayload,
});
