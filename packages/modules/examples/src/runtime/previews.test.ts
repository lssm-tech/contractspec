import { describe, expect, test } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getExample } from '../registry';
import {
	getExamplePreviewHref,
	listInlineExamplePreviews,
	supportsInlineExamplePreview,
} from './previews';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../../../../..');
const examplesDir = path.join(repoRoot, 'packages', 'examples');

describe('example previews', () => {
	test('registers every example package exporting ./ui and exposes ui entrypoints', async () => {
		const previewKeys = new Set(
			listInlineExamplePreviews().map((preview) => preview.key)
		);
		const entries = await fs.readdir(examplesDir, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			const packageJsonPath = path.join(
				examplesDir,
				entry.name,
				'package.json'
			);
			const rawPackage = await fs.readFile(packageJsonPath, 'utf8');
			const pkg = JSON.parse(rawPackage) as {
				exports?: Record<string, unknown>;
				name?: string;
			};

			if (!pkg.name?.startsWith('@contractspec/example.')) {
				continue;
			}

			if (!pkg.exports?.['./ui']) {
				continue;
			}

			const example = getExample(entry.name);

			expect(example?.entrypoints.ui).toBe('./ui');
			expect(previewKeys.has(entry.name)).toBe(true);
			expect(supportsInlineExamplePreview(entry.name)).toBe(true);
		}
	});

	test('keeps sandbox fallback for examples without inline UI previews', () => {
		expect(supportsInlineExamplePreview('calendar-google')).toBe(false);
		expect(getExamplePreviewHref('calendar-google')).toBe(
			'/sandbox?template=calendar-google'
		);

		const nonSandboxExample = getExample('opencode-cli');
		expect(nonSandboxExample?.surfaces.sandbox.enabled).toBe(false);
		expect(getExamplePreviewHref('opencode-cli')).toBeNull();
	});
});
