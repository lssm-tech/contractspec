import type {
	ColumnValueFormat,
	FieldMapping,
	FormatProfile,
} from '@contractspec/lib.data-exchange-core';
import * as React from 'react';
import type { UseDataExchangeControllerOptions } from '../types';
import { upsertMapping } from './mapping-state';

interface UseMappingActionsArgs {
	preview: UseDataExchangeControllerOptions['preview'];
	setMappings: React.Dispatch<React.SetStateAction<FieldMapping[]>>;
	setFormatProfile: React.Dispatch<
		React.SetStateAction<FormatProfile | undefined>
	>;
}

export function useMappingActions({
	preview,
	setMappings,
	setFormatProfile,
}: UseMappingActionsArgs) {
	const updateMapping = React.useCallback(
		(targetField: string, next: Partial<FieldMapping>) => {
			setMappings((current) =>
				upsertMapping(current, preview, targetField, next)
			);
		},
		[preview, setMappings]
	);

	const selectAlias = React.useCallback(
		(targetField: string, sourceField: string) => {
			updateMapping(targetField, { sourceField, status: 'manual' });
		},
		[updateMapping]
	);

	const updateFieldFormat = React.useCallback(
		(targetField: string, format: ColumnValueFormat | undefined) => {
			updateMapping(targetField, { format });
			setFormatProfile((current) => ({
				...(current ?? {}),
				columns: {
					...(current?.columns ?? {}),
					[targetField]: format,
				},
			}));
		},
		[setFormatProfile, updateMapping]
	);

	const resetMappings = React.useCallback(() => {
		setMappings(preview.plan.mappings);
	}, [preview.plan.mappings, setMappings]);

	const resetToTemplate = React.useCallback(() => {
		setMappings(
			preview.plan.templateMapping?.mappings ?? preview.plan.mappings
		);
		setFormatProfile(
			preview.plan.template?.formatProfile ?? preview.plan.formatProfile
		);
	}, [
		preview.plan.formatProfile,
		preview.plan.mappings,
		preview.plan.template?.formatProfile,
		preview.plan.templateMapping?.mappings,
		setFormatProfile,
		setMappings,
	]);

	const acceptInferredMappings = React.useCallback(() => {
		setMappings((current) =>
			current.map((mapping) => ({
				...mapping,
				status: mapping.status === 'unmatched' ? 'unmatched' : 'manual',
			}))
		);
	}, [setMappings]);

	return {
		updateMapping,
		selectAlias,
		updateFieldFormat,
		resetMappings,
		resetToTemplate,
		acceptInferredMappings,
	};
}
