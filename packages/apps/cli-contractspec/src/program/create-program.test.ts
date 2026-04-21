import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const CLI_ENTRY = resolve(import.meta.dir, '../cli.ts');

describe('createProgram', () => {
	it('drops apply from the public root surface', () => {
		const help = runCliHelp(['--help']);

		expect(help).not.toMatch(/^\s*apply\s+/m);
	}, 15_000);

	it('exposes the expanded create target list and agent summary', () => {
		const rootHelp = runCliHelp(['--help']);
		const createHelp = runCliHelp(['create', '--help']);

		expect(createHelp).toContain('module-bundle');
		expect(createHelp).toContain('builder-spec');
		expect(createHelp).toContain('provider-spec');
		expect(rootHelp).toMatch(
			/^\s*agent\s+Export agent specs to external agent runtimes$/m
		);
		expect(rootHelp).toMatch(/^\s*onboard .*repo-local onboarding/m);
	}, 15_000);

	it('updates build/generate/validate help to the new authoring model', () => {
		const rootHelp = runCliHelp(['--help']);

		expect(rootHelp).toMatch(
			/^\s*build .*Materialize runtime artifacts.*authored target$/m
		);
		expect(rootHelp).toMatch(/^\s*generate .*derived artifacts/m);
		expect(rootHelp).toMatch(/^\s*validate .*package scaffolds/m);
	}, 15_000);
});

function runCliHelp(args: string[]): string {
	const result = spawnSync('bun', ['--no-env-file', CLI_ENTRY, ...args], {
		encoding: 'utf8',
		env: createSubprocessEnv(),
	});

	expect(result.status).toBe(0);
	return stripAnsi(result.stdout);
}

function stripAnsi(text: string): string {
	return text.replace(/\x1B\[[0-9;]*m/g, '');
}

function createSubprocessEnv(
	extraEnv: Record<string, string> = {}
): Record<string, string> {
	const env: Record<string, string> = {};
	for (const key of [
		'BUN_INSTALL',
		'HOME',
		'PATH',
		'SHELL',
		'TEMP',
		'TMP',
		'TMPDIR',
		'USER',
	] as const) {
		const value = process.env[key];
		if (value) {
			env[key] = value;
		}
	}
	return { ...env, FORCE_COLOR: '0', NO_COLOR: '1', ...extraEnv };
}
