import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';
import {
	createVisualizationShowcaseComparisonItems,
	createVisualizationShowcaseGridItems,
	createVisualizationShowcaseTimelineItems,
	VisualizationShowcaseSpecs,
} from '../../visualizations';

export const visualizationShowcaseMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc: PresentationSpec) => {
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'VisualizationShowcase'
		) {
			throw new Error(
				'visualizationShowcaseMarkdownRenderer: not VisualizationShowcase'
			);
		}

		const gridItems = createVisualizationShowcaseGridItems();
		const comparisonItems = createVisualizationShowcaseComparisonItems();
		const timelineItems = createVisualizationShowcaseTimelineItems();

		const lines: string[] = [
			'# Visualization Showcase',
			'',
			'> Focused reference example for ContractSpec visualization primitives.',
			'',
			'## Primitive Coverage',
			'',
			'| Visualization | Kind | Goal |',
			'|---------------|------|------|',
		];

		for (const spec of VisualizationShowcaseSpecs) {
			lines.push(
				`| ${spec.meta.title} | ${spec.visualization.kind} | ${spec.meta.goal} |`
			);
		}

		lines.push('');
		lines.push('## Primitive Gallery');
		lines.push('');

		for (const item of gridItems) {
			lines.push(
				`- **${item.title}** via \`${item.spec.meta.key}\` (${item.spec.visualization.kind})`
			);
		}

		lines.push('');
		lines.push('## Comparison View');
		lines.push('');

		for (const item of comparisonItems) {
			lines.push(`- ${item.title} -> \`${item.spec.meta.key}\``);
		}

		lines.push('');
		lines.push('## Timeline View');
		lines.push('');

		for (const item of timelineItems) {
			lines.push(`- ${item.title} -> \`${item.spec.meta.key}\``);
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};
