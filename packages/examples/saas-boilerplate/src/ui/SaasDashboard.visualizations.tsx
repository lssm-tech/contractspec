'use client';

import {
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import type { Project } from '../handlers/saas.handlers';
import { createSaasVisualizationItems } from '../visualizations';

export function SaasVisualizationOverview({
	projects,
	projectLimit,
}: {
	projects: Project[];
	projectLimit: number;
}) {
	const items = createSaasVisualizationItems(projects, projectLimit);

	return (
		<section className="space-y-3">
			<div>
				<h3 className="font-semibold text-lg">Portfolio Visualizations</h3>
				<p className="text-muted-foreground text-sm">
					Contract-backed charts for project mix, capacity, and activity.
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
