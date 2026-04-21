import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateDocs } from './generate';

const tempDirs: string[] = [];

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0)
			.map((directory) => rm(directory, { recursive: true, force: true }))
	);
});

describe('generateDocs', () => {
	test('emits stable manifest metadata across identical runs', async () => {
		const directory = await mkdtemp(join(tmpdir(), 'contractspec-docs-'));
		tempDirs.push(directory);
		const sourceDir = join(directory, 'source');
		const outDir = join(directory, 'out');
		await mkdir(sourceDir, { recursive: true });
		await writeFile(
			join(sourceDir, 'intro.md'),
			['# Intro', '', 'Stable docs content.', ''].join('\n'),
			'utf8'
		);

		await generateDocs({
			sourceDir,
			outDir,
			contentRoot: sourceDir,
			includeDocblocks: false,
			routePrefix: '/docs/reference',
		});
		const firstManifest = await readFile(
			join(outDir, 'docs-index.manifest.json'),
			'utf8'
		);

		await generateDocs({
			sourceDir,
			outDir,
			contentRoot: sourceDir,
			includeDocblocks: false,
			routePrefix: '/docs/reference',
		});
		const secondManifest = await readFile(
			join(outDir, 'docs-index.manifest.json'),
			'utf8'
		);

		expect(JSON.parse(firstManifest).generatedAt).toBe(
			'1970-01-01T00:00:00.000Z'
		);
		expect(secondManifest).toBe(firstManifest);
	});
});
