import { describe, expect, it } from 'bun:test';
import { visualizationShowcaseMarkdownRenderer } from './visualization-showcase.markdown';

describe('visualization showcase markdown renderer', () => {
	it('renders the showcase summary', async () => {
		const output = await visualizationShowcaseMarkdownRenderer.render(
			{
				meta: {
					key: 'visualization-showcase.gallery',
					version: '1.0.0',
					title: 'Visualization Showcase',
					description: 'Focused visualization showcase.',
					goal: 'Summarize the visualization showcase.',
					context: 'Markdown rendering smoke test.',
					stability: 'experimental',
					owners: [],
					tags: [],
				},
				targets: ['markdown'],
				source: {
					type: 'component',
					framework: 'react',
					componentKey: 'VisualizationShowcase',
				},
			},
			undefined
		);

		expect(output.body).toContain('# Visualization Showcase');
		expect(output.body).toContain('## Primitive Coverage');
		expect(output.body).toContain('## Comparison View');
		expect(output.body).toContain('## Timeline View');
	});
});
