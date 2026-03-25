import {
	createWorkflowDevkitFollowUpRoute,
	createWorkflowDevkitStartRoute,
	createWorkflowDevkitStreamRoute,
	type WorkflowApiLike,
	WorkflowChatTransport,
} from '@contractspec/integration.workflow-devkit';
import { z } from 'zod';
import type { ThinkingLevel } from './thinking-levels';

export const WORKFLOW_CHAT_ROUTE_MAX_DURATION = 30;

const START_BODY_SCHEMA = z.object({
	chatId: z.string().optional(),
	messages: z.array(z.unknown()).min(1, 'messages array required'),
	model: z.string().optional(),
	thinkingLevel: z
		.enum(['instant', 'thinking', 'extra_thinking', 'max'])
		.optional(),
});

const FOLLOW_UP_BODY_SCHEMA = z.object({
	chatId: z.string().optional(),
	message: z.unknown().optional(),
	messages: z.array(z.unknown()).optional(),
	payload: z.unknown().optional(),
});

type WorkflowChatStartBody = z.infer<typeof START_BODY_SCHEMA>;
type WorkflowChatFollowUpBody = z.infer<typeof FOLLOW_UP_BODY_SCHEMA>;

export interface CreateWorkflowChatRoutesOptions {
	buildFollowUpPayload?: (
		body: WorkflowChatFollowUpBody
	) => Promise<unknown> | unknown;
	getFollowUpToken: (params: {
		body: WorkflowChatFollowUpBody;
		runId: string;
	}) => string;
	workflow: (
		payload: WorkflowChatStartBody & { thinkingLevel?: ThinkingLevel }
	) => Promise<unknown>;
	workflowApi?: Partial<WorkflowApiLike>;
}

export function createWorkflowChatRoutes(
	options: CreateWorkflowChatRoutesOptions
) {
	return {
		followUp: createWorkflowDevkitFollowUpRoute<WorkflowChatFollowUpBody>({
			async buildPayload(body) {
				const parsed = FOLLOW_UP_BODY_SCHEMA.parse(body);
				return options.buildFollowUpPayload
					? options.buildFollowUpPayload(parsed)
					: (parsed.payload ?? parsed.message ?? parsed.messages ?? parsed);
			},
			resolveToken({ body, runId }) {
				return options.getFollowUpToken({ body, runId });
			},
			workflowApi: options.workflowApi?.resumeHook
				? { resumeHook: options.workflowApi.resumeHook }
				: undefined,
		}),
		start: createWorkflowDevkitStartRoute<WorkflowChatStartBody>({
			async buildArgs(body) {
				const parsed = START_BODY_SCHEMA.parse(body);
				return [parsed];
			},
			workflow: options.workflow as (...args: unknown[]) => Promise<unknown>,
			workflowApi: options.workflowApi?.start
				? { start: options.workflowApi.start }
				: undefined,
		}),
		stream: createWorkflowDevkitStreamRoute({
			workflowApi: options.workflowApi?.getRun
				? { getRun: options.workflowApi.getRun }
				: undefined,
		}),
	};
}

export { WorkflowChatTransport };
