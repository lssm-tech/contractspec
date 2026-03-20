import {
	defineVisualization,
	VisualizationRegistry,
} from '@contractspec/lib.contracts-spec/visualizations';

const ORDER_LIST_REF = {
	key: 'marketplace.order.list',
	version: '1.0.0',
} as const;
const PRODUCT_LIST_REF = {
	key: 'marketplace.product.list',
	version: '1.0.0',
} as const;
const META = {
	version: '1.0.0',
	domain: 'marketplace',
	stability: 'experimental' as const,
	owners: ['@example.marketplace'],
	tags: ['marketplace', 'visualization', 'commerce'],
};

export const MarketplaceOrderStatusVisualization = defineVisualization({
	meta: {
		...META,
		key: 'marketplace.visualization.order-status',
		title: 'Order Status Breakdown',
		description: 'Distribution of current order states.',
		goal: 'Expose delivery and backlog mix at a glance.',
		context: 'Marketplace operations overview.',
	},
	source: { primary: ORDER_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'status',
		valueMeasure: 'orders',
		dimensions: [
			{ key: 'status', label: 'Status', dataPath: 'status', type: 'category' },
		],
		measures: [
			{ key: 'orders', label: 'Orders', dataPath: 'orders', format: 'number' },
		],
		table: { caption: 'Order counts by status.' },
	},
});

export const MarketplaceCategoryValueVisualization = defineVisualization({
	meta: {
		...META,
		key: 'marketplace.visualization.category-value',
		title: 'Category Value Comparison',
		description:
			'Catalog value by product category derived from current pricing and stock.',
		goal: 'Compare where the marketplace catalog is concentrated.',
		context: 'Merchandising overview.',
	},
	source: { primary: PRODUCT_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'bar',
		xDimension: 'category',
		yMeasures: ['catalogValue'],
		dimensions: [
			{
				key: 'category',
				label: 'Category',
				dataPath: 'category',
				type: 'category',
			},
		],
		measures: [
			{
				key: 'catalogValue',
				label: 'Catalog Value',
				dataPath: 'catalogValue',
				format: 'currency',
				color: '#1d4ed8',
			},
		],
		table: { caption: 'Catalog value by product category.' },
	},
});

export const MarketplaceOrderActivityVisualization = defineVisualization({
	meta: {
		...META,
		key: 'marketplace.visualization.order-activity',
		title: 'Recent Order Activity',
		description: 'Daily order volume from recent order creation timestamps.',
		goal: 'Show recent order activity trends.',
		context: 'Commerce operations trend monitoring.',
	},
	source: { primary: ORDER_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'day',
		yMeasures: ['orders'],
		dimensions: [{ key: 'day', label: 'Day', dataPath: 'day', type: 'time' }],
		measures: [
			{
				key: 'orders',
				label: 'Orders',
				dataPath: 'orders',
				format: 'number',
				color: '#0f766e',
			},
		],
		table: { caption: 'Daily order counts.' },
	},
});

export const MarketplaceVisualizationSpecs = [
	MarketplaceOrderStatusVisualization,
	MarketplaceCategoryValueVisualization,
	MarketplaceOrderActivityVisualization,
] as const;

export const MarketplaceVisualizationRegistry = new VisualizationRegistry([
	...MarketplaceVisualizationSpecs,
]);

export const MarketplaceVisualizationRefs = MarketplaceVisualizationSpecs.map(
	(spec) => ({
		key: spec.meta.key,
		version: spec.meta.version,
	})
);
