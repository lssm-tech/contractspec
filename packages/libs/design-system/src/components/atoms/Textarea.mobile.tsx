import { Textarea as NativeTextarea } from '@contractspec/lib.ui-kit/ui/textarea';
import * as React from 'react';
import { type KeyboardOptions, mapKeyboardToNative } from '../../lib/keyboard';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../primitives/themed';

interface BaseFieldProps {
	value?: string;
	defaultValue?: string;
	onChange?: (text: string) => void;
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

type NativeTextareaComponentProps = React.ComponentProps<typeof NativeTextarea>;
export type TextareaProps = Omit<
	NativeTextareaComponentProps,
	'onChangeText' | 'value' | 'defaultValue'
> &
	BaseFieldProps &
	ThemedPrimitiveProps;

export function Textarea({
	value,
	defaultValue,
	onChange,
	onSubmit,
	onFocus,
	onBlur,
	placeholder,
	disabled,
	readOnly,
	maxLength,
	className,
	keyboard,
	componentKey,
	themeVariant,
	placeholderI18n,
	ariaLabelI18n,
	...rest
}: TextareaProps) {
	const nativeKeyboard = mapKeyboardToNative(keyboard);
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Textarea',
		componentKey,
		themeVariant,
		className,
	});
	const translate = useTranslatedText();

	return (
		<NativeTextarea
			{...(themed.props as NativeTextareaComponentProps)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(rest as any)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			className={themed.className as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			value={value as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			defaultValue={defaultValue as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onChangeText={onChange as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onSubmitEditing={onSubmit as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onFocus={onFocus as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onBlur={onBlur as any}
			placeholder={translate(placeholderI18n ?? placeholder)}
			accessibilityLabel={translate(ariaLabelI18n)}
			editable={!disabled && !readOnly}
			maxLength={maxLength}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(nativeKeyboard as any)}
		/>
	);
}

export default Textarea;
