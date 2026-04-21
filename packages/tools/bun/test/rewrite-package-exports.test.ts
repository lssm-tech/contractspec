import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rewritePackageExports } from '../lib/exports.mjs';

const TARGETS = {
	node: true,
	browser: true,
};

const TARGET_ROOTS = {
	bun: 'src',
	node: 'src',
	browser: 'src',
	native: 'src',
	types: 'src',
};

const tempDirs: string[] = [];

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0)
			.map((directory) => rm(directory, { recursive: true, force: true }))
	);
});

describe('rewritePackageExports', () => {
	test('writes package exports with tab indentation and preserved publish config', async () => {
		const directory = await mkdtemp(
			join(tmpdir(), 'contractspec-bun-exports-')
		);
		tempDirs.push(directory);
		const packageJsonPath = join(directory, 'package.json');
		await writeFile(
			packageJsonPath,
			JSON.stringify(
				{
					name: '@contractspec/test.exports',
					publishConfig: {
						registry: 'https://registry.npmjs.org/',
						access: 'public',
					},
				},
				null,
				2
			) + '\n'
		);

		await rewritePackageExports(
			packageJsonPath,
			['src/index.ts'],
			TARGETS,
			TARGET_ROOTS
		);

		const packageJsonContent = await readFile(packageJsonPath, 'utf8');
		const packageJson = JSON.parse(packageJsonContent);

		expect(packageJsonContent).toContain('\n\t"exports": {');
		expect(packageJson.exports['.']).toBe('./src/index.ts');
		expect(packageJson.publishConfig.registry).toBe(
			'https://registry.npmjs.org/'
		);
		expect(packageJson.publishConfig.access).toBe('public');
		expect(packageJson.publishConfig.exports['.']).toEqual({
			types: './dist/index.d.ts',
			browser: './dist/browser/index.js',
			bun: './dist/index.js',
			node: './dist/node/index.js',
			default: './dist/index.js',
		});
	});

	test('writes style exports while preserving publish config fields', async () => {
		const directory = await mkdtemp(
			join(tmpdir(), 'contractspec-bun-style-exports-')
		);
		tempDirs.push(directory);
		const packageJsonPath = join(directory, 'package.json');
		await writeFile(
			packageJsonPath,
			JSON.stringify(
				{
					name: '@contractspec/test.style-exports',
					publishConfig: {
						registry: 'https://registry.npmjs.org/',
						access: 'public',
					},
				},
				null,
				2
			) + '\n'
		);

		await rewritePackageExports(
			packageJsonPath,
			['src/index.ts'],
			TARGETS,
			TARGET_ROOTS,
			['styles/globals.css']
		);

		const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

		expect(packageJson.exports['./styles/globals.css']).toEqual({
			style: './styles/globals.css',
			default: './styles/globals.css',
		});
		expect(packageJson.publishConfig.exports['./styles/globals.css']).toEqual({
			style: './dist/styles/globals.css',
			default: './dist/styles/globals.css',
		});
		expect(packageJson.publishConfig.registry).toBe(
			'https://registry.npmjs.org/'
		);
		expect(packageJson.publishConfig.access).toBe('public');
	});
});
