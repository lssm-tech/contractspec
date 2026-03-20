import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import {
	type ContractVisualizationRenderModel,
	createVisualizationModel,
} from '@contractspec/lib.presentation-runtime-core';
import * as React from 'react';

export interface UseVisualizationModelOptions {
	spec: VisualizationSpec;
	data: unknown;
}

export function useVisualizationModel({
	spec,
	data,
}: UseVisualizationModelOptions): ContractVisualizationRenderModel {
	return React.useMemo(
		() => createVisualizationModel(spec, data),
		[data, spec]
	);
}
