import type {
	VisualizationRef,
	VisualizationSpec,
} from '@contractspec/lib.contracts-spec/visualizations';
import type { Widget } from '../handlers/analytics.handlers';
import {
	AnalyticsVisualizationSampleData,
	AnalyticsVisualizationSpecMap,
	refOf,
	visualizationRefKey,
} from './catalog';
import {
	AccountCoverageGeoVisualization,
	ChannelMixVisualization,
	ConversionFunnelVisualization,
	EngagementHeatmapVisualization,
} from './specs.breakdown';
import {
	PipelineScatterVisualization,
	RegionalRevenueVisualization,
	RetentionAreaVisualization,
	RevenueMetricVisualization,
	RevenueTrendVisualization,
} from './specs.performance';

type WidgetLayout = 'single' | 'comparison' | 'timeline';

interface AnalyticsVisualizationBinding {
	ref: VisualizationRef;
	data: unknown;
	title?: string;
	description?: string;
	height?: number;
}

interface AnalyticsWidgetConfig {
	layout: WidgetLayout;
	bindings: AnalyticsVisualizationBinding[];
	description?: string;
}

export interface ResolvedAnalyticsWidget {
	id: string;
	name: string;
	description?: string;
	layout: WidgetLayout;
	gridX: number;
	gridY: number;
	gridWidth: number;
	gridHeight: number;
	bindings: Array<{
		key: string;
		spec: VisualizationSpec;
		data: unknown;
		title?: string;
		description?: string;
		height?: number;
	}>;
}

const LEGACY_VISUALIZATION_REFS: Partial<
	Record<Widget['type'], VisualizationRef>
> = {
	METRIC: refOf(RevenueMetricVisualization),
	LINE_CHART: refOf(RevenueTrendVisualization),
	BAR_CHART: refOf(RegionalRevenueVisualization),
	AREA_CHART: refOf(RetentionAreaVisualization),
	SCATTER_PLOT: refOf(PipelineScatterVisualization),
	PIE_CHART: refOf(ChannelMixVisualization),
	HEATMAP: refOf(EngagementHeatmapVisualization),
	FUNNEL: refOf(ConversionFunnelVisualization),
	MAP: refOf(AccountCoverageGeoVisualization),
};

export function createExampleWidgets(dashboardId: string): Widget[] {
	return [
		widget(
			dashboardId,
			'widget_revenue_metric',
			'Revenue Snapshot',
			'METRIC',
			0,
			0,
			4,
			2,
			{
				layout: 'single',
				bindings: [binding(RevenueMetricVisualization, 200)],
			}
		),
		widget(
			dashboardId,
			'widget_revenue_trend',
			'Revenue Trend',
			'LINE_CHART',
			4,
			0,
			8,
			4,
			{
				layout: 'single',
				bindings: [binding(RevenueTrendVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_regional_revenue',
			'Regional Revenue',
			'BAR_CHART',
			0,
			2,
			6,
			4,
			{
				layout: 'single',
				bindings: [binding(RegionalRevenueVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_channel_mix',
			'Channel Mix',
			'PIE_CHART',
			6,
			2,
			6,
			4,
			{
				layout: 'single',
				bindings: [binding(ChannelMixVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_retention',
			'Retention Curve',
			'AREA_CHART',
			0,
			6,
			6,
			4,
			{
				layout: 'single',
				bindings: [binding(RetentionAreaVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_pipeline',
			'Pipeline Velocity',
			'SCATTER_PLOT',
			6,
			6,
			6,
			4,
			{
				layout: 'single',
				bindings: [binding(PipelineScatterVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_heatmap',
			'Engagement Heatmap',
			'HEATMAP',
			0,
			10,
			8,
			4,
			{
				layout: 'single',
				bindings: [binding(EngagementHeatmapVisualization)],
			}
		),
		widget(
			dashboardId,
			'widget_funnel',
			'Conversion Funnel',
			'FUNNEL',
			8,
			10,
			4,
			4,
			{
				layout: 'single',
				bindings: [binding(ConversionFunnelVisualization)],
			}
		),
		widget(dashboardId, 'widget_geo', 'Account Coverage', 'MAP', 0, 14, 12, 5, {
			layout: 'single',
			bindings: [binding(AccountCoverageGeoVisualization, 360)],
		}),
		widget(
			dashboardId,
			'widget_comparison',
			'Commercial Comparison',
			'EMBED',
			0,
			19,
			12,
			6,
			{
				layout: 'comparison',
				description:
					'Compare regional distribution, channel balance, and funnel shape.',
				bindings: [
					binding(RegionalRevenueVisualization, 240),
					binding(ChannelMixVisualization, 240),
					binding(ConversionFunnelVisualization, 240),
				],
			}
		),
		widget(
			dashboardId,
			'widget_timeline',
			'Growth Timeline',
			'EMBED',
			0,
			25,
			12,
			6,
			{
				layout: 'timeline',
				description:
					'Track revenue and retention over the same reporting cadence.',
				bindings: [
					binding(RevenueTrendVisualization, 220),
					binding(RetentionAreaVisualization, 220),
				],
			}
		),
	];
}

export function resolveAnalyticsWidget(
	widget: Widget
): ResolvedAnalyticsWidget | null {
	const config = parseWidgetConfig(widget);
	const bindings = config.bindings
		.map((binding) => {
			const spec = AnalyticsVisualizationSpecMap.get(
				visualizationRefKey(binding.ref)
			);
			if (!spec) return null;
			return {
				key: `${widget.id}:${visualizationRefKey(binding.ref)}`,
				spec,
				data: binding.data,
				title: binding.title ?? spec.meta.title,
				description: binding.description ?? spec.meta.description,
				height: binding.height,
			};
		})
		.filter((binding): binding is NonNullable<typeof binding> =>
			Boolean(binding)
		);

	if (!bindings.length) return null;

	return {
		id: widget.id,
		name: widget.name,
		description: config.description,
		layout: config.layout,
		gridX: widget.gridX,
		gridY: widget.gridY,
		gridWidth: widget.gridWidth,
		gridHeight: widget.gridHeight,
		bindings,
	};
}

function parseWidgetConfig(widget: Widget): AnalyticsWidgetConfig {
	if (isAnalyticsWidgetConfig(widget.config)) {
		return widget.config;
	}

	const legacyRef = LEGACY_VISUALIZATION_REFS[widget.type];
	return legacyRef
		? {
				layout: 'single',
				bindings: [
					{
						ref: legacyRef,
						data: AnalyticsVisualizationSampleData[
							visualizationRefKey(legacyRef)
						],
					},
				],
			}
		: { layout: 'single', bindings: [] };
}

function binding(
	spec: VisualizationSpec,
	height = 280
): AnalyticsVisualizationBinding {
	return {
		ref: refOf(spec),
		data: AnalyticsVisualizationSampleData[visualizationRefKey(spec.meta)],
		height,
	};
}

function widget(
	dashboardId: string,
	id: string,
	name: string,
	type: Widget['type'],
	gridX: number,
	gridY: number,
	gridWidth: number,
	gridHeight: number,
	config: AnalyticsWidgetConfig
): Widget {
	const now = new Date();
	return {
		id,
		dashboardId,
		name,
		type,
		gridX,
		gridY,
		gridWidth,
		gridHeight,
		config: config as unknown as Record<string, unknown>,
		createdAt: now,
		updatedAt: now,
	};
}

function isAnalyticsWidgetConfig(
	value: unknown
): value is AnalyticsWidgetConfig {
	if (!value || typeof value !== 'object') return false;
	const candidate = value as Partial<AnalyticsWidgetConfig>;
	return (
		(candidate.layout === 'single' ||
			candidate.layout === 'comparison' ||
			candidate.layout === 'timeline') &&
		Array.isArray(candidate.bindings)
	);
}
