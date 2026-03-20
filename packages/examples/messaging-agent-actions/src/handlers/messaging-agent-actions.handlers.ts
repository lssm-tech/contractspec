import type { HandlerForOperationSpec } from "@contractspec/lib.contracts-spec";
import { ProcessMessagingAgentAction } from "../contracts/process-message.operation";

export type MessagingIntent = "status" | "run_action" | "dispatch_workflow";

export interface AllowedMessagingAction {
	key: string;
	description: string;
	confirmation: string;
}

export interface AllowedMessagingWorkflow {
	key: string;
	description: string;
	confirmation: string;
}

export interface ClassifiedInboundMessage {
	intent: MessagingIntent;
	normalizedText: string;
	actionKey?: string;
	workflowKey?: string;
	statusScope?: string;
	requiresSafetyReminder: boolean;
}

export interface MessagingAgentActionsHandlers {
	classifyInboundMessage(input: { text: string }): ClassifiedInboundMessage;
	processMessage: HandlerForOperationSpec<typeof ProcessMessagingAgentAction>;
}

const STATUS_PATTERN = /^status(?:\s+(.+))?$/i;
const RUN_ACTION_PATTERN = /^run action ([a-z0-9._-]+)$/i;
const DISPATCH_WORKFLOW_PATTERN = /^dispatch workflow ([a-z0-9._-]+)$/i;
const TOOLISH_REQUEST_PATTERN = /\b(run|exec|execute|command|shell|tool)\b/i;

const DEFAULT_ALLOWED_ACTIONS: readonly AllowedMessagingAction[] = [
	{
		key: "refresh-agent-console-proof",
		description: "Regenerate the offline replay artifact for the agent-console demo.",
		confirmation:
			"Queued the allowlisted proof refresh for the agent-console replay bundle.",
	},
	{
		key: "sync-provider-health",
		description: "Refresh the cached provider health snapshot used in the demo.",
		confirmation:
			"Queued the allowlisted provider health sync for the messaging demo.",
	},
] as const;

const DEFAULT_ALLOWED_WORKFLOWS: readonly AllowedMessagingWorkflow[] = [
	{
		key: "incident-triage",
		description: "Route an inbound issue through the triage workflow.",
		confirmation:
			"Dispatched the allowlisted incident-triage workflow for operator review.",
	},
	{
		key: "customer-follow-up",
		description: "Trigger a customer follow-up workflow with a human approval step.",
		confirmation:
			"Dispatched the allowlisted customer-follow-up workflow for human approval.",
	},
] as const;

const DEFAULT_STATUS_BY_SCOPE: Record<string, string> = {
	system: "System status is green: ingress healthy, proofs current, and outbound replies enabled.",
	"agent-console":
		"Agent Console status is green: seeded runtime healthy and replay proof ready.",
	messaging:
		"Messaging status is green: Slack, WhatsApp, and Telegram ingress routes are configured for the demo lane.",
};

export function listAllowedMessagingActions(): readonly AllowedMessagingAction[] {
	return DEFAULT_ALLOWED_ACTIONS;
}

export function listAllowedMessagingWorkflows(): readonly AllowedMessagingWorkflow[] {
	return DEFAULT_ALLOWED_WORKFLOWS;
}

export function classifyInboundMessage(input: {
	text: string;
}): ClassifiedInboundMessage {
	const normalizedText = input.text.trim().replace(/\s+/g, " ");
	const statusMatch = normalizedText.match(STATUS_PATTERN);
	if (statusMatch) {
		return {
			intent: "status",
			normalizedText,
			statusScope: statusMatch[1]?.trim().toLowerCase() || "system",
			requiresSafetyReminder: false,
		};
	}

	const actionMatch = normalizedText.match(RUN_ACTION_PATTERN);
	if (actionMatch) {
		return {
			intent: "run_action",
			normalizedText,
			actionKey: actionMatch[1]?.toLowerCase(),
			requiresSafetyReminder: false,
		};
	}

	const workflowMatch = normalizedText.match(DISPATCH_WORKFLOW_PATTERN);
	if (workflowMatch) {
		return {
			intent: "dispatch_workflow",
			normalizedText,
			workflowKey: workflowMatch[1]?.toLowerCase(),
			requiresSafetyReminder: false,
		};
	}

	return {
		intent: "status",
		normalizedText,
		statusScope: "system",
		requiresSafetyReminder: TOOLISH_REQUEST_PATTERN.test(normalizedText),
	};
}

export function createMessagingAgentActionsHandlers(): MessagingAgentActionsHandlers {
	const actionsByKey = new Map(
		DEFAULT_ALLOWED_ACTIONS.map((action) => [action.key, action])
	);
	const workflowsByKey = new Map(
		DEFAULT_ALLOWED_WORKFLOWS.map((workflow) => [workflow.key, workflow])
	);

	const processMessage: HandlerForOperationSpec<
		typeof ProcessMessagingAgentAction
	> = async (input) => {
		const classified = classifyInboundMessage({ text: input.text });
		const deliveryChannel = input.provider;

		if (classified.intent === "run_action") {
			const action = classified.actionKey
				? actionsByKey.get(classified.actionKey)
				: undefined;
			if (!action) {
				return {
					intent: classified.intent,
					replyText: buildSafetyReply("action"),
					actionKey: classified.actionKey,
					deliveryChannel,
				};
			}

			return {
				intent: classified.intent,
				replyText: action.confirmation,
				actionKey: action.key,
				deliveryChannel,
			};
		}

		if (classified.intent === "dispatch_workflow") {
			const workflow = classified.workflowKey
				? workflowsByKey.get(classified.workflowKey)
				: undefined;
			if (!workflow) {
				return {
					intent: classified.intent,
					replyText: buildSafetyReply("workflow"),
					workflowKey: classified.workflowKey,
					deliveryChannel,
				};
			}

			return {
				intent: classified.intent,
				replyText: workflow.confirmation,
				workflowKey: workflow.key,
				deliveryChannel,
			};
		}

		const statusScope = classified.statusScope ?? "system";
		const statusReply =
			DEFAULT_STATUS_BY_SCOPE[statusScope] ??
			DEFAULT_STATUS_BY_SCOPE.system ??
			"System status is green.";
		const replyText = classified.requiresSafetyReminder
			? `${buildSafetyReply("status")} ${statusReply}`
			: statusReply;

		return {
			intent: classified.intent,
			replyText,
			deliveryChannel,
		};
	};

	return {
		classifyInboundMessage,
		processMessage,
	};
}

function buildSafetyReply(target: "action" | "workflow" | "status"): string {
	const allowedActions = DEFAULT_ALLOWED_ACTIONS.map((action) => action.key).join(
		", "
	);
	const allowedWorkflows = DEFAULT_ALLOWED_WORKFLOWS.map(
		(workflow) => workflow.key
	).join(", ");

	if (target === "action") {
		return `That action is not allowlisted. Use \`run action <key>\` with one of: ${allowedActions}.`;
	}
	if (target === "workflow") {
		return `That workflow is not allowlisted. Use \`dispatch workflow <key>\` with one of: ${allowedWorkflows}.`;
	}
	return `Only fixed intents are enabled here: \`status\`, \`run action <key>\`, or \`dispatch workflow <key>\`.`;
}
