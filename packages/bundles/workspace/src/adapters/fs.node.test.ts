import { afterEach, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from './fs.node';

describe('FS Adapter', () => {
	let tempDir: string | null = null;

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('exists should return true if the file exists', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		writeFileSync(join(tempDir, 'file.txt'), 'content', 'utf8');
		const fs = createNodeFsAdapter(tempDir);

		expect(await fs.exists('file.txt')).toBe(true);
	});

	it('exists should return false if the file is missing', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		const fs = createNodeFsAdapter(tempDir);

		expect(await fs.exists('file.txt')).toBe(false);
	});

	it('readFile should read content', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		writeFileSync(join(tempDir, 'file.txt'), 'content', 'utf8');
		const fs = createNodeFsAdapter(tempDir);

		const content = await fs.readFile('file.txt');
		expect(content).toBe('content');
	});

	it('writeFile should create parent directories and write content', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		const fs = createNodeFsAdapter(tempDir);

		await fs.writeFile('nested/file.txt', 'data');

		expect(await fs.readFile('nested/file.txt')).toBe('data');
	});

	it('remove should delete files', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		writeFileSync(join(tempDir, 'file.txt'), 'content', 'utf8');
		const fs = createNodeFsAdapter(tempDir);

		await fs.remove('file.txt');

		expect(await fs.exists('file.txt')).toBe(false);
	});

	it('stat should return file stats', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		writeFileSync(join(tempDir, 'file.txt'), 'content', 'utf8');
		const fs = createNodeFsAdapter(tempDir);

		const stats = await fs.stat('file.txt');
		expect(stats.size).toBe(7);
		expect(stats.isFile).toBe(true);
	});

	it('mkdir should create a directory', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		const fs = createNodeFsAdapter(tempDir);

		await fs.mkdir('dir');

		expect(await fs.exists('dir')).toBe(true);
	});

	it('glob should find matching files under the adapter cwd', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-fs-adapter-'));
		mkdirSync(join(tempDir, 'src'), { recursive: true });
		writeFileSync(join(tempDir, 'src', 'a.ts'), 'export {};\n', 'utf8');
		writeFileSync(join(tempDir, 'src', 'b.ts'), 'export {};\n', 'utf8');
		const fs = createNodeFsAdapter(tempDir);

		const files = await fs.glob({ pattern: 'src/*.ts' });

		expect(files).toEqual([
			join(tempDir, 'src', 'a.ts'),
			join(tempDir, 'src', 'b.ts'),
		]);
	});

	it('path utils should work', () => {
		const fs = createNodeFsAdapter('/cwd');

		expect(fs.resolve('file')).toBeDefined();
		expect(fs.dirname('/a/b')).toBe('/a');
		expect(fs.basename('/a/b')).toBe('b');
		expect(fs.join('a', 'b')).toBe('a/b');
		expect(fs.relative('/a', '/a/b')).toBe('b');
	});
});
