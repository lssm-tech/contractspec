import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExampleInlinePreviewSection } from './ExampleInlinePreviewSection';

describe('ExampleInlinePreviewSection', () => {
	test('renders shared fallback preview content for non-ui examples', () => {
		const html = renderToStaticMarkup(
			<ExampleInlinePreviewSection exampleKey="opencode-cli" />
		);

		expect(html).toContain('Opencode Cli');
		expect(html).toContain('@contractspec/example.opencode-cli');
		expect(html).toContain('/docs/examples/opencode-cli');
		expect(html).toContain('/sandbox?template=opencode-cli');
	});
});
