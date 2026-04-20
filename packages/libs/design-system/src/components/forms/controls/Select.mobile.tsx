import type { FormOption } from '@contractspec/lib.contracts-spec/forms';
import {
	Select as NativeSelectRoot,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@contractspec/lib.ui-kit/ui/select';
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
}: SelectProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Select',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<NativeSelectRoot
			value={
				value == null
					? undefined
					: { value: optionValue(value), label: optionValue(value) }
			}
			onValueChange={(next) => onChange?.(next?.value)}
		>
			<SelectTrigger disabled={disabled} className={themed.className}>
				<SelectValue
					placeholder={translate(placeholderI18n ?? placeholder) ?? ''}
				/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options?.map((option, index) => (
						<SelectItem
							key={`${optionValue(option.value)}-${index}`}
							value={optionValue(option.value)}
							label={
								translate(option.labelI18n) ?? optionValue(option.labelI18n)
							}
							disabled={option.disabled}
						/>
					))}
				</SelectGroup>
			</SelectContent>
		</NativeSelectRoot>
	);
}

export { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue };
