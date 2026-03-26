import { describe, expect, it, mock } from 'bun:test';
import { createWorkflowChatRoutes } from './create-workflow-chat-routes';

describe('createWorkflowChatRoutes', () => {
	it('parses start payloads and delegates to workflow start', async () => {
		const start = mock(async () => ({
			readable: new ReadableStream(),
			runId: 'run-1',
		}));
		const routes = createWorkflowChatRoutes({
			getFollowUpToken({ runId }) {
				return `chat:${runId}`;
			},
			async workflow() {
				return undefined;
			},
			workflowApi: {
				start,
			},
		});

		const response = await routes.start(
			new Request('http://localhost/api/chat', {
				body: JSON.stringify({
					messages: [{ role: 'user', content: 'hello' }],
				}),
				method: 'POST',
			})
		);

		expect(start).toHaveBeenCalled();
		expect(response.headers.get('x-workflow-run-id')).toBe('run-1');
	});

	it('builds follow-up payloads from message-first bodies', async () => {
		const resumeHook = mock(async () => undefined);
		const routes = createWorkflowChatRoutes({
			getFollowUpToken({ runId }) {
				return `chat:${runId}`;
			},
			async workflow() {
				return undefined;
			},
			workflowApi: {
				resumeHook,
			},
		});

		await routes.followUp(
			new Request('http://localhost/api/chat/run-1/message', {
				body: JSON.stringify({
					message: { role: 'user', content: 'continue' },
				}),
				method: 'POST',
			}),
			{ params: { runId: 'run-1' } }
		);

		expect(resumeHook).toHaveBeenCalledWith('chat:run-1', {
			role: 'user',
			content: 'continue',
		});
	});
});
