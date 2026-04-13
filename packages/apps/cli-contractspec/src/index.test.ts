import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../../../..'
);

function stripAnsi(text: string) {
	return text.replace(/\x1B\[[0-9;]*m/g, '');
}

describe('contractspec root help', () => {
	it('renders grouped command categories and a non-empty agent summary', () => {
		const result = spawnSync(
			process.execPath,
			['packages/apps/cli-contractspec/src/cli.ts', '--help'],
			{
				cwd: repoRoot,
				encoding: 'utf8',
			}
		);

		expect(result.status).toBe(0);

		const output = stripAnsi(result.stdout);

		expect(output).toContain('Essentials');
		expect(output).toMatch(
			/^\s*completion\s+Generate and install shell completion/m
		);
		expect(output).toContain('Development');
		expect(output).toContain('Testing & Quality');
		expect(output).toContain('AI & Assistants');
		expect(output).toContain('Operations');
		expect(output).not.toMatch(/^\s*apply\s+/m);
		expect(output).toMatch(
			/^\s*agent\s+Export agent specs to external agent runtimes$/m
		);
	});
});
