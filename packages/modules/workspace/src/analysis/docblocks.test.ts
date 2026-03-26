import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
	analyzePackageDocBlocks,
	buildPackageDocManifest,
	extractModuleDocData,
} from './docblocks';

describe('extractModuleDocData', () => {
	it('extracts same-file DocBlocks and doc refs without executing the module', () => {
		const source = `
			import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
			import { docRef } from "@contractspec/lib.contracts-spec/docs";

			const RuntimeValue = (() => {
				throw new Error("should not execute");
			})();

			export const ExampleDocBlock = {
				id: "docs.example",
				title: "Example",
				summary: "Example summary",
				kind: "reference",
				visibility: "public",
				route: "/docs/example",
				body: "Body"
			} satisfies DocBlock;

			export const ExampleSpec = {
				meta: {
					docId: [docRef(ExampleDocBlock.id)]
				}
			};
		`;

		const moduleData = extractModuleDocData(
			source,
			'/tmp/example.ts',
			'example'
		);

		expect(moduleData.entries).toHaveLength(1);
		expect(moduleData.entries[0]?.id).toBe('docs.example');
		expect(moduleData.docRefs).toEqual(['docs.example']);
	});
});

describe('buildPackageDocManifest', () => {
	it('fails when authored standalone DocBlock files remain', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-docs-'));
		fs.writeFileSync(
			path.join(dir, 'bad.docblock.ts'),
			`export const BadDocBlock = { id: "docs.bad", title: "Bad", body: "Bad" };`,
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: '@test/package',
				srcRoot: dir,
			})
		).toThrow(/Standalone DocBlock sources are not allowed/);
	});

	it('fails when docs/tech source files remain', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-docs-tech-'));
		const techDir = path.join(dir, 'docs', 'tech');
		fs.mkdirSync(techDir, { recursive: true });
		fs.writeFileSync(
			path.join(techDir, 'bad.ts'),
			`export const bad = "bad";`,
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: '@test/package',
				srcRoot: dir,
			})
		).toThrow(/docs\/tech source files are not allowed/);
	});

	it('fails when a doc ref points to a missing DocBlock', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-docs-ref-'));
		fs.writeFileSync(
			path.join(dir, 'feature.ts'),
			`
				import { docRef } from "@contractspec/lib.contracts-spec/docs";
				export const ExampleFeature = {
					meta: {
						docId: [docRef("docs.missing")]
					}
				};
			`,
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: '@test/package',
				srcRoot: dir,
			})
		).toThrow(/docblock-missing-ref/);
	});

	it('reports cross-file DocBlock references', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-docs-cross-'));
		fs.writeFileSync(
			path.join(dir, 'sample.command.ts'),
			`
				import { docRef } from "@contractspec/lib.contracts-spec/docs";
				export const SampleCommand = {
					meta: {
						docId: [docRef("docs.sample.shared")]
					}
				};
			`,
			'utf8'
		);
		fs.writeFileSync(
			path.join(dir, 'docs.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
				export const SharedDocBlock = {
					id: "docs.sample.shared",
					title: "Shared",
					kind: "reference",
					visibility: "public",
					route: "/docs/shared",
					body: "Shared"
				} satisfies DocBlock;
			`,
			'utf8'
		);

		const result = analyzePackageDocBlocks({
			packageName: '@test/package',
			srcRoot: dir,
		});

		expect(
			result.diagnostics.some(
				(diagnostic) => diagnostic.ruleId === 'docblock-cross-file-reference'
			)
		).toBeTrue();
	});

	it('reports orphan DocBlocks in docs-only helper modules', () => {
		const dir = fs.mkdtempSync(
			path.join(os.tmpdir(), 'workspace-docs-orphan-')
		);
		const docsDir = path.join(dir, 'docs');
		fs.mkdirSync(docsDir, { recursive: true });
		fs.writeFileSync(
			path.join(docsDir, 'overview.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
				export const OverviewDocBlock = {
					id: "docs.sample.overview",
					title: "Overview",
					kind: "reference",
					visibility: "public",
					route: "/docs/overview",
					body: "Overview"
				} satisfies DocBlock;
			`,
			'utf8'
		);

		const result = analyzePackageDocBlocks({
			packageName: '@test/package',
			srcRoot: dir,
		});

		expect(
			result.diagnostics.some(
				(diagnostic) => diagnostic.ruleId === 'docblock-orphan-owner'
			)
		).toBeTrue();
	});

	it('fails on duplicate routes', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-docs-route-'));
		fs.writeFileSync(
			path.join(dir, 'first.command.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
				export const FirstDocBlock = {
					id: "docs.first",
					title: "First",
					kind: "reference",
					visibility: "public",
					route: "/docs/shared",
					body: "First"
				} satisfies DocBlock;
			`,
			'utf8'
		);
		fs.writeFileSync(
			path.join(dir, 'second.query.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
				export const SecondDocBlock = {
					id: "docs.second",
					title: "Second",
					kind: "reference",
					visibility: "public",
					route: "/docs/shared",
					body: "Second"
				} satisfies DocBlock;
			`,
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: '@test/package',
				srcRoot: dir,
			})
		).toThrow(/Duplicate DocBlock route/);
	});
});
