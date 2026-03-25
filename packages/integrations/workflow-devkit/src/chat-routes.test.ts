import { describe, expect, it, mock } from 'bun:test';
import {
	createWorkflowDevkitFollowUpRoute,
	createWorkflowDevkitStartRoute,
	createWorkflowDevkitStreamRoute,
	WORKFLOW_RUN_ID_HEADER,
	WORKFLOW_STREAM_TAIL_INDEX_HEADER,
} from './chat-routes';
import type { WorkflowRunReadableLike } from './types';

describe('workflow chat routes', () => {
	it('returns the workflow run id header on start', async () => {
		const route = createWorkflowDevkitStartRoute({
			async buildArgs(body) {
				return [body];
			},
			workflow: async () => undefined,
			workflowApi: {
				async start() {
					return {
						readable: createReadable(),
						runId: 'run-1',
					};
				},
			},
		});

		const response = await route(
			new Request('http://localhost/api/chat', {
				body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
				method: 'POST',
			})
		);
		expect(response.headers.get(WORKFLOW_RUN_ID_HEADER)).toBe('run-1');
	});

	it('resumes a hook on follow-up', async () => {
		const resumeHook = mock(async () => undefined);
		const route = createWorkflowDevkitFollowUpRoute({
			resolveToken({ runId }) {
				return `session:${runId}`;
			},
			workflowApi: {
				resumeHook,
			},
		});

		const response = await route(
			new Request('http://localhost/api/chat/run-1/message', {
				body: JSON.stringify({ message: 'continue' }),
				method: 'POST',
			}),
			{ params: { runId: 'run-1' } }
		);

		expect(resumeHook).toHaveBeenCalledWith('session:run-1', {
			message: 'continue',
		});
		expect(response.headers.get(WORKFLOW_RUN_ID_HEADER)).toBe('run-1');
	});

	it('returns reconnect streams with tail index metadata', async () => {
		const route = createWorkflowDevkitStreamRoute({
			workflowApi: {
				getRun() {
					return {
						getReadable() {
							return createReadable(42);
						},
						runId: 'run-2',
					};
				},
			},
		});

		const response = await route(
			new Request('http://localhost/api/chat/run-2/stream?startIndex=-5'),
			{ params: { runId: 'run-2' } }
		);

		expect(response.headers.get(WORKFLOW_STREAM_TAIL_INDEX_HEADER)).toBe('42');
	});
});

function createReadable(tailIndex?: number): WorkflowRunReadableLike {
	const stream = new ReadableStream();
	return Object.assign(stream, {
		getTailIndex: tailIndex === undefined ? undefined : () => tailIndex,
	});
}
