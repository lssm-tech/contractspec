import type {
	SharedFilterSelectProps,
	SharedOption,
} from '@contractspec/lib.ui-kit-core/interfaces';

export interface FilterOption extends SharedOption {}

export interface FilterSelectProps extends SharedFilterSelectProps<string> {}
