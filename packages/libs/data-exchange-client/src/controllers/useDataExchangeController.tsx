import type { FieldMapping } from '@contractspec/lib.data-exchange-core';
import * as React from 'react';
import type { UseDataExchangeControllerOptions } from '../types';
import { createDataExchangeViewModel } from './model';

export function useDataExchangeController({
	preview,
	initialMappings,
	executionResult,
}: UseDataExchangeControllerOptions) {
	const [mappings, setMappings] = React.useState<FieldMapping[]>(
		initialMappings ?? preview.plan.mappings
	);

	const updateMapping = React.useCallback(
		(targetField: string, next: Partial<FieldMapping>) => {
			setMappings((current) =>
				current.map((mapping) =>
					mapping.targetField === targetField
						? { ...mapping, ...next }
						: mapping
				)
			);
		},
		[]
	);

	const resetMappings = React.useCallback(() => {
		setMappings(preview.plan.mappings);
	}, [preview.plan.mappings]);

	const model = React.useMemo(
		() => createDataExchangeViewModel({ preview, mappings, executionResult }),
		[executionResult, mappings, preview]
	);

	return {
		mappings,
		model,
		updateMapping,
		resetMappings,
	};
}
