import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = dirname(fileURLToPath(import.meta.url));

describe('Metro config', () => {
	test('loads through Node', () => {
		const result = spawnSync('node', ['-e', "require('./metro.config.js')"], {
			cwd: appRoot,
			encoding: 'utf8',
		});

		if (result.status !== 0) {
			throw new Error(
				[result.stderr.trim(), result.stdout.trim()].filter(Boolean).join('\n')
			);
		}

		expect(result.status).toBe(0);
	});
});
