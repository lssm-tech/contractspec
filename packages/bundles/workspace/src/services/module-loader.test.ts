import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { __moduleLoaderInternals, loadAuthoredModule } from './module-loader';

const tempDirs: string[] = [];

describe('loadAuthoredModule', () => {
	it('loads authored modules through the Bun/native path', async () => {
		const filePath = await writeTempFile(
			'fixture.ts',
			'export const value = { ok: true };\n'
		);

		const loaded = await loadAuthoredModule(filePath, { runtime: 'bun' });
		expect(loaded.modulePath).toContain('fixture.ts');
		expect(loaded.exports.value).toEqual({ ok: true });
	});

	it('loads authored modules through the Node-compatible fallback path', async () => {
		const filePath = await writeTempFile(
			'fallback.ts',
			'export const value = { ok: true, path: "node-fallback" };\n'
		);

		const loaded = await loadAuthoredModule(filePath, { runtime: 'node' });
		expect(loaded.exports.value).toEqual({ ok: true, path: 'node-fallback' });
	});

	it('formats high-signal error messages', () => {
		const message = __moduleLoaderInternals.formatModuleLoadError(
			'/tmp/missing.ts',
			new Error('boom')
		);
		expect(message).toContain('/tmp/missing.ts');
		expect(message).toContain('boom');
	});
});

afterEach(async () => {
	while (tempDirs.length > 0) {
		const dir = tempDirs.pop();
		if (dir) {
			await rm(dir, { recursive: true, force: true });
		}
	}
});

async function writeTempFile(fileName: string, content: string) {
	const dir = await mkdtemp(join(tmpdir(), 'contractspec-module-loader-'));
	tempDirs.push(dir);
	const filePath = join(dir, fileName);
	await writeFile(filePath, content);
	return filePath;
}
