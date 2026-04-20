import { afterEach, describe, expect, test } from 'bun:test';
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runTranspile, runTypes } from '../lib/build.mjs';
import { normalizeBuildConfig, selectEntriesForTarget } from '../lib/config.mjs';

const tempDirs: string[] = [];

async function createTempDir() {
	const tempDir = await mkdtemp(
		path.join(os.tmpdir(), 'contractspec-bun-build-')
	);
	tempDirs.push(tempDir);
	return tempDir;
}

async function exists(filePath: string) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0, tempDirs.length)
			.map((tempDir) => rm(tempDir, { recursive: true, force: true }))
	);
});

describe('selectEntriesForTarget', () => {
	const entries = [
		'src/index.ts',
		'src/foo.web.ts',
		'src/foo.native.ts',
		'src/foo.node.ts',
		'src/foo.bun.ts',
		'src/foo.browser.ts',
	];

	test('excludes native files from bun builds', () => {
		expect(selectEntriesForTarget(entries, 'bun')).toEqual([
			'src/index.ts',
			'src/foo.web.ts',
			'src/foo.node.ts',
			'src/foo.bun.ts',
			'src/foo.browser.ts',
		]);
	});

	test('excludes browser and native variants from node builds', () => {
		expect(selectEntriesForTarget(entries, 'node')).toEqual([
			'src/index.ts',
			'src/foo.node.ts',
			'src/foo.bun.ts',
		]);
	});

	test('excludes node, bun, and native variants from browser builds', () => {
		expect(selectEntriesForTarget(entries, 'browser')).toEqual([
			'src/index.ts',
			'src/foo.web.ts',
			'src/foo.browser.ts',
		]);
	});

	test('includes only native files for native builds', () => {
		expect(selectEntriesForTarget(entries, 'native')).toEqual([
			'src/foo.native.ts',
		]);
	});
});

describe('normalizeBuildConfig', () => {
	test('allows packages to opt out of generated export-map rewrites', async () => {
		const cwd = await createTempDir();
		await mkdir(path.join(cwd, 'src'), { recursive: true });
		await writeFile(path.join(cwd, 'src', 'index.ts'), 'export const x = 1;\n');

		const config = await normalizeBuildConfig(cwd, {
			exports: {
				all: false,
			},
		});

		expect(config.rewriteExports).toBe(false);
	});
});

describe('runTranspile', () => {
	test('emits native files only under dist/native', async () => {
		const cwd = await createTempDir();
		const srcDir = path.join(cwd, 'src');
		await mkdir(srcDir, { recursive: true });
		await writeFile(path.join(srcDir, 'index.ts'), 'export const base = 1;\n');
		await writeFile(
			path.join(srcDir, 'view.web.ts'),
			'export const web = 1;\n'
		);
		await writeFile(
			path.join(srcDir, 'view.native.ts'),
			'export const native = 1;\n'
		);

		const entries = ['src/index.ts', 'src/view.web.ts', 'src/view.native.ts'];
		await runTranspile({
			cwd,
			entries,
			external: [],
			targets: {
				node: true,
				browser: true,
			},
			targetRoots: {
				bun: 'src',
				node: 'src',
				browser: 'src',
				native: 'src',
			},
			noBundle: true,
		});

		expect(await exists(path.join(cwd, 'dist', 'index.js'))).toBe(true);
		expect(await exists(path.join(cwd, 'dist', 'view.web.js'))).toBe(true);
		expect(await exists(path.join(cwd, 'dist', 'view.native.js'))).toBe(false);
		expect(await exists(path.join(cwd, 'dist', 'browser', 'view.web.js'))).toBe(
			true
		);
		expect(
			await exists(path.join(cwd, 'dist', 'browser', 'view.native.js'))
		).toBe(false);
		expect(await exists(path.join(cwd, 'dist', 'node', 'view.web.js'))).toBe(
			false
		);
		expect(
			await exists(path.join(cwd, 'dist', 'native', 'view.native.js'))
		).toBe(true);
	});
});

describe('runTypes', () => {
	test('builds missing workspace dependency declarations before emitting consumer types', async () => {
		const workspaceRoot = await createTempDir();
		await writeFile(
			path.join(workspaceRoot, 'package.json'),
			JSON.stringify(
				{
					private: true,
					workspaces: ['packages/*/*'],
				},
				null,
				2
			) + '\n'
		);

		const dependencyDir = path.join(
			workspaceRoot,
			'packages',
			'libs',
			'execution-lanes'
		);
		await mkdir(path.join(dependencyDir, 'src', 'interop'), {
			recursive: true,
		});
		await mkdir(path.join(dependencyDir, 'dist', 'interop'), {
			recursive: true,
		});
		await writeFile(
			path.join(dependencyDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/lib.execution-lanes',
					version: '0.0.0-test',
					type: 'module',
					types: './dist/index.d.ts',
					scripts: {
						'build:types':
							"node -e \"const fs=require('node:fs'); fs.mkdirSync('dist/interop',{recursive:true}); fs.writeFileSync('dist/index.d.ts','export interface LaneSnapshot { id: string; }\\n'); fs.writeFileSync('dist/interop/index.d.ts','export declare const EXECUTION_LANE_COMMANDS: readonly [\\\"/plan\\\"];\\n');\"",
					},
					exports: {
						'.': './src/index.ts',
						'./interop': './src/interop/index.ts',
					},
					publishConfig: {
						exports: {
							'.': {
								types: './dist/index.d.ts',
								bun: './dist/index.js',
								default: './dist/index.js',
							},
							'./interop': {
								types: './dist/interop/index.d.ts',
								bun: './dist/interop/index.js',
								default: './dist/interop/index.js',
							},
						},
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'index.ts'),
			'export interface LaneSnapshot { id: string; }\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'interop', 'index.ts'),
			'export const EXECUTION_LANE_COMMANDS = ["/plan"] as const;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'index.js'),
			'export {};\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'interop', 'index.js'),
			'export {};\n'
		);

		const consumerDir = path.join(
			workspaceRoot,
			'packages',
			'modules',
			'execution-console'
		);
		await mkdir(path.join(consumerDir, 'src'), { recursive: true });
		await writeFile(
			path.join(consumerDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/module.execution-console',
					version: '0.0.0-test',
					type: 'module',
					dependencies: {
						'@contractspec/lib.execution-lanes': 'workspace:*',
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'tsconfig.json'),
			JSON.stringify(
				{
					compilerOptions: {
						target: 'ES2022',
						module: 'ESNext',
						moduleResolution: 'Bundler',
						strict: true,
						rootDir: 'src',
						outDir: 'dist',
						declaration: true,
					},
					include: ['src'],
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'src', 'index.ts'),
			[
				"import type { LaneSnapshot } from '@contractspec/lib.execution-lanes';",
				"import { EXECUTION_LANE_COMMANDS } from '@contractspec/lib.execution-lanes/interop';",
				'',
				'export function summarizeLane(snapshot: LaneSnapshot) {',
				'\treturn `${EXECUTION_LANE_COMMANDS[0]}:${snapshot.id}`;',
				'}',
				'',
			].join('\n')
		);

		await runTypes({ cwd: consumerDir, typesRoot: 'src' });

		const generatedTypes = await readFile(
			path.join(consumerDir, 'dist', 'index.d.ts'),
			'utf8'
		);
		const generatedDependencyTypes = await readFile(
			path.join(dependencyDir, 'dist', 'index.d.ts'),
			'utf8'
		);

		expect(generatedTypes).toContain('LaneSnapshot');
		expect(generatedTypes).toContain('summarizeLane');
		expect(generatedDependencyTypes).toContain('LaneSnapshot');
	});

	test('falls back to workspace source exports when published declarations cannot be refreshed', async () => {
		const workspaceRoot = await createTempDir();
		await writeFile(
			path.join(workspaceRoot, 'package.json'),
			JSON.stringify(
				{
					private: true,
					workspaces: ['packages/*/*'],
				},
				null,
				2
			) + '\n'
		);

		const dependencyDir = path.join(
			workspaceRoot,
			'packages',
			'libs',
			'contracts-spec'
		);
		await mkdir(path.join(dependencyDir, 'src', 'docs'), {
			recursive: true,
		});
		await mkdir(path.join(dependencyDir, 'dist', 'docs'), {
			recursive: true,
		});
		await writeFile(
			path.join(dependencyDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/lib.contracts-spec',
					version: '0.0.0-test',
					type: 'module',
					types: './dist/index.d.ts',
					exports: {
						'.': './src/index.ts',
						'./docs': './src/docs/index.ts',
					},
					publishConfig: {
						exports: {
							'.': {
								types: './dist/index.d.ts',
								bun: './dist/index.js',
								default: './dist/index.js',
							},
							'./docs': {
								types: './dist/docs/index.d.ts',
								bun: './dist/docs/index.js',
								default: './dist/docs/index.js',
							},
						},
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'index.ts'),
			'export const defineFeature = <T>(spec: T) => spec;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'docs', 'index.ts'),
			'export const registerDocBlocks = <T>(blocks: T) => blocks;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'index.d.ts'),
			'export declare const staleOnly: true;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'docs', 'index.d.ts'),
			'export declare const staleOnly: true;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'index.js'),
			'export {};\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'docs', 'index.js'),
			'export {};\n'
		);

		const consumerDir = path.join(
			workspaceRoot,
			'packages',
			'examples',
			'quest-example'
		);
		await mkdir(path.join(consumerDir, 'src'), { recursive: true });
		await writeFile(
			path.join(consumerDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/example.quest',
					version: '0.0.0-test',
					type: 'module',
					dependencies: {
						'@contractspec/lib.contracts-spec': 'workspace:*',
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'tsconfig.json'),
			JSON.stringify(
				{
					compilerOptions: {
						target: 'ES2022',
						module: 'ESNext',
						moduleResolution: 'Bundler',
						strict: true,
						outDir: 'dist',
						declaration: true,
					},
					include: ['src'],
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'src', 'index.ts'),
			[
				"import { defineFeature } from '@contractspec/lib.contracts-spec';",
				"import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';",
				'',
				'export const feature = defineFeature({ key: "demo" });',
				'export const docs = registerDocBlocks([{ id: "demo" }]);',
				'',
			].join('\n')
		);

		await runTypes({ cwd: consumerDir });

		const generatedTypes = await readFile(
			path.join(
				consumerDir,
				'dist',
				'examples',
				'quest-example',
				'src',
				'index.d.ts'
			),
			'utf8'
		);
		expect(generatedTypes).toContain('feature');
		expect(generatedTypes).toContain('docs');
	});

	test('refreshes stale published declarations before resolving workspace dependency types', async () => {
		const workspaceRoot = await createTempDir();
		await writeFile(
			path.join(workspaceRoot, 'package.json'),
			JSON.stringify(
				{
					private: true,
					workspaces: ['packages/*/*'],
				},
				null,
				2
			) + '\n'
		);

		const dependencyDir = path.join(
			workspaceRoot,
			'packages',
			'libs',
			'provider-ranking'
		);
		await mkdir(path.join(dependencyDir, 'src', 'nested'), {
			recursive: true,
		});
		await mkdir(path.join(dependencyDir, 'dist', 'nested'), {
			recursive: true,
		});
		await writeFile(
			path.join(dependencyDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/lib.provider-ranking',
					version: '0.0.0-test',
					type: 'module',
					types: './dist/index.d.ts',
					scripts: {
						'build:types':
							"node -e \"const fs=require('node:fs'); fs.mkdirSync('dist/nested',{recursive:true}); fs.writeFileSync('dist/index.d.ts','export type { ProviderRankingStore } from \\\"./nested/store\\\";\\n'); fs.writeFileSync('dist/nested/store.d.ts','export interface ProviderRankingStore { list(): Promise<string[]>; }\\n');\"",
					},
					exports: {
						'.': './src/index.ts',
						'./nested/store': './src/nested/store.ts',
					},
					publishConfig: {
						exports: {
							'.': {
								types: './dist/index.d.ts',
								bun: './dist/index.js',
								default: './dist/index.js',
							},
							'./nested/store': {
								types: './dist/nested/store.d.ts',
								bun: './dist/nested/store.js',
								default: './dist/nested/store.js',
							},
						},
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'index.d.ts'),
			'export declare const staleOnly: true;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'nested', 'store.d.ts'),
			'export declare const staleOnly: true;\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'index.js'),
			'export {};\n'
		);
		await writeFile(
			path.join(dependencyDir, 'dist', 'nested', 'store.js'),
			'export {};\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'nested', 'store.ts'),
			'export interface ProviderRankingStore { list(): Promise<string[]>; }\n'
		);
		await writeFile(
			path.join(dependencyDir, 'src', 'index.ts'),
			"export type { ProviderRankingStore } from './nested/store';\n"
		);

		const consumerDir = path.join(
			workspaceRoot,
			'packages',
			'libs',
			'ai-providers'
		);
		await mkdir(path.join(consumerDir, 'src'), { recursive: true });
		await writeFile(
			path.join(consumerDir, 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/lib.ai-providers',
					version: '0.0.0-test',
					type: 'module',
					dependencies: {
						'@contractspec/lib.provider-ranking': 'workspace:*',
					},
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'tsconfig.json'),
			JSON.stringify(
				{
					compilerOptions: {
						target: 'ES2022',
						module: 'ESNext',
						moduleResolution: 'Bundler',
						strict: true,
						rootDir: 'src',
						outDir: 'dist',
						declaration: true,
					},
					include: ['src'],
				},
				null,
				2
			) + '\n'
		);
		await writeFile(
			path.join(consumerDir, 'src', 'index.ts'),
			[
				"import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking';",
				'',
				'export interface SelectorOptions {',
				'\tstore: ProviderRankingStore;',
				'}',
				'',
			].join('\n')
		);

		await runTypes({ cwd: consumerDir, typesRoot: 'src' });

		const generatedTypes = await readFile(
			path.join(consumerDir, 'dist', 'index.d.ts'),
			'utf8'
		);
		const refreshedDependencyTypes = await readFile(
			path.join(dependencyDir, 'dist', 'index.d.ts'),
			'utf8'
		);

		expect(generatedTypes).toContain('SelectorOptions');
		expect(refreshedDependencyTypes).toContain('ProviderRankingStore');
		expect(refreshedDependencyTypes).not.toContain('staleOnly');
	});
});
