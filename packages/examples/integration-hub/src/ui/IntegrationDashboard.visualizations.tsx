'use client';

import {
	ComparisonView,
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import type {
	Connection,
	Integration,
	SyncConfig,
} from '../handlers/integration.handlers';
import { createIntegrationVisualizationSections } from '../visualizations';

export function IntegrationVisualizationOverview({
	integrations,
	connections,
	syncConfigs,
}: {
	integrations: Integration[];
	connections: Connection[];
	syncConfigs: SyncConfig[];
}) {
	const { primaryItems, comparisonItems } =
		createIntegrationVisualizationSections(
			integrations,
			connections,
			syncConfigs
		);

	return (
		<section className="space-y-4">
			<div>
				<h3 className="font-semibold text-lg">Integration Visualizations</h3>
				<p className="text-muted-foreground text-sm">
					Contract-backed charts for integration coverage and sync health.
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
				description="Comparison surface for healthy versus attention-needed syncs."
				items={comparisonItems}
				title="Sync-State Comparison"
			/>
		</section>
	);
}
