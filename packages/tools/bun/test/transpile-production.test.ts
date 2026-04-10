import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
	buildTranspileArgs,
	buildTranspileNoBundleArgs,
	runTranspile,
} from '../lib/build.mjs';

const tempDirs: string[] = [];

async function createTempDir() {
	const tempDir = await mkdtemp(
		path.join(os.tmpdir(), 'contractspec-bun-build-')
	);
	tempDirs.push(tempDir);
	return tempDir;
}

async function buildTsxFixture(noBundle: boolean) {
	const cwd = await createTempDir();
	await mkdir(path.join(cwd, 'src'), { recursive: true });
	await writeFile(
		path.join(cwd, 'src', 'index.tsx'),
		'export const View = () => <div>Hello</div>;\n'
	);

	await runTranspile({
		cwd,
		entries: ['src/index.tsx'],
		external: [],
		targets: {
			node: false,
			browser: true,
		},
		targetRoots: {
			bun: 'src',
			node: 'src',
			browser: 'src',
			native: 'src',
		},
		noBundle,
	});

	return {
		bunOutput: await readFile(path.join(cwd, 'dist', 'index.js'), 'utf8'),
		browserOutput: await readFile(
			path.join(cwd, 'dist', 'browser', 'index.js'),
			'utf8'
		),
	};
}

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0, tempDirs.length)
			.map((tempDir) => rm(tempDir, { recursive: true, force: true }))
	);
});

describe('runTranspile production JSX runtime', () => {
	test.each([
		true,
		false,
	])('passes --production and emits the production JSX runtime when noBundle=%p', async (noBundle) => {
		const args = noBundle
			? [
					buildTranspileNoBundleArgs({
						entry: 'src/index.tsx',
						root: 'src',
						target: 'bun',
						outfile: 'dist/index.js',
						external: [],
					}),
					buildTranspileNoBundleArgs({
						entry: 'src/index.tsx',
						root: 'src',
						target: 'browser',
						outfile: 'dist/browser/index.js',
						external: [],
					}),
				]
			: [
					buildTranspileArgs({
						selectedEntries: ['src/index.tsx'],
						root: 'src',
						target: 'bun',
						outdir: 'dist',
						external: [],
						noBundle: false,
					}),
					buildTranspileArgs({
						selectedEntries: ['src/index.tsx'],
						root: 'src',
						target: 'browser',
						outdir: 'dist/browser',
						external: [],
						noBundle: false,
					}),
				];
		const { bunOutput, browserOutput } = await buildTsxFixture(noBundle);

		for (const commandArgs of args) {
			expect(commandArgs).toContain('--production');
		}

		for (const output of [bunOutput, browserOutput]) {
			expect(output).toMatch(/react\/jsx-runtime|\bjsx\b/);
			expect(output).not.toContain('react/jsx-dev-runtime');
			expect(output).not.toContain('jsxDEV');
		}
	});
});
