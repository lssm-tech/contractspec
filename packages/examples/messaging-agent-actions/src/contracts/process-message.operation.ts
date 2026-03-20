import {
	defineCommand,
	defineSchemaModel,
} from "@contractspec/lib.contracts-spec";
import { ScalarTypeEnum } from "@contractspec/lib.schema";

const MessagingInboundMessageInput = defineSchemaModel({
	name: "MessagingInboundMessageInput",
	fields: {
		provider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		senderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		threadId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		text: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const MessagingInboundMessageResult = defineSchemaModel({
	name: "MessagingInboundMessageResult",
	fields: {
		intent: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		replyText: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		actionKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		deliveryChannel: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
	},
});

export const ProcessMessagingAgentAction = defineCommand({
	meta: {
		key: "messaging.agentActions.process",
		version: "1.0.0",
		title: "Process Messaging Agent Action",
		description:
			"Classify an inbound message into a fixed allowlisted action or workflow path and return a safe confirmation reply.",
		goal:
			"Demonstrate trustworthy messaging automation without arbitrary tool execution.",
		context: "Curated messaging demo example for ContractSpec.",
		owners: ["@platform.messaging"],
		tags: ["messaging", "agents", "actions", "workflow"],
		stability: "beta",
	},
	io: {
		input: MessagingInboundMessageInput,
		output: MessagingInboundMessageResult,
	},
	acceptance: {
		scenarios: [
			{
				key: "status-check",
				given: ["An operator sends a status request from a messaging channel"],
				when: ["The inbound message is processed"],
				then: ["A deterministic status reply is returned"],
			},
			{
				key: "allowlisted-action",
				given: ["An operator asks to run an allowlisted action"],
				when: ["The action key matches the safe allowlist"],
				then: ["The reply confirms the action without arbitrary execution"],
			},
			{
				key: "allowlisted-workflow",
				given: ["An operator asks to dispatch an allowlisted workflow"],
				when: ["The workflow key matches the safe allowlist"],
				then: ["The reply confirms the workflow dispatch request"],
			},
		],
	},
	policy: {
		auth: "admin",
	},
});
