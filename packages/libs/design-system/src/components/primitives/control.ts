import type * as React from 'react';
import type { KeyboardOptions } from '../../lib/keyboard';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from './themed';

export interface TextFieldBaseProps {
	onSubmit?: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	maxLength?: number;
	className?: string;
	keyboard?: KeyboardOptions;
}

export interface ThemedTextFieldOptions {
	defaultComponentKey: string;
	componentKey?: string;
	themeVariant?: string;
	className?: string;
	style?: React.CSSProperties;
	placeholder?: string;
	placeholderI18n?: string;
	ariaLabelI18n?: string;
}

export function optionValue(value: unknown): string {
	return typeof value === 'string' ? value : String(value ?? '');
}

export function inputValue(value: unknown): string {
	if (typeof value === 'string') {
		return value;
	}

	if (typeof value === 'object' && value !== null && 'currentTarget' in value) {
		const currentTarget = value.currentTarget;
		if (
			typeof currentTarget === 'object' &&
			currentTarget !== null &&
			'value' in currentTarget
		) {
			return optionValue(currentTarget.value);
		}
	}

	return optionValue(value);
}

export function useThemedTextField({
	defaultComponentKey,
	componentKey,
	themeVariant,
	className,
	style,
	placeholder,
	placeholderI18n,
	ariaLabelI18n,
}: ThemedTextFieldOptions) {
	const themed = useThemedPrimitive({
		defaultComponentKey,
		componentKey,
		themeVariant,
		className,
		style,
	});
	const translate = useTranslatedText();

	return {
		themed,
		placeholder: translate(placeholderI18n ?? placeholder),
		ariaLabel: translate(ariaLabelI18n),
	};
}

export type ControlThemeProps = ThemedPrimitiveProps;
