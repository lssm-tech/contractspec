import { afterEach, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProgram } from '../../program/create-program';
import { resolveCompletionCandidates } from './resolver';

describe('completion resolver', () => {
	const tempDirs: string[] = [];

	afterEach(() => {
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { force: true, recursive: true });
		}
	});

	it('includes public root commands and aliases', async () => {
		const program = createProgram();

		expect(await resolveCompletionCandidates(program, ['comp'])).toContain(
			'completion'
		);
		expect(await resolveCompletionCandidates(program, ['flo'])).toContain(
			'flow'
		);
	});

	it('returns option suggestions for the active command', async () => {
		const program = createProgram();
		const suggestions = await resolveCompletionCandidates(program, [
			'completion',
			'install',
			'--wr',
		]);

		expect(suggestions).toContain('--write-profile');
	});

	it('returns targeted enum values for mapped options', async () => {
		const program = createProgram();

		expect(
			await resolveCompletionCandidates(program, ['create', '--type', 'op'])
		).toContain('operation');
		expect(
			await resolveCompletionCandidates(program, [
				'import',
				'--framework',
				'ne',
			])
		).toContain('nestjs');
	});

	it('falls back to filesystem suggestions for path-like arguments and options', async () => {
		const workspace = mkdtempSync(join(tmpdir(), 'contractspec-completion-'));
		tempDirs.push(workspace);

		mkdirSync(join(workspace, 'src', 'contracts'), { recursive: true });
		mkdirSync(join(workspace, 'generated'), { recursive: true });
		writeFileSync(join(workspace, 'src', 'contracts', 'demo.ts'), '', 'utf8');

		const program = createProgram();
		const positional = await resolveCompletionCandidates(
			program,
			['build', 'sr'],
			workspace
		);
		const optionValue = await resolveCompletionCandidates(
			program,
			['openapi', 'import', 'schema.json', '--output-dir', 'ge'],
			workspace
		);

		expect(positional).toContain('src/');
		expect(optionValue).toContain('generated/');
	});
});
