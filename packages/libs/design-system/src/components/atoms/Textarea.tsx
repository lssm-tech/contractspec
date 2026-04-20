import {
	Textarea as WebTextarea,
	type TextareaProps as WebTextareaProps,
} from '@contractspec/lib.ui-kit-web/ui/textarea';
import * as React from 'react';
import { type KeyboardOptions, mapKeyboardToWeb } from '../../lib/keyboard';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../primitives/themed';

interface BaseFieldProps {
	value?: string;
	defaultValue?: string;
	// onChange?: (text: string) => void;
	// onSubmit?: () => void;
	// onFocus?: () => void;
	// onBlur?: () => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	maxLength?: number;
	name?: string;
	className?: string;
	rows?: number;
	keyboard?: KeyboardOptions;
}

export type TextareaProps = WebTextareaProps &
	BaseFieldProps &
	ThemedPrimitiveProps;

// export type TextareaProps = Omit<
//   WebTextareaProps,
//   // 'onChange' | 'value' | 'defaultValue'
// > &
//   BaseFieldProps;

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
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Textarea',
		componentKey,
		themeVariant,
		className,
		style: rest.style,
	});
	const translate = useTranslatedText();

	const handleChange = React.useCallback<
		React.ChangeEventHandler<HTMLTextAreaElement>
	>((e) => onChange?.(e), [onChange]);

	// const handleKeyDown = React.useCallback<
	//   React.KeyboardEventHandler<HTMLTextAreaElement>
	// >(
	//   (e) => {
	//     if (e.key === 'Enter' && webKeyboard.type !== 'search') {
	//       // For textarea, Enter inserts newline; onSubmit could be used with modifier
	//       if (e.metaKey || e.ctrlKey) onSubmit?.(e);
	//     }
	//   },
	//   [onSubmit, webKeyboard.type]
	// );

	return (
		<WebTextarea
			{...(themed.props as Partial<WebTextareaProps>)}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(rest as any)}
			className={themed.className}
			style={themed.style}
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
			placeholder={translate(placeholderI18n ?? placeholder)}
			aria-label={translate(ariaLabelI18n)}
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
