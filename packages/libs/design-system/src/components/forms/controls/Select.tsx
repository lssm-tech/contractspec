'use client';

import type { FormOption } from '@contractspec/lib.contracts-spec/forms';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Select as WebSelect,
} from '@contractspec/lib.ui-kit-web/ui/select';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

function optionValue(value: unknown) {
	return typeof value === 'string' ? value : String(value ?? '');
}

export interface SelectProps extends ThemedPrimitiveProps {
	options?: FormOption[];
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
	value,
	onChange,
	placeholder,
	disabled,
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

	return (
		<WebSelect
			value={value == null ? '' : optionValue(value)}
			onValueChange={(next) => onChange?.(next)}
			disabled={disabled}
			{...props}
		>
			<SelectTrigger className={themed.className}>
				<SelectValue placeholder={translate(placeholderI18n ?? placeholder)} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options?.map((option, index) => (
						<SelectItem
							key={`${optionValue(option.value)}-${index}`}
							value={optionValue(option.value)}
							disabled={option.disabled}
						>
							{translate(option.labelI18n) ?? optionValue(option.labelI18n)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</WebSelect>
	);
}

export { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue };
