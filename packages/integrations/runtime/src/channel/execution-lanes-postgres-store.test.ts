import { describe, expect, it } from 'bun:test';
import { PostgresExecutionLaneRuntimeStore } from './execution-lanes-postgres-store';

interface MockQueryResult<T = unknown> {
	rows: T[];
}

class MockPool {
	public readonly calls: { sql: string; params?: unknown[] }[] = [];
	private readonly queue: MockQueryResult[];

	constructor(queue: MockQueryResult[]) {
		this.queue = queue;
	}

	async query<T = unknown>(
		sql: string,
		params?: unknown[]
	): Promise<MockQueryResult<T>> {
		this.calls.push({ sql, params });
		const item = this.queue.shift();
		return (item ?? { rows: [] }) as MockQueryResult<T>;
	}
}

describe('PostgresExecutionLaneRuntimeStore', () => {
	it('persists run state and transitions in snapshot queries', async () => {
		const pool = new MockPool([
			{
				rows: [
					{
						run: { runId: 'run-1', lane: 'plan.consensus', status: 'running' },
					},
				],
			},
			{ rows: [{ artifact: { id: 'artifact-1' } }] },
			{ rows: [{ event: { id: 'event-1' } }] },
			{
				rows: [{ transition: { id: 'transition-1', to: 'team.coordinated' } }],
			},
			{ rows: [{ bundle: { id: 'evidence-1' } }] },
			{ rows: [{ approval: { id: 'approval-1' } }] },
			{ rows: [{ state: { runId: 'run-1', phase: 'working' } }] },
			{ rows: [{ state: { runId: 'run-1', status: 'running' } }] },
		]);
		const store = new PostgresExecutionLaneRuntimeStore(
			pool as unknown as ConstructorParameters<
				typeof PostgresExecutionLaneRuntimeStore
			>[0]
		);

		const snapshot = await store.getSnapshot('run-1');
		expect(snapshot?.transitions[0]?.id).toBe('transition-1');
		expect(snapshot?.evidence[0]?.id).toBe('evidence-1');
	});
});
