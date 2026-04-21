'use client';

import type { FormOption } from '@contractspec/lib.contracts-spec/forms';
import { Checkbox as WebCheckbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
	RadioGroupItem,
	RadioGroup as WebRadioGroup,
} from '@contractspec/lib.ui-kit-web/ui/radio-group';
import { Switch as WebSwitch } from '@contractspec/lib.ui-kit-web/ui/switch';
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
		<WebCheckbox
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
		<WebSwitch
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
		<WebRadioGroup
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
							<RadioGroupItem
								value={optionId}
								id={optionId}
								disabled={option.disabled}
							/>
							<Label htmlFor={optionId}>{translate(option.labelI18n)}</Label>
						</HStack>
					);
				})}
			</VStack>
		</WebRadioGroup>
	);
}

export { RadioGroupItem };
