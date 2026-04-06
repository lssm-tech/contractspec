import { describe, expect, it } from 'bun:test';

import { controlPlaneCommand } from './index';

describe('control-plane command', () => {
	it('exposes approval flows', () => {
		const approval = controlPlaneCommand.commands.find(
			(cmd) => cmd.name() === 'approval'
		);
		expect(approval).toBeDefined();
		expect(approval?.commands.map((cmd) => cmd.name())).toEqual([
			'list',
			'approve',
			'reject',
			'expire',
		]);
	});

	it('exposes trace flows', () => {
		const trace = controlPlaneCommand.commands.find(
			(cmd) => cmd.name() === 'trace'
		);
		expect(trace).toBeDefined();
		expect(trace?.commands.map((cmd) => cmd.name())).toEqual([
			'get',
			'list',
			'replay',
		]);
	});

	it('exposes execution lane flows', () => {
		const lane = controlPlaneCommand.commands.find(
			(cmd) => cmd.name() === 'lane'
		);
		expect(lane).toBeDefined();
		expect(lane?.commands.map((cmd) => cmd.name())).toEqual([
			'list',
			'get',
			'pause',
			'resume',
			'retry',
			'nudge',
			'abort',
			'shutdown',
			'request-approval',
			'escalate',
			'evidence',
			'replay',
		]);
	});

	it('keeps help text for operator flows', () => {
		const approval = controlPlaneCommand.commands.find(
			(cmd) => cmd.name() === 'approval'
		);
		const approve = approval?.commands.find((cmd) => cmd.name() === 'approve');
		const trace = controlPlaneCommand.commands.find(
			(cmd) => cmd.name() === 'trace'
		);
		const traceList = trace?.commands.find((cmd) => cmd.name() === 'list');

		expect(approve?.description()).toContain('Approve a blocked decision');
		expect(
			approve?.options.find((option) => option.long === '--actor-id')
				?.description
		).toContain('Approver id');
		expect(traceList?.description()).toContain('operator-friendly filters');
	});
});
