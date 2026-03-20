import { describe, expect, test } from 'bun:test';
import example from './example';
import {
	createMessagingAgentActionsHandlers,
	listAllowedMessagingActions,
	listAllowedMessagingWorkflows,
} from './handlers';
import { MessagingAgentActionsFeature } from './messaging-agent-actions.feature';

describe('@contractspec/example.messaging-agent-actions', () => {
	test('publishes beta messaging example metadata', () => {
		expect(example.meta.stability).toBe('beta');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.messaging-agent-actions'
		);
		expect(example.surfaces.sandbox.enabled).toBe(true);
		expect(MessagingAgentActionsFeature.operations?.[0]?.key).toBe(
			'messaging.agentActions.process'
		);
	});

	test('routes only fixed intents and allowlisted actions', async () => {
		const handlers = createMessagingAgentActionsHandlers();

		const statusReply = await handlers.processMessage(
			{
				provider: 'messaging.slack',
				senderId: 'operator-1',
				threadId: 'status-thread',
				text: 'status messaging',
			},
			{} as never
		);
		const actionReply = await handlers.processMessage(
			{
				provider: 'messaging.telegram',
				senderId: 'operator-1',
				threadId: 'action-thread',
				text: `run action ${listAllowedMessagingActions()[0]!.key}`,
			},
			{} as never
		);
		const workflowReply = await handlers.processMessage(
			{
				provider: 'messaging.whatsapp.meta',
				senderId: 'operator-1',
				threadId: 'workflow-thread',
				text: `dispatch workflow ${listAllowedMessagingWorkflows()[0]!.key}`,
			},
			{} as never
		);
		const rejectedReply = await handlers.processMessage(
			{
				provider: 'messaging.telegram',
				senderId: 'operator-1',
				threadId: 'unsafe-thread',
				text: 'run action rm-production-db',
			},
			{} as never
		);

		expect(statusReply.intent).toBe('status');
		expect(statusReply.replyText).toContain('Messaging status is green');
		expect(actionReply.intent).toBe('run_action');
		expect(actionReply.replyText).toContain('allowlisted');
		expect(workflowReply.intent).toBe('dispatch_workflow');
		expect(workflowReply.replyText).toContain('incident-triage');
		expect(rejectedReply.replyText).toContain('not allowlisted');
	});
});
