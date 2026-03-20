import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

export const visualizationShowcaseDocs: DocBlock[] = [
	{
		id: 'docs.examples.visualization-showcase',
		title: 'Visualization Showcase',
		summary:
			'Overview of the dedicated ContractSpec visualization example package.',
		kind: 'goal',
		visibility: 'public',
		route: '/docs/examples/visualization-showcase',
		tags: ['visualization', 'charts', 'showcase'],
		body: `## Purpose
The visualization showcase is the focused reference package for ContractSpec's shared visualization layer.

It demonstrates how **VisualizationSpec** contracts define intent once and get rendered through ContractSpec-owned primitives rather than ad hoc vendor configuration.

## Covered primitives
- Metric cards
- Cartesian charts: line, bar, area, scatter
- Pie charts
- Heatmaps
- Funnels
- Geo visualizations
- Design-system composites: comparison and timeline views

Use this example when you want the smallest package that still shows the visualization contract model end to end.`,
	},
	{
		id: 'docs.examples.visualization-showcase.goal',
		title: 'Visualization Showcase Goal',
		summary:
			'Why this package exists beside domain-heavy dashboard examples.',
		kind: 'goal',
		visibility: 'public',
		route: '/docs/examples/visualization-showcase/goal',
		tags: ['visualization', 'architecture'],
		body: `## Why this example exists
Unlike the analytics dashboard example, this package is intentionally lightweight.

Its purpose is to show the visualization foundation itself:
- shared specs
- shared registries
- shared sample data
- shared design-system wrappers
- markdown-friendly summaries

That makes it the best starting point for understanding how to add visualization support to another ContractSpec example or product surface.`,
	},
	{
		id: 'docs.examples.visualization-showcase.usage',
		title: 'Visualization Showcase Usage',
		summary:
			'How to use the showcase package as a reference when building new visual blocks.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/visualization-showcase/usage',
		tags: ['visualization', 'usage'],
		body: `## How to use it
1. Start from the \`./visualizations\` catalog and inspect the registered specs.
2. Reuse the contract grammar in your own example or product package.
3. Feed normalized data into \`VisualizationRenderer\`, \`VisualizationCard\`, \`ComparisonView\`, or \`TimelineView\`.
4. Add a markdown renderer so the same visualization story remains readable outside React.

## Relationship to other examples
- \`analytics-dashboard\` remains the domain-heavy analytics reference.
- \`visualization-showcase\` is the focused visualization capability reference.`,
	},
];

registerDocBlocks(visualizationShowcaseDocs);
