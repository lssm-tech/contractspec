import {
	Select as NativeSelectRoot,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@contractspec/lib.ui-kit/ui/select';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';
import {
	type FormOption,
	type SelectOptionGroup,
	selectGroupKey,
	selectGroupLabel,
	selectOptionGroups,
	selectOptionLabel,
	selectOptionValue,
} from './select-options';

export interface SelectProps extends ThemedPrimitiveProps {
	options?: readonly FormOption[];
	groups?: readonly SelectOptionGroup[];
	value?: unknown;
	onChange?: (value: unknown) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export function Select({
	options,
	groups,
	value,
	onChange,
	placeholder,
	disabled,
	className,
	componentKey,
	themeVariant,
	placeholderI18n,
}: SelectProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Select',
		componentKey,
		themeVariant,
		className,
	});
	const optionGroups = selectOptionGroups({ options, groups });
	const selectedValue = value == null ? undefined : selectOptionValue(value);
	const selectedOption = optionGroups
		.flatMap((group) => group.options)
		.find((option) => selectOptionValue(option.value) === selectedValue);
	const selectedLabel = selectedOption
		? (selectOptionLabel(selectedOption, translate) ??
			selectOptionValue(selectedOption.value))
		: selectedValue;

	return (
		<NativeSelectRoot
			value={
				selectedValue == null
					? undefined
					: { value: selectedValue, label: selectedLabel ?? selectedValue }
			}
			onValueChange={(next) => onChange?.(next?.value)}
		>
			<SelectTrigger disabled={disabled} className={themed.className}>
				<SelectValue
					placeholder={translate(placeholderI18n ?? placeholder) ?? ''}
				/>
			</SelectTrigger>
			<SelectContent>
				{optionGroups.map((group, groupIndex) => {
					const groupKey = selectGroupKey(group, groupIndex);
					const groupLabel = selectGroupLabel(group, translate);

					return (
						<SelectGroup key={`${groupKey}-${groupIndex}`}>
							{groupLabel ? <SelectLabel>{groupLabel}</SelectLabel> : null}
							{group.options.map((option, optionIndex) => (
								<SelectItem
									key={`${groupKey}-${selectOptionValue(option.value)}-${optionIndex}`}
									value={selectOptionValue(option.value)}
									label={selectOptionLabel(option, translate)}
									disabled={option.disabled}
								/>
							))}
						</SelectGroup>
					);
				})}
			</SelectContent>
		</NativeSelectRoot>
	);
}

export type { SelectOptionGroup };
export {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
};
