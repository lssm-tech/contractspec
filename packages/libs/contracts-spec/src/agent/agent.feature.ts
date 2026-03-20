import { defineFeature } from '../features';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from './constants';

export const AgentFeature = defineFeature({
	meta: {
		key: 'platform.agent',
		version: '1.0.0',
		title: 'Agent Execution',
		description:
			'Run, cancel, and approve AI agent executions with full audit trail',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS],
		stability: AGENT_STABILITY,
	},

	operations: [
		{ key: 'agent.run', version: '1.0.0' },
		{ key: 'agent.cancel', version: '1.0.0' },
		{ key: 'agent.approvals', version: '1.0.0' },
		{ key: 'agent.status', version: '1.0.0' },
		{ key: 'agent.artifacts', version: '1.0.0' },
	],

	events: [
		{ key: 'agent.run.started', version: '1.0.0' },
		{ key: 'agent.run.completed', version: '1.0.0' },
		{ key: 'agent.run.failed', version: '1.0.0' },
		{ key: 'agent.approval.requested', version: '1.0.0' },
	],

	presentations: [{ key: 'agent.run.audit', version: '1.0.0' }],

	capabilities: {
		provides: [{ key: 'agent.execution', version: '1.0.0' }],
	},

	dataViews: [{ key: 'agent.run.index', version: '1.0.0' }],

	forms: [{ key: 'agent.run.form', version: '1.0.0' }],
});
