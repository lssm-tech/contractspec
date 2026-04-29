import type {
	ColumnValueFormat,
	ExecutionResult,
	FieldMapping,
	FormatProfile,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';

export interface MappingRow {
	id: string;
	sourceField: string;
	targetField: string;
	confidence?: number;
	required?: boolean;
	sourceAliases?: string[];
	formatLabel?: string;
	templateColumnKey?: string;
	status?: FieldMapping['status'];
}

export interface TemplateMappingRow extends MappingRow {
	label: string;
	description?: string;
	unmatched: boolean;
	ignoredSource: boolean;
}

export interface DataExchangeViewModel {
	mappingRows: MappingRow[];
	templateRows?: TemplateMappingRow[];
	unmatchedRequiredRows?: TemplateMappingRow[];
	ignoredSourceColumns?: string[];
	sourceRows: Record<string, unknown>[];
	previewRows: Record<string, unknown>[];
	changeRows: Record<string, unknown>[];
	validationSummary: {
		errors: number;
		warnings: number;
		info: number;
	};
}

export type ResolvedDataExchangeViewModel = DataExchangeViewModel &
	Required<
		Pick<
			DataExchangeViewModel,
			'templateRows' | 'unmatchedRequiredRows' | 'ignoredSourceColumns'
		>
	>;

export interface UseDataExchangeControllerOptions {
	preview: PreviewResult;
	executionResult?: ExecutionResult;
	initialMappings?: FieldMapping[];
	initialFormatProfile?: FormatProfile;
}

export interface DataExchangeController {
	mappings: FieldMapping[];
	formatProfile?: FormatProfile;
	model: ResolvedDataExchangeViewModel;
	updateMapping: (targetField: string, next: Partial<FieldMapping>) => void;
	selectAlias: (targetField: string, sourceField: string) => void;
	updateFieldFormat: (
		targetField: string,
		format: ColumnValueFormat | undefined
	) => void;
	resetMappings: () => void;
	resetToTemplate: () => void;
	acceptInferredMappings: () => void;
}
