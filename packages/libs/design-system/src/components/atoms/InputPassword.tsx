import {
	InputPassword as WebInputPassword,
	type InputPasswordProps as WebInputPasswordProps,
} from '@contractspec/lib.ui-kit-web/ui/input-password';
import { mapKeyboardToWeb } from '../../lib/keyboard';
import {
	type ControlThemeProps,
	type TextFieldBaseProps,
	useThemedTextField,
} from '../primitives/control';
import { useTranslatedText } from '../primitives/themed';

type PasswordPurpose = 'current' | 'new';

interface InputPasswordBaseProps extends TextFieldBaseProps {
	name?: string;
	passwordPurpose?: PasswordPurpose;
	visibilityToggle?: boolean;
	showLabel?: string;
	hideLabel?: string;
	showLabelI18n?: string;
	hideLabelI18n?: string;
}

export type InputPasswordProps = Omit<
	WebInputPasswordProps,
	'type' | 'showLabel' | 'hideLabel' | 'passwordPurpose' | 'visibilityToggle'
> &
	InputPasswordBaseProps &
	ControlThemeProps;

function keyboardKindForPurpose(purpose: PasswordPurpose) {
	return purpose === 'new' ? 'new-password' : 'password';
}

function autoCompleteForPurpose(purpose: PasswordPurpose) {
	return purpose === 'new' ? 'new-password' : 'current-password';
}

export function InputPassword({
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
	passwordPurpose = 'current',
	visibilityToggle,
	showLabel,
	hideLabel,
	showLabelI18n,
	hideLabelI18n,
	...rest
}: InputPasswordProps) {
	const translate = useTranslatedText();
	const webKeyboard = mapKeyboardToWeb({
		kind: keyboardKindForPurpose(passwordPurpose),
		...keyboard,
		autoComplete:
			keyboard?.autoComplete ??
			rest.autoComplete ??
			autoCompleteForPurpose(passwordPurpose),
	});
	const field = useThemedTextField({
		defaultComponentKey: 'InputPassword',
		componentKey,
		themeVariant,
		className,
		style: rest.style,
		placeholder,
		placeholderI18n,
		ariaLabelI18n,
	});

	return (
		<WebInputPassword
			{...(field.themed.props as Partial<WebInputPasswordProps>)}
			{...rest}
			{...webKeyboard}
			className={field.themed.className}
			style={field.themed.style}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			placeholder={field.placeholder}
			aria-label={field.ariaLabel}
			disabled={disabled}
			readOnly={readOnly}
			maxLength={maxLength}
			name={name}
			passwordPurpose={passwordPurpose}
			visibilityToggle={visibilityToggle}
			showLabel={translate(showLabelI18n ?? showLabel ?? 'Show password')}
			hideLabel={translate(hideLabelI18n ?? hideLabel ?? 'Hide password')}
			onKeyDown={(event) => {
				rest.onKeyDown?.(event);
				if (event.defaultPrevented || event.key !== 'Enter') return;
				onSubmit?.();
			}}
		/>
	);
}
