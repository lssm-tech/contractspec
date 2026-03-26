import { afterEach, describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
	buildPackageDocManifest,
	extractModuleDocData,
} from './manifest-builder';

const tmpDirs: string[] = [];

afterEach(() => {
	while (tmpDirs.length > 0) {
		const dir = tmpDirs.pop();
		if (dir) {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	}
});

describe('extractModuleDocData', () => {
	it('extracts same-file DocBlocks and doc refs without executing the module', () => {
		const source = `
			import type { DocBlock } from "./types";
			import { docRef } from "./registry";

			export const ExampleDocBlock = {
				id: "docs.example",
				title: "Example",
				body: "# Example",
				kind: "reference",
				visibility: "public",
				route: "/docs/example"
			} satisfies DocBlock;

			export const ExampleSpec = {
				meta: {
					docId: [docRef(ExampleDocBlock.id)]
				}
			};

			throw new Error("should not execute");
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
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docblock-standalone-'));
		tmpDirs.push(dir);
		fs.writeFileSync(
			path.join(dir, 'bad.docblock.ts'),
			'export const ignored = [];',
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: 'pkg',
				srcRoot: dir,
			})
		).toThrow(/Standalone DocBlock sources are not allowed/);
	});

	it('fails when a doc ref points to a missing DocBlock', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docblock-missing-ref-'));
		tmpDirs.push(dir);
		fs.writeFileSync(
			path.join(dir, 'spec.ts'),
			`
				import { docRef } from "./registry";
				export const ExampleSpec = {
					meta: {
						docId: [docRef("docs.missing")]
					}
				};
			`,
			'utf8'
		);

		expect(() =>
			buildPackageDocManifest({
				packageName: 'pkg',
				srcRoot: dir,
			})
		).toThrow(/Missing DocBlock reference docs.missing/);
	});
});
