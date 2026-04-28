import { describe, expect, test } from 'bun:test';
import {
	listDiscoverableExamples,
	listInlineExamplePreviewMetadata,
} from '@contractspec/module.examples/catalog';
import {
	getNativeExamplePreview,
	listNativeExamplePreviews,
	supportsNativeExamplePreview,
} from './native-preview-registry';

describe('native preview registry', () => {
	test('registers every discoverable example for in-app preview', () => {
		const discoverableKeys = listDiscoverableExamples()
			.map((example) => example.meta.key)
			.sort();
		const previewKeys = listNativeExamplePreviews()
			.map((preview) => preview.key)
			.sort();

		expect(previewKeys).toEqual(discoverableKeys);
		expect(previewKeys.length).toBeGreaterThan(50);
	});

	test('registers known rich native previews', () => {
		expect(getNativeExamplePreview('ai-chat-assistant')?.kind).toBe(
			'ai-chat-assistant'
		);
		expect(getNativeExamplePreview('analytics-dashboard')?.kind).toBe(
			'analytics-dashboard'
		);
		expect(getNativeExamplePreview('crm-pipeline')?.kind).toBe('crm-pipeline');
		expect(getNativeExamplePreview('data-grid-showcase')?.kind).toBe(
			'data-grid-showcase'
		);
		expect(getNativeExamplePreview('finance-ops-ai-workflows')?.kind).toBe(
			'finance-ops-ai-workflows'
		);
		expect(getNativeExamplePreview('form-showcase')?.kind).toBe(
			'form-showcase'
		);
		expect(getNativeExamplePreview('agent-console')?.kind).toBe(
			'agent-console'
		);
		expect(getNativeExamplePreview('voice-providers')?.kind).toBe(
			'connections'
		);
		expect(
			getNativeExamplePreview('learning-journey-platform-tour')?.kind
		).toBe('learning-journey');
		expect(getNativeExamplePreview('saas-boilerplate')?.kind).toBe(
			'saas-boilerplate'
		);
		expect(getNativeExamplePreview('workflow-system')?.kind).toBe(
			'workflow-system'
		);
		expect(getNativeExamplePreview('wealth-snapshot')?.kind).toBe(
			'wealth-snapshot'
		);
	});

	test('keeps every web inline preview rich on mobile', () => {
		const missingRichMobilePreviews = listInlineExamplePreviewMetadata()
			.map((preview) => preview.key)
			.filter((key) => !getNativeExamplePreview(key)?.rich);

		expect(missingRichMobilePreviews).toEqual([]);
	});

	test('falls back to generic native previews for unsupported rich surfaces', () => {
		expect(supportsNativeExamplePreview('opencode-cli')).toBe(true);
		expect(getNativeExamplePreview('opencode-cli')?.kind).toBe('generic');
		expect(getNativeExamplePreview('minimal')?.kind).toBe('generic');
	});

	test('keeps preview routes in-app only', () => {
		for (const preview of listNativeExamplePreviews()) {
			expect(preview.route.startsWith('/example-preview?exampleKey=')).toBe(
				true
			);
			expect(preview.route).not.toContain('/sandbox');
			expect(preview.route).not.toContain('http');
		}
	});
});
