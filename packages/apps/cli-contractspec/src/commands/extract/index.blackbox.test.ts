import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../../../../../../'
);

function stripAnsi(text: string) {
	return text.replace(/\x1B\[[0-9;]*m/g, '');
}

const describeBlackbox =
	process.env.RUN_CLI_BLACKBOX === '1' ? describe : describe.skip;

describeBlackbox('extract command', () => {
	it('requires --source before invoking the workspace service', () => {
		const result = spawnSync(
			'bun',
			['--no-env-file', 'packages/apps/cli-contractspec/src/cli.ts', 'extract'],
			{
				cwd: repoRoot,
				encoding: 'utf8',
				env: createSubprocessEnv(),
			}
		);

		expect(result.status).not.toBe(0);
		expect(stripAnsi(result.stderr)).toMatch(
			/required option .*--source <path>.*not specified/i
		);
	});
});

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
