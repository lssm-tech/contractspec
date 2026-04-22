import * as React from 'react';
import {
	type Option,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

export interface NativeSelectProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	onChange?: (event: { target: { value: string } }) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export interface NativeSelectOptionProps {
	value?: string | number;
	label?: string;
	disabled?: boolean;
	children?: React.ReactNode;
}

export interface NativeSelectOptGroupProps {
	children?: React.ReactNode;
	label?: string;
}

function toOption(value: string | undefined): Option {
	return value == null ? undefined : { value, label: value };
}

function NativeSelect({
	value,
	defaultValue,
	onValueChange,
	onChange,
	placeholder = 'Select option',
	disabled,
	className,
	children,
}: NativeSelectProps) {
	return (
		<Select
			value={toOption(value)}
			defaultValue={toOption(defaultValue)}
			onValueChange={(next) => {
				if (!next) return;
				onValueChange?.(next.value);
				onChange?.({ target: { value: next.value } });
			}}
			disabled={disabled}
		>
			<SelectTrigger disabled={disabled} className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>{children}</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function NativeSelectOption({
	value,
	label,
	children,
	disabled,
}: NativeSelectOptionProps) {
	const nextValue = value == null ? '' : String(value);
	const nextLabel =
		label ?? (typeof children === 'string' ? children : nextValue);

	return <SelectItem value={nextValue} label={nextLabel} disabled={disabled} />;
}

function NativeSelectOptGroup({ children }: NativeSelectOptGroupProps) {
	return <SelectGroup>{children}</SelectGroup>;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
