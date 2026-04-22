import {
	InputPassword as NativeInputPassword,
	type InputPasswordProps as NativeInputPasswordProps,
} from '@contractspec/lib.ui-kit/ui/input-password';
import { mapKeyboardToNative } from '../../lib/keyboard';
import {
	type ControlThemeProps,
	type TextFieldBaseProps,
	useThemedTextField,
} from '../primitives/control';
import { useTranslatedText } from '../primitives/themed';

type PasswordPurpose = 'current' | 'new';

interface InputPasswordBaseProps extends TextFieldBaseProps {
	value?: string;
	defaultValue?: string;
	onChange?: (text: string) => void;
	passwordPurpose?: PasswordPurpose;
	visibilityToggle?: boolean;
	showLabel?: string;
	hideLabel?: string;
	showLabelI18n?: string;
	hideLabelI18n?: string;
}

export type InputPasswordProps = Omit<
	NativeInputPasswordProps,
	| 'value'
	| 'defaultValue'
	| 'onChangeText'
	| 'secureTextEntry'
	| 'textContentType'
	| 'showLabel'
	| 'hideLabel'
	| 'passwordPurpose'
	| 'visibilityToggle'
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
	const nativeKeyboard = mapKeyboardToNative({
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
		placeholder,
		placeholderI18n,
		ariaLabelI18n,
	});

	return (
		<NativeInputPassword
			{...(field.themed.props as NativeInputPasswordProps)}
			{...(rest as any)}
			className={field.themed.className as any}
			value={value as any}
			defaultValue={defaultValue as any}
			onChangeText={onChange as any}
			onSubmitEditing={onSubmit as any}
			onFocus={onFocus as any}
			onBlur={onBlur as any}
			placeholder={field.placeholder}
			accessibilityLabel={field.ariaLabel}
			editable={!disabled && !readOnly}
			disabled={disabled}
			maxLength={maxLength}
			passwordPurpose={passwordPurpose}
			visibilityToggle={visibilityToggle}
			showLabel={translate(showLabelI18n ?? showLabel ?? 'Show password')}
			hideLabel={translate(hideLabelI18n ?? hideLabel ?? 'Hide password')}
			{...(nativeKeyboard as any)}
		/>
	);
}

export default InputPassword;
