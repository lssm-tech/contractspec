'use client';

import {
	ComparisonView,
	TimelineView,
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import {
	createVisualizationShowcaseComparisonItems,
	createVisualizationShowcaseGridItems,
	createVisualizationShowcaseTimelineItems,
} from '../visualizations';

export function VisualizationShowcase() {
	const gridItems = createVisualizationShowcaseGridItems();
	const comparisonItems = createVisualizationShowcaseComparisonItems();
	const timelineItems = createVisualizationShowcaseTimelineItems();

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h2 className="font-bold text-2xl">Visualization Showcase</h2>
				<p className="max-w-3xl text-muted-foreground text-sm">
					Contract-backed visualization primitives rendered through shared
					ContractSpec design-system wrappers.
				</p>
			</div>

			<section className="space-y-4">
				<div>
					<h3 className="font-semibold text-lg">Primitive Gallery</h3>
					<p className="text-muted-foreground text-sm">
						Every card below is driven by a `VisualizationSpec` contract.
					</p>
				</div>
				<VisualizationGrid>
					{gridItems.map((item) => (
						<VisualizationCard
							key={item.key}
							data={item.data}
							description={item.description}
							height={item.height}
							spec={item.spec}
							title={item.title}
						/>
					))}
				</VisualizationGrid>
			</section>

			<ComparisonView
				description="ComparisonView composes several visualization contracts into one opinionated surface."
				items={comparisonItems}
				title="Comparison View"
			/>

			<TimelineView
				description="TimelineView stacks trend-oriented visualizations without exposing vendor-specific chart wiring."
				items={timelineItems}
				title="Timeline View"
			/>
		</div>
	);
}
