import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import type { CheckContext } from '../types';
import { runWorkspaceChecks } from './workspace';

function writeJson(filePath: string, value: unknown): void {
	writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

describe('runWorkspaceChecks', () => {
	it('does not warn on the default output directory at monorepo root', async () => {
		const root = mkdtempSync(join(tmpdir(), 'contractspec-workspace-check-'));

		try {
			writeJson(join(root, 'package.json'), {
				name: 'contractspec-test',
				workspaces: ['packages/*'],
			});
			writeJson(join(root, '.contractsrc.json'), {
				outputDir: './src',
				packages: ['packages/libs/*'],
			});
			mkdirSync(join(root, 'packages', 'libs', 'schema', 'src', 'contracts'), {
				recursive: true,
			});

			const context: CheckContext = {
				workspaceRoot: root,
				packageRoot: root,
				isMonorepo: true,
				packageName: 'contractspec',
				verbose: false,
			};

			const checks = await runWorkspaceChecks(
				createNodeFsAdapter(root),
				context
			);
			const outputDirectoryCheck = checks.find(
				(check) => check.name === 'Output Directory'
			);

			expect(outputDirectoryCheck?.status).toBe('pass');
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});
});
