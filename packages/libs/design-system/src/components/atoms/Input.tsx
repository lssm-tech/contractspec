import {
	Input as WebInput,
	type InputProps as WebInputProps,
} from '@contractspec/lib.ui-kit-web/ui/input';
import { mapKeyboardToWeb } from '../../lib/keyboard';
import {
	type ControlThemeProps,
	type TextFieldBaseProps,
	useThemedTextField,
} from '../primitives/control';

interface InputBaseProps extends TextFieldBaseProps {
	name?: string;
}

export type InputProps = Omit<
	WebInputProps,
	'input' // | 'onChange' | 'value' | 'defaultValue'
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
	name,
	className,
	keyboard,
	componentKey,
	themeVariant,
	placeholderI18n,
	ariaLabelI18n,
	...rest
}: InputProps) {
	const webKeyboard = mapKeyboardToWeb(keyboard);
	const field = useThemedTextField({
		defaultComponentKey: 'Input',
		componentKey,
		themeVariant,
		className,
		style: rest.style,
		placeholder,
		placeholderI18n,
		ariaLabelI18n,
	});

	return (
		<WebInput
			{...(field.themed.props as Partial<WebInputProps>)}
			{...rest}
			className={field.themed.className}
			style={field.themed.style}
			value={value}
			defaultValue={defaultValue}
			// onChange={onChange ? (e) => onChange?.(e.target.value) : undefined}
			// onKeyDown={onKeyDown}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			placeholder={field.placeholder}
			aria-label={field.ariaLabel}
			disabled={disabled}
			readOnly={readOnly}
			maxLength={maxLength}
			name={name}
			{...webKeyboard}
		/>
	);
}
