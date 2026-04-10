import { describe, expect, it } from 'bun:test';
import {
	parseExecutionLaneCommand,
	resolveExecutionLaneCommand,
} from './commands';

describe('execution lane interop commands', () => {
	it('parses the documented lane entrypoints', () => {
		const cases = [
			{
				raw: '/clarify harden the task boundaries',
				usage: '/clarify',
				lane: 'clarify',
				task: 'harden the task boundaries',
			},
			{
				raw: '/plan implement the rollout',
				usage: '/plan',
				lane: 'plan.consensus',
				task: 'implement the rollout',
			},
			{
				raw: '/plan --consensus investigate the API break',
				usage: '/plan --consensus',
				lane: 'plan.consensus',
				task: 'investigate the API break',
			},
			{
				raw: '/complete ship the persistent closer',
				usage: '/complete',
				lane: 'complete.persistent',
				task: 'ship the persistent closer',
			},
			{
				raw: '/team fan out the execution',
				usage: '/team',
				lane: 'team.coordinated',
				task: 'fan out the execution',
			},
		] as const;

		for (const testCase of cases) {
			const parsed = parseExecutionLaneCommand(testCase.raw);
			expect(parsed?.usage).toBe(testCase.usage);
			expect(parsed?.lane).toBe(testCase.lane);
			expect(parsed?.task).toBe(testCase.task);
		}
	});

	it('rejects unsupported flags and resolves lanes back to default commands', () => {
		expect(parseExecutionLaneCommand('/plan --fast do it')).toBeUndefined();
		expect(resolveExecutionLaneCommand('clarify').usage).toBe('/clarify');
		expect(resolveExecutionLaneCommand('plan.consensus').usage).toBe('/plan');
		expect(resolveExecutionLaneCommand('complete.persistent').usage).toBe(
			'/complete'
		);
		expect(resolveExecutionLaneCommand('team.coordinated').usage).toBe('/team');
	});
});
