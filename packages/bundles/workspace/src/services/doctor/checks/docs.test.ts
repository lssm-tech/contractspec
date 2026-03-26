import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import type { CheckContext } from '../types';
import { runDocChecks } from './docs';

function writeJson(filePath: string, value: unknown): void {
	writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

describe('runDocChecks', () => {
	it('reports standalone DocBlock files across workspace packages', async () => {
		const root = mkdtempSync(join(tmpdir(), 'contractspec-doc-check-'));

		try {
			writeJson(join(root, 'package.json'), {
				name: 'contractspec-test',
				workspaces: ['packages/*'],
			});
			const packageRoot = join(root, 'packages', 'examples', 'demo');
			const srcRoot = join(packageRoot, 'src');
			mkdirSync(join(srcRoot, 'docs'), { recursive: true });
			writeJson(join(packageRoot, 'package.json'), {
				name: '@contractspec/example.demo',
			});
			writeFileSync(
				join(srcRoot, 'docs', 'example.docblock.ts'),
				'export const ExampleDocBlock = { id: "docs.demo", title: "Demo", body: "Demo" };',
				'utf8'
			);

			const context: CheckContext = {
				workspaceRoot: root,
				packageRoot: root,
				isMonorepo: true,
				packageName: 'contractspec',
				verbose: false,
			};

			const checks = await runDocChecks(createNodeFsAdapter(root), context);

			expect(checks.some((check) => check.status === 'fail')).toBeTrue();
			expect(
				checks.some(
					(check) => check.context?.['ruleId'] === 'docblock-standalone-source'
				)
			).toBeTrue();
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});
});
