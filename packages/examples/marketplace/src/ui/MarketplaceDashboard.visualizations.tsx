'use client';

import {
	VisualizationCard,
	VisualizationGrid,
} from '@contractspec/lib.design-system';
import type { Order, Product } from '../handlers/marketplace.handlers';
import { createMarketplaceVisualizationItems } from '../visualizations';

export function MarketplaceVisualizationOverview({
	products,
	orders,
}: {
	products: Product[];
	orders: Order[];
}) {
	const items = createMarketplaceVisualizationItems(products, orders);

	return (
		<section className="space-y-3">
			<div>
				<h3 className="font-semibold text-lg">Commerce Visualizations</h3>
				<p className="text-muted-foreground text-sm">
					Order and catalog trends exposed through shared visualization
					contracts.
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
