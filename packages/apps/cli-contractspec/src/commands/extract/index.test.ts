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

describe('extract command', () => {
	it('requires --source before invoking the workspace service', () => {
		const result = spawnSync(
			process.execPath,
			['packages/apps/cli-contractspec/src/cli.ts', 'extract'],
			{
				cwd: repoRoot,
				encoding: 'utf8',
			}
		);

		expect(result.status).not.toBe(0);
		expect(stripAnsi(result.stderr)).toMatch(
			/required option .*--source <path>.*not specified/i
		);
	});
});
