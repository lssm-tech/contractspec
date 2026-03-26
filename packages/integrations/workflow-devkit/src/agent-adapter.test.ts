import { describe, expect, it, mock } from 'bun:test';
import type { AgentSessionState } from '@contractspec/lib.ai-agent/types';
import {
	createWorkflowDevkitAgentRuntimeAdapterBundle,
	InMemoryWorkflowDevkitCheckpointStore,
	InMemoryWorkflowDevkitSuspensionStore,
} from './agent-adapter';

describe('createWorkflowDevkitAgentRuntimeAdapterBundle', () => {
	it('persists checkpoints and resumes suspended sessions through hooks', async () => {
		const checkpointStore = new InMemoryWorkflowDevkitCheckpointStore();
		const suspensionStore = new InMemoryWorkflowDevkitSuspensionStore();
		const resumeHook = mock(async () => undefined);
		const adapter = createWorkflowDevkitAgentRuntimeAdapterBundle({
			checkpointStore,
			suspensionStore,
			workflowApi: {
				resumeHook,
			},
		});

		const state = {
			sessionId: 'session-1',
			agentId: 'agent-1',
			status: 'running',
			messages: [],
			steps: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		} as AgentSessionState;

		await adapter.checkpoint?.save({
			sessionId: 'session-1',
			state,
			createdAt: new Date(),
		});
		const checkpoint = await adapter.checkpoint?.load('session-1');
		expect(checkpoint?.state.sessionId).toBe('session-1');

		await adapter.suspendResume?.suspend({
			sessionId: 'session-1',
			reason: 'approval',
			metadata: { traceId: 'trace-1' },
		});
		const suspended = await suspensionStore.get('session-1');
		expect(suspended?.reason).toBe('approval');

		await adapter.suspendResume?.resume({
			sessionId: 'session-1',
			input: 'continue',
			metadata: { traceId: 'trace-1' },
		});
		expect(resumeHook).toHaveBeenCalledWith('agent-session:session-1', {
			input: 'continue',
			metadata: { traceId: 'trace-1' },
			sessionId: 'session-1',
		});
	});
});
