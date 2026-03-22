import { describe, expect, it } from 'bun:test';
import { InMemoryChannelRuntimeStore } from './memory-store';
import { ChannelRuntimeService } from './service';
import { ChannelTraceService } from './trace';

describe('ChannelTraceService', () => {
	it('returns a replayable execution trace for autonomous decisions', async () => {
		const store = new InMemoryChannelRuntimeStore();
		const service = new ChannelRuntimeService(store, {
			asyncProcessing: false,
			defaultCapabilityGrants: [
				'control-plane.channel-runtime.reply.autonomous',
			],
			now: () => new Date('2026-03-22T10:00:00.000Z'),
		});
		await service.ingest({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-1',
			eventType: 'slack.message',
			occurredAt: new Date('2026-03-22T10:00:00.000Z'),
			signatureValid: true,
			thread: {
				externalThreadId: 'thread-1',
				externalChannelId: 'C123',
				externalUserId: 'U123',
			},
			metadata: {
				sessionId: 'sess-1',
				workflowId: 'wf-1',
			},
			message: { text: 'Please send the docs link.' },
		});

		const traceService = new ChannelTraceService(store);
		const decisionId = [...store.decisions.keys()][0]!;
		const trace = await traceService.getExecutionTrace(decisionId);

		expect(trace?.receipt?.status).toBe('processed');
		expect(trace?.decision.actionPlan.id).toBeDefined();
		expect(trace?.actions).toHaveLength(1);
		expect(trace?.replay.traceId).toBe(trace?.decision.actionPlan.traceId);

		const replay = await traceService.replayExecutionTrace(decisionId);
		expect(replay?.matches).toBe(true);
		expect(replay?.mismatches).toHaveLength(0);
	});

	it('lists traces filtered by workspace', async () => {
		const store = new InMemoryChannelRuntimeStore();
		const service = new ChannelRuntimeService(store, {
			asyncProcessing: false,
			defaultCapabilityGrants: [
				'control-plane.channel-runtime.reply.autonomous',
			],
		});
		await service.ingest({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-1',
			eventType: 'slack.message',
			occurredAt: new Date('2026-03-22T10:00:00.000Z'),
			signatureValid: true,
			thread: { externalThreadId: 'thread-1' },
			message: { text: 'one' },
		});
		await service.ingest({
			workspaceId: 'workspace-2',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-2',
			eventType: 'slack.message',
			occurredAt: new Date('2026-03-22T10:01:00.000Z'),
			signatureValid: true,
			thread: { externalThreadId: 'thread-2' },
			message: { text: 'two' },
		});

		const traces = await new ChannelTraceService(store).listExecutionTraces({
			workspaceId: 'workspace-1',
		});

		expect(traces).toHaveLength(1);
		expect(traces[0]?.decision.actionPlan.workspaceId).toBe('workspace-1');
	});

	it('supports operator-friendly trace selectors', async () => {
		const store = new InMemoryChannelRuntimeStore();
		const service = new ChannelRuntimeService(store, {
			asyncProcessing: false,
			defaultCapabilityGrants: [
				'control-plane.channel-runtime.reply.autonomous',
			],
			now: () => new Date('2026-03-22T10:00:00.000Z'),
		});
		const result = await service.ingest({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-selector',
			eventType: 'slack.message',
			occurredAt: new Date('2026-03-22T10:00:00.000Z'),
			signatureValid: true,
			thread: { externalThreadId: 'thread-selector', externalUserId: 'U123' },
			metadata: { sessionId: 'sess-1', workflowId: 'wf-1' },
			message: { text: 'selector coverage' },
		});

		const receipt = [...store.receipts.values()][0]!;
		const decision = [...store.decisions.values()][0]!;
		const traces = await new ChannelTraceService(store).listExecutionTraces({
			traceId: result.receiptId ? decision.actionPlan.traceId : undefined,
			receiptId: receipt.id,
			externalEventId: 'evt-selector',
			actorId: decision.actionPlan.actor.id,
			sessionId: 'sess-1',
			workflowId: 'wf-1',
			createdAfter: new Date('2020-03-22T09:59:00.000Z'),
			createdBefore: new Date('2035-03-22T10:01:00.000Z'),
		});

		expect(traces).toHaveLength(1);
		expect(traces[0]?.decision.id).toBe(decision.id);
	});
});
