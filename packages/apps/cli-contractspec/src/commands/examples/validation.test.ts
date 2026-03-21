import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'bun:test';
import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import { validateWorkspaceExamplesFolder } from './validation';

function createExampleSpec(packageName: string): ExampleSpec {
	return {
		meta: {
			key: 'sample',
			stability: 'experimental',
		},
		entrypoints: {
			packageName,
			example: './example',
			docs: './docs',
		},
	} as unknown as ExampleSpec;
}

function writeBaseExamplePackage(exampleDir: string, packageName: string): void {
	fs.mkdirSync(path.join(exampleDir, 'src', 'docs'), { recursive: true });
	fs.writeFileSync(
		path.join(exampleDir, 'package.json'),
		JSON.stringify(
			{
				name: packageName,
				exports: {
					'./example': './src/example.ts',
					'./docs': './src/docs/index.ts',
				},
				scripts: {
					build: 'echo build',
					typecheck: 'echo typecheck',
					test: 'echo test',
				},
			},
			null,
			2
		),
		'utf8'
	);
	fs.writeFileSync(path.join(exampleDir, 'src', 'example.ts'), 'export default {};', 'utf8');
	fs.writeFileSync(path.join(exampleDir, 'src', 'docs', 'index.ts'), 'export {};', 'utf8');
	fs.writeFileSync(path.join(exampleDir, 'README.md'), '# Example\n', 'utf8');
}

describe('validateWorkspaceExamplesFolder', () => {
	it('accepts same-file authored DocBlocks', async () => {
		const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-example-valid-'));
		const exampleDir = path.join(repoRoot, 'packages', 'examples', 'sample');
		const packageName = '@contractspec/example.sample';

		writeBaseExamplePackage(exampleDir, packageName);
		fs.writeFileSync(
			path.join(exampleDir, 'src', 'sample.feature.ts'),
			`
				import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";

				export const SampleDocBlock = {
					id: "docs.examples.sample",
					title: "Sample",
					summary: "Sample docs",
					kind: "reference",
					visibility: "public",
					route: "/docs/examples/sample",
					body: "Body"
				} satisfies DocBlock;
			`,
			'utf8'
		);

		const results = await validateWorkspaceExamplesFolder(repoRoot, [
			createExampleSpec(packageName),
		]);
		const sampleResult = results.find((entry) => entry.packageName === packageName);

		expect(sampleResult?.errors).toEqual([]);
	});

	it('rejects standalone authored DocBlock files', async () => {
		const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-example-invalid-'));
		const exampleDir = path.join(repoRoot, 'packages', 'examples', 'sample');
		const packageName = '@contractspec/example.sample';

		writeBaseExamplePackage(exampleDir, packageName);
		fs.writeFileSync(
			path.join(exampleDir, 'src', 'docs', 'sample.docblock.ts'),
			'export const SampleDocBlock = { id: "docs.examples.sample", title: "Sample", body: "Body" };',
			'utf8'
		);

		const results = await validateWorkspaceExamplesFolder(repoRoot, [
			createExampleSpec(packageName),
		]);
		const sampleResult = results.find((entry) => entry.packageName === packageName);

		expect(sampleResult?.errors.some((error) => error.includes('Standalone DocBlock sources are not allowed'))).toBeTrue();
	});
});
