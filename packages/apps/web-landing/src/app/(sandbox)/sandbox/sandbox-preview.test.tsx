import { describe, expect, test } from 'bun:test';
import {
	getExamplePreviewSurface,
	listDiscoverableExamples,
	supportsInlineExamplePreview,
} from '@contractspec/module.examples/catalog';
import { ExamplePreviewFallback } from '@contractspec/module.examples/runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { hasRichSandboxPreview } from './sandbox-preview';

describe('sandbox preview fallback', () => {
	test('derives rich browser preview support from core templates and examples', () => {
		expect(hasRichSandboxPreview('agent-console')).toBe(true);
		expect(hasRichSandboxPreview('calendar-google')).toBe(false);
		expect(hasRichSandboxPreview('todos-app')).toBe(true);
		expect(hasRichSandboxPreview('agent-console')).toBe(
			supportsInlineExamplePreview('agent-console')
		);
	});

	test('renders useful fallback content for templates without rich previews', () => {
		const surface = getExamplePreviewSurface('calendar-google');

		expect(surface).toBeDefined();

		const html = renderToStaticMarkup(
			<ExamplePreviewFallback surface={surface!} />
		);

		expect(html).toContain('@contractspec/example.calendar-google');
		expect(html).toContain('/docs/examples/calendar-google');
		expect(html).toContain('/llms/example.calendar-google');
		expect(html).toContain('/sandbox?template=calendar-google');
		expect(html).toContain('Source');
	});

	test('every discoverable example is sandbox addressable', () => {
		for (const example of listDiscoverableExamples()) {
			expect(getExamplePreviewSurface(example.meta.key)?.sandboxHref).toBe(
				`/sandbox?template=${encodeURIComponent(example.meta.key)}`
			);
		}
	});
});
