import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { WorkspaceAdapters } from '../../ports/logger';
import {
	loadAuthoredDocBlocksFromSourceFiles,
	loadPackageAuthoredDocBlocks,
} from './docs-service';

describe('docs-service authored DocBlocks', () => {
	it('loads same-file authored DocBlocks from source files', async () => {
		const source = `
			import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";

			export const ExampleDocBlock = {
				id: "docs.example",
				title: "Example",
				summary: "Summary",
				kind: "reference",
				visibility: "public",
				route: "/docs/example",
				body: "Body"
			} satisfies DocBlock;
		`;

		const blocks = await loadAuthoredDocBlocksFromSourceFiles(
			['/tmp/example.feature.ts'],
			{
				fs: {
					readFile: async () => source,
				},
			} as unknown as Pick<WorkspaceAdapters, 'fs'>
		);

		expect(blocks).toHaveLength(1);
		expect(blocks[0]?.id).toBe('docs.example');
	});

	it('loads package authored DocBlocks through the shared manifest builder', () => {
		const srcRoot = fs.mkdtempSync(
			path.join(os.tmpdir(), 'bundle-authored-docs-')
		);
		fs.writeFileSync(
			path.join(srcRoot, 'feature.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";

				export const ExampleDocBlock = {
					id: "docs.example.package",
					title: "Package Example",
					kind: "reference",
					visibility: "public",
					route: "/docs/example/package",
					body: "Body"
				} satisfies DocBlock;
			`,
			'utf8'
		);

		const blocks = loadPackageAuthoredDocBlocks('@test/example', srcRoot);
		expect(blocks).toHaveLength(1);
		expect(blocks[0]?.id).toBe('docs.example.package');
	});
});
