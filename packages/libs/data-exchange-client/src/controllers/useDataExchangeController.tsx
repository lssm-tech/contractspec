import type {
	FieldMapping,
	FormatProfile,
} from '@contractspec/lib.data-exchange-core';
import * as React from 'react';
import type {
	DataExchangeController,
	UseDataExchangeControllerOptions,
} from '../types';
import { useMappingActions } from './controller-actions';
import { createDataExchangeViewModel } from './model';

export function useDataExchangeController({
	preview,
	initialMappings,
	initialFormatProfile,
	executionResult,
}: UseDataExchangeControllerOptions): DataExchangeController {
	const [mappings, setMappings] = React.useState<FieldMapping[]>(
		() => initialMappings ?? preview.plan.mappings
	);
	const [formatProfile, setFormatProfile] = React.useState<
		FormatProfile | undefined
	>(
		() =>
			initialFormatProfile ??
			preview.plan.formatProfile ??
			preview.plan.template?.formatProfile
	);

	const actions = useMappingActions({ preview, setMappings, setFormatProfile });

	const model = React.useMemo(
		() =>
			createDataExchangeViewModel({
				preview,
				mappings,
				formatProfile,
				executionResult,
			}),
		[executionResult, formatProfile, mappings, preview]
	);

	return {
		formatProfile,
		mappings,
		model,
		...actions,
	};
}
