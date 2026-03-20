import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
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
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

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
