import { createUIMessageStreamResponse } from 'ai';
import { getRun, resumeHook, start } from 'workflow/api';
import type { WorkflowApiLike, WorkflowRunLike } from './types';

export const WORKFLOW_RUN_ID_HEADER = 'x-workflow-run-id';
export const WORKFLOW_STREAM_TAIL_INDEX_HEADER = 'x-workflow-stream-tail-index';

export interface CreateWorkflowDevkitStartRouteOptions<TBody = unknown> {
	buildArgs: (body: TBody, request: Request) => Promise<unknown[]> | unknown[];
	createResponse?: (params: {
		body: TBody;
		run: WorkflowRunLike;
	}) => Promise<Response> | Response;
	workflow: (...args: unknown[]) => Promise<unknown>;
	workflowApi?: Pick<WorkflowApiLike, 'start'>;
}

export interface CreateWorkflowDevkitFollowUpRouteOptions<TBody = unknown> {
	buildPayload?: (body: TBody, request: Request) => Promise<unknown> | unknown;
	resolveToken: (params: {
		body: TBody;
		request: Request;
		runId: string;
	}) => string;
	workflowApi?: Pick<WorkflowApiLike, 'resumeHook'>;
}

export interface CreateWorkflowDevkitStreamRouteOptions {
	workflowApi?: Pick<WorkflowApiLike, 'getRun'>;
}

export function createWorkflowDevkitStartRoute<TBody = unknown>(
	options: CreateWorkflowDevkitStartRouteOptions<TBody>
) {
	const workflowApi = options.workflowApi ?? { start };
	return async (request: Request): Promise<Response> => {
		const body = (await request.json()) as TBody;
		const args = await options.buildArgs(body, request);
		const run = await workflowApi.start(options.workflow, args);
		if (options.createResponse) {
			return options.createResponse({ body, run });
		}
		if (!run.readable) {
			return new Response(JSON.stringify({ runId: run.runId }), {
				headers: {
					'Content-Type': 'application/json',
					[WORKFLOW_RUN_ID_HEADER]: run.runId,
				},
			});
		}
		return createUIMessageStreamResponse({
			headers: {
				[WORKFLOW_RUN_ID_HEADER]: run.runId,
			},
			stream: run.readable,
		});
	};
}

export function createWorkflowDevkitFollowUpRoute<TBody = unknown>(
	options: CreateWorkflowDevkitFollowUpRouteOptions<TBody>
) {
	const workflowApi = options.workflowApi ?? { resumeHook };
	return async (
		request: Request,
		context: { params: { id?: string; runId?: string } }
	): Promise<Response> => {
		const runId = context.params.runId ?? context.params.id;
		if (!runId) {
			return new Response(JSON.stringify({ error: 'Missing run id' }), {
				status: 400,
			});
		}

		const body = (await request.json()) as TBody;
		const token = options.resolveToken({ body, request, runId });
		const payload = options.buildPayload
			? await options.buildPayload(body, request)
			: body;
		await workflowApi.resumeHook(token, payload);
		return new Response(JSON.stringify({ ok: true }), {
			headers: {
				'Content-Type': 'application/json',
				[WORKFLOW_RUN_ID_HEADER]: runId,
			},
		});
	};
}

export function createWorkflowDevkitStreamRoute(
	options: CreateWorkflowDevkitStreamRouteOptions = {}
) {
	const workflowApi = options.workflowApi ?? { getRun };
	return async (
		request: Request,
		context: { params: { id?: string; runId?: string } }
	): Promise<Response> => {
		const runId = context.params.runId ?? context.params.id;
		if (!runId) {
			return new Response(JSON.stringify({ error: 'Missing run id' }), {
				status: 400,
			});
		}

		const run = workflowApi.getRun(runId);
		if (!run) {
			return new Response(JSON.stringify({ error: 'Workflow run not found' }), {
				status: 404,
			});
		}

		const startIndex = readStartIndex(request.url);
		const readable = run.getReadable
			? run.getReadable({ startIndex })
			: run.readable;
		if (!readable) {
			return new Response(
				JSON.stringify({ error: 'Run has no readable stream' }),
				{
					status: 404,
				}
			);
		}

		const tailIndex = await readable.getTailIndex?.();
		return createUIMessageStreamResponse({
			headers: {
				...(tailIndex !== undefined
					? {
							[WORKFLOW_STREAM_TAIL_INDEX_HEADER]: String(tailIndex),
						}
					: {}),
			},
			stream: readable,
		});
	};
}

function readStartIndex(url: string): number | undefined {
	const parsed = new URL(url);
	const rawStartIndex = parsed.searchParams.get('startIndex');
	if (!rawStartIndex) {
		return undefined;
	}

	const parsedStartIndex = Number(rawStartIndex);
	return Number.isFinite(parsedStartIndex) ? parsedStartIndex : undefined;
}
