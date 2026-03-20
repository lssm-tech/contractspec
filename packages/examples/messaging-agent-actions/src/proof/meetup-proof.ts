import {
	createMessagingAgentActionsHandlers,
	listAllowedMessagingActions,
	listAllowedMessagingWorkflows,
} from "../handlers";

export interface MessagingAgentActionsReplayStep {
	step: string;
	inboundText: string;
	intent: string;
	replyText: string;
}

export interface MessagingAgentActionsMeetupProof {
	exampleKey: "messaging-agent-actions";
	generatedAt: string;
	allowedActions: string[];
	allowedWorkflows: string[];
	replay: MessagingAgentActionsReplayStep[];
}

export async function buildMessagingAgentActionsMeetupProof(): Promise<MessagingAgentActionsMeetupProof> {
	const handlers = createMessagingAgentActionsHandlers();
	const replay = await Promise.all([
		handlers.processMessage(
			{
				provider: "messaging.telegram",
				senderId: "operator-1",
				threadId: "thread-status",
				text: "status messaging",
			},
			{} as never
		),
		handlers.processMessage(
			{
				provider: "messaging.slack",
				senderId: "operator-1",
				threadId: "thread-action",
				text: "run action refresh-agent-console-proof",
			},
			{} as never
		),
		handlers.processMessage(
			{
				provider: "messaging.whatsapp.meta",
				senderId: "operator-1",
				threadId: "thread-workflow",
				text: "dispatch workflow incident-triage",
			},
			{} as never
		),
	]);

	return {
		exampleKey: "messaging-agent-actions",
		generatedAt: "2026-03-20T09:00:00.000Z",
		allowedActions: listAllowedMessagingActions().map((action) => action.key),
		allowedWorkflows: listAllowedMessagingWorkflows().map(
			(workflow) => workflow.key
		),
		replay: [
			{
				step: "status",
				inboundText: "status messaging",
				intent: replay[0].intent,
				replyText: replay[0].replyText,
			},
			{
				step: "run-action",
				inboundText: "run action refresh-agent-console-proof",
				intent: replay[1].intent,
				replyText: replay[1].replyText,
			},
			{
				step: "dispatch-workflow",
				inboundText: "dispatch workflow incident-triage",
				intent: replay[2].intent,
				replyText: replay[2].replyText,
			},
		],
	};
}
