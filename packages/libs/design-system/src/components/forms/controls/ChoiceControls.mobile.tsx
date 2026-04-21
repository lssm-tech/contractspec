import type { FormOption } from '@contractspec/lib.contracts-spec/forms';
import { Checkbox as NativeCheckbox } from '@contractspec/lib.ui-kit/ui/checkbox';
import { Label } from '@contractspec/lib.ui-kit/ui/label';
import {
	RadioGroup as NativeRadioGroup,
	RadioGroupItem,
} from '@contractspec/lib.ui-kit/ui/radio-group';
import { Switch as NativeSwitch } from '@contractspec/lib.ui-kit/ui/switch';
import { HStack, VStack } from '../../layout/Stack';
import { optionValue } from '../../primitives/control';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

export interface CheckboxProps extends ThemedPrimitiveProps {
	checked?: boolean;
	onCheckedChange?: (value: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function Checkbox({
	componentKey,
	themeVariant,
	className,
	checked,
	onCheckedChange,
	...props
}: CheckboxProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Checkbox',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeCheckbox
			{...themed.props}
			{...props}
			className={themed.className}
			checked={Boolean(checked)}
			onCheckedChange={(value) => onCheckedChange?.(Boolean(value))}
		/>
	);
}

export interface SwitchProps extends ThemedPrimitiveProps {
	checked?: boolean;
	onCheckedChange?: (value: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function Switch({
	componentKey,
	themeVariant,
	className,
	checked,
	onCheckedChange,
	...props
}: SwitchProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Switch',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<NativeSwitch
			{...themed.props}
			{...props}
			className={themed.className}
			checked={Boolean(checked)}
			onCheckedChange={(value) => onCheckedChange?.(Boolean(value))}
		/>
	);
}

export interface RadioGroupProps extends ThemedPrimitiveProps {
	options?: FormOption[];
	value?: unknown;
	onValueChange?: (value: unknown) => void;
	disabled?: boolean;
	className?: string;
}

export function RadioGroup({
	options,
	value,
	onValueChange,
	disabled,
	componentKey,
	themeVariant,
	className,
}: RadioGroupProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'RadioGroup',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<NativeRadioGroup
			value={value == null ? '' : optionValue(value)}
			onValueChange={(next) => onValueChange?.(next)}
			disabled={disabled}
			className={themed.className}
		>
			<VStack gap="sm">
				{options?.map((option) => {
					const optionId = optionValue(option.value);
					return (
						<HStack key={optionId} gap="sm" align="center">
							<RadioGroupItem value={optionId} disabled={option.disabled} />
							<Label>{translate(option.labelI18n)}</Label>
						</HStack>
					);
				})}
			</VStack>
		</NativeRadioGroup>
	);
}

export { RadioGroupItem };
