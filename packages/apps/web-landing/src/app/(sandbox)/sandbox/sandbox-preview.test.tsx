import { describe, expect, test } from 'bun:test';
import { getDiscoverableExample } from '@contractspec/module.examples/catalog';
import { getTemplate } from '@contractspec/module.examples/runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	hasRichSandboxPreview,
	SandboxFallbackPreview,
} from './sandbox-preview';

describe('sandbox preview fallback', () => {
	test('identifies templates with rich browser previews', () => {
		expect(hasRichSandboxPreview('agent-console')).toBe(true);
		expect(hasRichSandboxPreview('calendar-google')).toBe(false);
	});

	test('renders useful fallback content for templates without rich previews', () => {
		const example = getDiscoverableExample('calendar-google');
		const template = getTemplate('calendar-google');

		expect(example).toBeDefined();
		expect(template).toBeDefined();

		const html = renderToStaticMarkup(
			<SandboxFallbackPreview
				templateId="calendar-google"
				example={example}
				template={template}
			/>
		);

		expect(html).toContain('Calendar');
		expect(html).toContain('@contractspec/example.calendar-google');
		expect(html).toContain('/docs/examples/calendar-google');
		expect(html).toContain('/llms/example.calendar-google');
		expect(html).toContain('Source');
	});
});
