'use client';

import {
	ComparisonView,
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import type { WorkflowInstance } from '../handlers/workflow.handlers';
import { createWorkflowVisualizationSections } from '../visualizations';

export function WorkflowVisualizationOverview({
	instances,
}: {
	instances: WorkflowInstance[];
}) {
	const { primaryItems, comparisonItems } =
		createWorkflowVisualizationSections(instances);

	return (
		<section className="space-y-4">
			<div>
				<h3 className="font-semibold text-lg">Workflow Visualizations</h3>
				<p className="text-muted-foreground text-sm">
					Contract-backed charts for workflow health and throughput.
				</p>
			</div>
			<VisualizationGrid>
				{primaryItems.map((item) => (
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
			<ComparisonView
				description="Shared comparison surface for active versus completed work."
				items={comparisonItems}
				title="Workload Comparison"
			/>
		</section>
	);
}
