'use client';

import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Select as WebSelect,
} from '@contractspec/lib.ui-kit-web/ui/select';
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
	id?: string;
	name?: string;
	className?: string;
}

export function Select({
	options,
	groups,
	value,
	onChange,
	placeholder,
	disabled,
	id,
	name,
	className,
	componentKey,
	themeVariant,
	placeholderI18n,
	...props
}: SelectProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Select',
		componentKey,
		themeVariant,
		className,
	});
	const optionGroups = selectOptionGroups({ options, groups });

	return (
		<WebSelect
			value={value == null ? '' : selectOptionValue(value)}
			onValueChange={(next) => onChange?.(next)}
			disabled={disabled}
			name={name}
			{...props}
		>
			<SelectTrigger id={id} className={themed.className}>
				<SelectValue placeholder={translate(placeholderI18n ?? placeholder)} />
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
									disabled={option.disabled}
								>
									{selectOptionLabel(option, translate)}
								</SelectItem>
							))}
						</SelectGroup>
					);
				})}
			</SelectContent>
		</WebSelect>
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
