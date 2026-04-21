import {
	Textarea as WebTextarea,
	type TextareaProps as WebTextareaProps,
} from '@contractspec/lib.ui-kit-web/ui/textarea';
import * as React from 'react';
import { mapKeyboardToWeb } from '../../lib/keyboard';
import {
	type ControlThemeProps,
	type TextFieldBaseProps,
	useThemedTextField,
} from '../primitives/control';

interface TextareaBaseProps extends TextFieldBaseProps {
	value?: string;
	defaultValue?: string;
	name?: string;
	rows?: number;
}

export type TextareaProps = WebTextareaProps &
	TextareaBaseProps &
	ControlThemeProps;

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
	name,
	className,
	rows,
	keyboard,
	componentKey,
	themeVariant,
	placeholderI18n,
	ariaLabelI18n,
	...rest
}: TextareaProps) {
	const webKeyboard = mapKeyboardToWeb(keyboard);
	const field = useThemedTextField({
		defaultComponentKey: 'Textarea',
		componentKey,
		themeVariant,
		className,
		style: rest.style,
		placeholder,
		placeholderI18n,
		ariaLabelI18n,
	});

	const handleChange = React.useCallback<
		React.ChangeEventHandler<HTMLTextAreaElement>
	>((e) => onChange?.(e), [onChange]);

	return (
		<WebTextarea
			{...(field.themed.props as Partial<WebTextareaProps>)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(rest as any)}
			className={field.themed.className}
			style={field.themed.style}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			value={value as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			defaultValue={defaultValue as any}
			onChange={handleChange}
			// onKeyDown={handleKeyDown}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onFocus={onFocus as any}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onBlur={onBlur as any}
			placeholder={field.placeholder}
			aria-label={field.ariaLabel}
			disabled={disabled}
			readOnly={readOnly}
			maxLength={maxLength}
			name={name}
			rows={rows}
			{...webKeyboard}
		/>
	);
}

export default Textarea;
