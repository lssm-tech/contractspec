import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../../../../../..'
);

const BLACKBOX_TESTS = [
	'packages/apps/cli-contractspec/src/commands/execution-lanes/behavior.blackbox.test.ts',
	'packages/apps/cli-contractspec/src/commands/completion/blackbox.blackbox.test.ts',
	'packages/apps/cli-contractspec/src/commands/extract/index.blackbox.test.ts',
	'packages/apps/cli-contractspec/src/commands/connect/blackbox.blackbox.test.ts',
] as const;

describe('CLI black-box suites', () => {
	it('runs subprocess-heavy CLI checks in an isolated Bun process', () => {
		const result = spawnSync(
			'bun',
			['--no-env-file', 'test', ...BLACKBOX_TESTS],
			{
				cwd: repoRoot,
				encoding: 'utf8',
				env: createSubprocessEnv(),
			}
		);

		expect(
			result.status,
			[result.stdout, result.stderr].filter(Boolean).join('\n')
		).toBe(0);
	}, 90_000);
});

function createSubprocessEnv(): Record<string, string> {
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
	return { ...env, FORCE_COLOR: '0', NO_COLOR: '1', RUN_CLI_BLACKBOX: '1' };
}
