import { describe, expect, test } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getExample } from '../registry';
import {
	buildExampleDocsHref,
	buildExampleReferenceHref,
	getDiscoverableExample,
	getExamplePreviewHref,
	getExamplePreviewSurface,
	isDiscoverableExample,
	listDiscoverableExamples,
	listExamplePreviewSurfaces,
	listInlineExamplePreviews,
	listPublicExamples,
	listTemplateExamples,
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

	test('exposes finance templates as inline previews', () => {
		expect(supportsInlineExamplePreview('finance-ops-ai-workflows')).toBe(true);
		expect(supportsInlineExamplePreview('wealth-snapshot')).toBe(true);
		expect(supportsInlineExamplePreview('pocket-family-office')).toBe(true);
		expect(
			listInlineExamplePreviews().map((preview) => [
				preview.key,
				preview.exportName,
			])
		).toContainEqual([
			'finance-ops-ai-workflows',
			'FinanceOpsAiWorkflowsPreview',
		]);
		expect(
			listInlineExamplePreviews().map((preview) => [
				preview.key,
				preview.exportName,
			])
		).toContainEqual(['wealth-snapshot', 'WealthSnapshotPreview']);
		expect(
			listInlineExamplePreviews().map((preview) => [
				preview.key,
				preview.exportName,
			])
		).toContainEqual(['pocket-family-office', 'PocketFamilyOfficePreview']);
	});

	test('builds preview surface data for every discoverable example', () => {
		const surfaces = listExamplePreviewSurfaces();
		const surfaceKeys = surfaces.map((surface) => surface.key).sort();
		const discoverableKeys = listDiscoverableExamples()
			.map((example) => example.meta.key)
			.sort();

		expect(surfaceKeys).toEqual(discoverableKeys);

		for (const example of listDiscoverableExamples()) {
			const surface = getExamplePreviewSurface(example.meta.key);

			expect(surface).toBeDefined();
			expect(surface?.sandboxHref).toBe(
				`/sandbox?template=${encodeURIComponent(example.meta.key)}`
			);
			expect(surface?.docsHref).toBe(buildExampleDocsHref(example.meta.key));
			expect(surface?.llmsHref).toContain(
				example.entrypoints.packageName.replace('@contractspec/', '')
			);
		}
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

	test('exposes surfaced experimental examples without changing public-only helpers', () => {
		const crmPipeline = getDiscoverableExample('crm-pipeline');
		const templateKeys = new Set(
			listTemplateExamples().map((example) => example.meta.key)
		);

		expect(crmPipeline?.meta.visibility).toBe('experimental');
		expect(templateKeys.has('crm-pipeline')).toBe(true);
		expect(templateKeys.has('integration-stripe')).toBe(true);
		expect(listDiscoverableExamples().length).toBeGreaterThan(
			listPublicExamples().length
		);
	});

	test('keeps internal examples out of public web discovery', () => {
		const example = getExample('crm-pipeline');

		expect(example).toBeDefined();
		expect(
			isDiscoverableExample({
				...example!,
				meta: {
					...example!.meta,
					visibility: 'internal',
				},
			})
		).toBe(false);
	});
});
