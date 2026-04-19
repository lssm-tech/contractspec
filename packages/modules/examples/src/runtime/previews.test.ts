import { describe, expect, test } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getExample } from '../registry';
import {
	buildExampleDocsHref,
	buildExampleReferenceHref,
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

			expect(example).toBeDefined();
			expect(previewKeys.has(entry.name)).toBe(true);
			expect(supportsInlineExamplePreview(entry.name)).toBe(true);
		}
	});

	test('keeps sandbox fallback for examples without inline UI previews', () => {
		expect(supportsInlineExamplePreview('calendar-google')).toBe(false);
		expect(getExamplePreviewHref('calendar-google')).toBe(
			'/sandbox?template=calendar-google'
		);
	});

	test('normalizes canonical example keys for preview and docs links', () => {
		expect(getExamplePreviewHref('examples.crm-pipeline')).toBe(
			'/sandbox?template=crm-pipeline'
		);
		expect(buildExampleDocsHref('examples.crm-pipeline')).toBe(
			'/docs/examples/crm-pipeline'
		);
		expect(buildExampleReferenceHref('examples.crm-pipeline')).toBe(
			'/docs/reference/crm-pipeline/crm-pipeline'
		);
	});
});
