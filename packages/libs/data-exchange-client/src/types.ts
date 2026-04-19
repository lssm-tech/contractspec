import type {
	ExecutionResult,
	FieldMapping,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';

export interface MappingRow {
	id: string;
	sourceField: string;
	targetField: string;
	confidence?: number;
	required?: boolean;
}

export interface DataExchangeViewModel {
	mappingRows: MappingRow[];
	sourceRows: Record<string, unknown>[];
	previewRows: Record<string, unknown>[];
	changeRows: Record<string, unknown>[];
	validationSummary: {
		errors: number;
		warnings: number;
		info: number;
	};
}

export interface UseDataExchangeControllerOptions {
	preview: PreviewResult;
	executionResult?: ExecutionResult;
	initialMappings?: FieldMapping[];
}
