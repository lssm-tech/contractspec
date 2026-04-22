import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	keywords?: string[];
}

export interface ComboboxProps {
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
}

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = 'Select option',
	emptyText = 'No option found.',
	disabled,
	className,
}: ComboboxProps) {
	const selectedOption = options.find((option) => option.value === value);

	return (
		<Select
			value={
				selectedOption
					? { value: selectedOption.value, label: selectedOption.label }
					: undefined
			}
			onValueChange={(next) => {
				if (next) {
					onValueChange?.(next.value);
				}
			}}
			disabled={disabled}
		>
			<SelectTrigger disabled={disabled} className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.length ? (
						options.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								label={option.label}
								disabled={option.disabled}
							/>
						))
					) : (
						<SelectItem value="__empty" label={emptyText} disabled={true} />
					)}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
