import { describe, expect, it } from 'bun:test';
import { SandboxedCodeExecutionAdapter } from './sandboxedCodeExecutionAdapter';

describe('SandboxedCodeExecutionAdapter', () => {
	it('runs looping and branching scripts', async () => {
		const adapter = new SandboxedCodeExecutionAdapter();
		const result = await adapter.execute({
			context: {},
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'sandbox',
				isolation: 'sandbox',
				environment: 'sandbox',
			},
			step: {
				key: 'validate',
				description: 'Validate',
				actionClass: 'code-exec-read',
				intent: 'Execute script',
				input: {
					script:
						'let total = 0; for (let i = 0; i < 5; i += 1) total += i; return total > 5 ? { ok: true, total } : { ok: false, total };',
				},
			},
		});

		expect(result.status).toBe('completed');
		expect(result).toMatchObject({
			status: 'completed',
			output: { ok: true, total: 10 },
		});
	});
});
