import {
	Input as WebInput,
	type InputProps as WebInputProps,
} from '@contractspec/lib.ui-kit-web/ui/input';
import { type KeyboardOptions, mapKeyboardToWeb } from '../../lib/keyboard';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../primitives/themed';

interface BaseFieldProps {
	// value?: string | number;
	// defaultValue?: string | number;
	// onChange?: (text: string) => void;
	onSubmit?: () => void;
	onFocus?: () => void;
	// onBlur?: () => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	maxLength?: number;
	name?: string;
	className?: string;
	keyboard?: KeyboardOptions;
}

export type InputProps = Omit<
	WebInputProps,
	'input' // | 'onChange' | 'value' | 'defaultValue'
> &
	BaseFieldProps &
	ThemedPrimitiveProps;

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
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Input',
		componentKey,
		themeVariant,
		className,
		style: rest.style,
	});
	const translate = useTranslatedText();
	const resolvedPlaceholder = translate(placeholderI18n ?? placeholder);

	return (
		<WebInput
			{...(themed.props as Partial<WebInputProps>)}
			{...rest}
			className={themed.className}
			style={themed.style}
			value={value}
			defaultValue={defaultValue}
			// onChange={onChange ? (e) => onChange?.(e.target.value) : undefined}
			// onKeyDown={onKeyDown}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			placeholder={resolvedPlaceholder}
			aria-label={translate(ariaLabelI18n)}
			disabled={disabled}
			readOnly={readOnly}
			maxLength={maxLength}
			name={name}
			{...webKeyboard}
		/>
	);
}
