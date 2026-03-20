'use client';

import {
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import { createAgentVisualizationItems } from '../visualizations';
import type { Run } from './hooks/useRunList';

export function AgentVisualizationOverview({ runs }: { runs: Run[] }) {
	const items = createAgentVisualizationItems(runs);

	return (
		<section className="space-y-3">
			<div>
				<h3 className="font-semibold text-lg">Operational Visualizations</h3>
				<p className="text-muted-foreground text-sm">
					Contract-backed charts derived from recent run activity.
				</p>
			</div>
			<VisualizationGrid>
				{items.map((item) => (
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
	);
}
