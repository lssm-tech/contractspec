import type {
	SharedChildrenProps,
	SharedClassNameProps,
	SharedDisableableProps,
	SharedFieldError,
	SharedFieldOrientation,
} from './common';

export type SharedButtonVariant =
	| 'default'
	| 'destructive'
	| 'outline'
	| 'secondary'
	| 'ghost'
	| 'link';

export type SharedButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface SharedButtonProps
	extends SharedChildrenProps,
		SharedClassNameProps,
		SharedDisableableProps {
	variant?: SharedButtonVariant;
	size?: SharedButtonSize;
}

export interface SharedInputProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
	placeholder?: string;
	readOnly?: boolean;
}

export interface SharedTextareaProps extends SharedInputProps {
	rows?: number;
}

export interface SharedDatePickerProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	value: Date | null;
	onChange: (date: Date | null) => void;
	minDate?: Date;
	maxDate?: Date;
	placeholder?: string;
}

export interface SharedDateRange {
	start: Date | null;
	end: Date | null;
}

export interface SharedDateRangePickerProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	value: SharedDateRange;
	onChange: (range: SharedDateRange) => void;
	minDate?: Date;
	maxDate?: Date;
	placeholders?: {
		start?: string;
		end?: string;
	};
}

export interface SharedTimePickerProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	value: Date | null;
	onChange: (date: Date | null) => void;
	placeholder?: string;
	is24Hour?: boolean;
}

export interface SharedDateTimePickerProps extends SharedTimePickerProps {
	minDate?: Date;
	maxDate?: Date;
}

export interface SharedFieldProps extends SharedClassNameProps {
	orientation?: SharedFieldOrientation;
}

export interface SharedFieldLegendProps extends SharedClassNameProps {
	variant?: 'legend' | 'label';
}

export interface SharedFieldErrorProps
	extends SharedChildrenProps,
		SharedClassNameProps {
	errors?: SharedFieldError[];
}

export interface SharedSelectProps<TValue = string>
	extends SharedClassNameProps,
		SharedDisableableProps {
	value?: TValue;
	onChange?: (value: TValue) => void;
	placeholder?: string;
}

export interface SharedFormFieldStateProps {
	name?: string;
	required?: boolean;
	disabled?: boolean;
}
