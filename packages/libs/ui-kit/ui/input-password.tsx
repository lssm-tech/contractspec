import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Input, type InputProps } from './input';

export type PasswordPurpose = 'current' | 'new';

export type InputPasswordProps = Omit<
	InputProps,
	'secureTextEntry' | 'textContentType'
> & {
	passwordPurpose?: PasswordPurpose;
	visibilityToggle?: boolean;
	showLabel?: string;
	hideLabel?: string;
};

function passwordAutoComplete(purpose: PasswordPurpose) {
	return purpose === 'new' ? 'new-password' : 'current-password';
}

function passwordTextContentType(purpose: PasswordPurpose) {
	return purpose === 'new' ? 'newPassword' : 'password';
}

function InputPassword({
	className,
	passwordPurpose = 'current',
	visibilityToggle = true,
	showLabel = 'Show password',
	hideLabel = 'Hide password',
	autoComplete,
	editable,
	disabled,
	...props
}: InputPasswordProps) {
	const [visible, setVisible] = React.useState(false);
	const isDisabled = Boolean(disabled || editable === false);
	const label = visible ? hideLabel : showLabel;
	const Icon = visible ? EyeOff : Eye;
	const resolvedAutoComplete =
		autoComplete ?? passwordAutoComplete(passwordPurpose);
	const textContentType = passwordTextContentType(passwordPurpose);

	if (!visibilityToggle) {
		return (
			<Input
				className={className}
				secureTextEntry
				autoComplete={resolvedAutoComplete}
				textContentType={textContentType}
				editable={!isDisabled}
				disabled={disabled}
				{...props}
			/>
		);
	}

	return (
		<View
			className={cn(
				'web:flex native:h-12 web:w-full flex-row items-center rounded-md border border-input bg-background px-3 text-foreground web:ring-offset-background',
				isDisabled && 'web:cursor-not-allowed opacity-50',
				className
			)}
		>
			<Input
				className="native:h-12 web:h-10 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none web:focus-visible:ring-0 web:focus-visible:ring-offset-0"
				secureTextEntry={!visible}
				autoComplete={resolvedAutoComplete}
				textContentType={textContentType}
				editable={!isDisabled}
				disabled={disabled}
				{...props}
			/>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={label}
				accessibilityState={{ disabled: isDisabled, selected: visible }}
				disabled={isDisabled}
				className="native:h-10 native:w-10 items-center justify-center"
				onPress={() => {
					setVisible((current) => !current);
				}}
			>
				<Icon size={18} color="#64748b" />
			</Pressable>
		</View>
	);
}

export { InputPassword };
