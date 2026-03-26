import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { runDocsChecks } from './docs';

function writeJson(filePath: string, value: unknown): void {
	writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

const logger = {
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	createProgress: () => ({
		start: () => {},
		update: () => {},
		succeed: () => {},
		fail: () => {},
		warn: () => {},
		stop: () => {},
	}),
};

describe('runDocsChecks', () => {
	it('emits docs-category CI issues for invalid DocBlock ownership', async () => {
		const root = mkdtempSync(join(tmpdir(), 'contractspec-doc-ci-'));

		try {
			writeJson(join(root, 'package.json'), {
				name: 'contractspec-test',
				workspaces: ['packages/*'],
			});
			const packageRoot = join(root, 'packages', 'apps', 'demo');
			const srcRoot = join(packageRoot, 'src');
			mkdirSync(srcRoot, { recursive: true });
			writeJson(join(packageRoot, 'package.json'), {
				name: '@contractspec/app.demo',
			});
			writeFileSync(
				join(srcRoot, 'demo.command.ts'),
				`
					import { docRef } from "@contractspec/lib.contracts-spec/docs";
					export const DemoCommand = {
						meta: {
							docId: [docRef("docs.demo.shared")]
						}
					};
				`,
				'utf8'
			);
			writeFileSync(
				join(srcRoot, 'docs.ts'),
				`
					import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
					export const SharedDocBlock = {
						id: "docs.demo.shared",
						title: "Shared",
						kind: "reference",
						visibility: "public",
						route: "/docs/demo/shared",
						body: "Shared"
					} satisfies DocBlock;
				`,
				'utf8'
			);

			const issues = await runDocsChecks(
				{ fs: createNodeFsAdapter(root), logger },
				{ workspaceRoot: root }
			);

			expect(issues.some((issue) => issue.category === 'docs')).toBeTrue();
			expect(
				issues.some((issue) => issue.ruleId === 'docblock-cross-file-reference')
			).toBeTrue();
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});
});
