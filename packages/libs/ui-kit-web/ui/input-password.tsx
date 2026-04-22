'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { Input } from './input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from './input-group';

export type PasswordPurpose = 'current' | 'new';

export type InputPasswordProps = Omit<
	React.ComponentPropsWithoutRef<'input'>,
	'type'
> & {
	ref?: React.Ref<HTMLInputElement>;
	passwordPurpose?: PasswordPurpose;
	visibilityToggle?: boolean;
	showLabel?: string;
	hideLabel?: string;
};

function passwordAutoComplete(purpose: PasswordPurpose) {
	return purpose === 'new' ? 'new-password' : 'current-password';
}

function InputPassword({
	ref,
	passwordPurpose = 'current',
	visibilityToggle = true,
	showLabel = 'Show password',
	hideLabel = 'Hide password',
	autoComplete,
	autoCapitalize = 'none',
	autoCorrect = 'off',
	disabled,
	className,
	...props
}: InputPasswordProps) {
	const [visible, setVisible] = React.useState(false);
	const label = visible ? hideLabel : showLabel;
	const type = visible ? 'text' : 'password';
	const resolvedAutoComplete =
		autoComplete ?? passwordAutoComplete(passwordPurpose);

	if (!visibilityToggle) {
		return (
			<Input
				ref={ref}
				type="password"
				autoComplete={resolvedAutoComplete}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				disabled={disabled}
				className={className}
				{...props}
			/>
		);
	}

	return (
		<InputGroup data-disabled={disabled ? true : undefined}>
			<InputGroupInput
				ref={ref}
				type={type}
				autoComplete={resolvedAutoComplete}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				disabled={disabled}
				className={className}
				{...props}
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					type="button"
					size="icon-xs"
					aria-label={label}
					aria-pressed={visible}
					disabled={disabled}
					onMouseDown={(event) => {
						event.preventDefault();
					}}
					onClick={() => {
						setVisible((current) => !current);
					}}
				>
					{visible ? <EyeOffIcon /> : <EyeIcon />}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}

export { InputPassword };
