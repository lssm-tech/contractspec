import {
	AnalyticsVisualizationSampleData,
	AnalyticsVisualizationSpecs,
	visualizationRefKey as analyticsRefKey,
} from '@contractspec/example.analytics-dashboard/visualizations';
import { IntegrationVisualizationSpecs } from '@contractspec/example.integration-hub/visualizations';
import { MarketplaceVisualizationSpecs } from '@contractspec/example.marketplace/visualizations';
import { createVisualizationShowcaseGridItems } from '@contractspec/example.visualization-showcase/visualizations/sections';
import {
	MetricRow,
	Panel,
	PanelHeader,
	PreviewList,
} from './native-preview-primitives';

interface PreviewVisualizationSpec {
	meta: {
		key: string;
		version: string;
		title?: string;
		description?: string;
	};
	visualization: {
		kind: string;
	};
}

export function AnalyticsDashboardNativePreview() {
	return (
		<VisualizationSpecsPreview
			title="Analytics dashboard"
			eyebrow="Analytics"
			description="Visualization specs and sample data series are rendered from the analytics example package."
			specs={AnalyticsVisualizationSpecs}
			sampleRows={(spec) =>
				sampleRowsFor(
					AnalyticsVisualizationSampleData[analyticsRefKey(spec.meta)]
				)
			}
		/>
	);
}

export function IntegrationHubNativePreview() {
	return (
		<VisualizationSpecsPreview
			title="Integration hub"
			eyebrow="Integration health"
			description="Integration coverage and sync-health visualizations are shown from shared specs."
			specs={IntegrationVisualizationSpecs}
		/>
	);
}

export function MarketplaceNativePreview() {
	return (
		<VisualizationSpecsPreview
			title="Marketplace operations"
			eyebrow="Commerce"
			description="Order, catalog, and activity visualizations are shown from shared marketplace specs."
			specs={MarketplaceVisualizationSpecs}
		/>
	);
}

export function VisualizationShowcaseNativePreview() {
	const gridItems = createVisualizationShowcaseGridItems();

	return (
		<Panel>
			<PanelHeader
				title="Visualization showcase"
				eyebrow="Chart primitives"
				description="Canonical visualization samples are summarized from shared ContractSpec visualization items."
			/>
			<MetricRow
				items={[
					['Visualizations', String(gridItems.length)],
					['With data', String(gridItems.filter((item) => item.data).length)],
					['First', gridItems[0]?.title ?? 'none'],
				]}
			/>
			<PreviewList
				items={gridItems.slice(0, 6).map((item) => ({
					title: item.title,
					subtitle: item.spec.visualization.kind,
					body: item.description ?? `${sampleRowsFor(item.data)} sample rows`,
				}))}
			/>
		</Panel>
	);
}

function VisualizationSpecsPreview({
	description,
	eyebrow,
	sampleRows,
	specs,
	title,
}: {
	description: string;
	eyebrow: string;
	sampleRows?: (spec: PreviewVisualizationSpec) => number;
	specs: readonly PreviewVisualizationSpec[];
	title: string;
}) {
	return (
		<Panel>
			<PanelHeader title={title} eyebrow={eyebrow} description={description} />
			<MetricRow
				items={[
					['Specs', String(specs.length)],
					[
						'Kinds',
						String(new Set(specs.map((spec) => spec.visualization.kind)).size),
					],
				]}
			/>
			<PreviewList
				items={specs.slice(0, 6).map((spec) => ({
					title: spec.meta.title ?? spec.meta.key,
					subtitle: `${spec.visualization.kind} - v${spec.meta.version}`,
					body: formatVisualizationBody(spec, sampleRows?.(spec)),
				}))}
			/>
		</Panel>
	);
}

function formatVisualizationBody(
	spec: PreviewVisualizationSpec,
	rowCount: number | undefined
) {
	const rowSummary =
		typeof rowCount === 'number' && rowCount > 0
			? `${rowCount} sample rows`
			: 'Shared visualization contract';

	return [spec.meta.description, rowSummary].filter(Boolean).join(' - ');
}

function sampleRowsFor(data: unknown): number {
	if (!isRecord(data)) {
		return 0;
	}
	const rows = data.data;
	return Array.isArray(rows) ? rows.length : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
