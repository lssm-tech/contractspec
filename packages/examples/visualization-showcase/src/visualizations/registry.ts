import type {
	VisualizationRef,
	VisualizationSpec,
} from '@contractspec/lib.contracts-spec/visualizations';
import { VisualizationRegistry } from '@contractspec/lib.contracts-spec/visualizations';
import {
	ShowcaseFunnelVisualization,
	ShowcaseGeoVisualization,
	ShowcaseHeatmapVisualization,
	ShowcasePieVisualization,
} from './specs.breakdown';
import {
	ShowcaseAreaVisualization,
	ShowcaseBarVisualization,
	ShowcaseLineVisualization,
	ShowcaseScatterVisualization,
} from './specs.cartesian';
import { ShowcaseMetricVisualization } from './specs.metric';

export const VisualizationShowcaseSpecs = [
	ShowcaseMetricVisualization,
	ShowcaseLineVisualization,
	ShowcaseBarVisualization,
	ShowcaseAreaVisualization,
	ShowcaseScatterVisualization,
	ShowcasePieVisualization,
	ShowcaseHeatmapVisualization,
	ShowcaseFunnelVisualization,
	ShowcaseGeoVisualization,
] as const;

export const VisualizationShowcaseRegistry = new VisualizationRegistry([
	...VisualizationShowcaseSpecs,
]);

export const VisualizationShowcaseRefs = VisualizationShowcaseSpecs.map((spec) =>
	refOf(spec)
);

export const VisualizationShowcaseSpecMap = new Map(
	VisualizationShowcaseSpecs.map((spec) => [
		visualizationRefKey(spec.meta),
		spec,
	])
);

export function refOf(spec: VisualizationSpec): VisualizationRef {
	return { key: spec.meta.key, version: spec.meta.version };
}

export function visualizationRefKey(
	ref: Pick<VisualizationRef, 'key' | 'version'>
) {
	return `${ref.key}.v${ref.version}`;
}
