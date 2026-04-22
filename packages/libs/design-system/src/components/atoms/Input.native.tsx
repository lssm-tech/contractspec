import { Input as NativeInput } from '@contractspec/lib.ui-kit/ui/input';
import * as React from 'react';
import { mapKeyboardToNative } from '../../lib/keyboard';
import {
	type ControlThemeProps,
	type TextFieldBaseProps,
	useThemedTextField,
} from '../primitives/control';

interface InputBaseProps extends TextFieldBaseProps {
	value?: string;
	defaultValue?: string;
	onChange?: (text: string) => void;
}

type NativeInputComponentProps = React.ComponentProps<typeof NativeInput>;
export type InputProps = Omit<
	NativeInputComponentProps,
	'onChangeText' | 'value' | 'defaultValue'
> &
	InputBaseProps &
	ControlThemeProps;

export function Input({
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
}: InputProps) {
	const nativeKeyboard = mapKeyboardToNative(keyboard);
	const field = useThemedTextField({
		defaultComponentKey: 'Input',
		componentKey,
		themeVariant,
		className,
		placeholder,
		placeholderI18n,
		ariaLabelI18n,
	});

	return (
		<NativeInput
			{...(field.themed.props as NativeInputComponentProps)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(rest as any)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			className={field.themed.className as any}
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
			placeholder={field.placeholder}
			accessibilityLabel={field.ariaLabel}
			editable={!disabled && !readOnly}
			maxLength={maxLength}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(nativeKeyboard as any)}
		/>
	);
}

export default Input;
