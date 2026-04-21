'use client';

import type { AutocompleteOption } from '@contractspec/lib.contracts-spec/forms';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@contractspec/lib.ui-kit-web/ui/command';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { Button } from '../../atoms/Button';
import { HStack, VStack } from '../../layout/Stack';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

function optionValue(value: unknown) {
	return typeof value === 'string' ? value : String(value ?? '');
}

export interface AutocompleteProps extends ThemedPrimitiveProps {
	query: string;
	options: AutocompleteOption[];
	selectedOptions: AutocompleteOption[];
	onQueryChange?: (query: string) => void;
	onSelectOption?: (option: AutocompleteOption) => void;
	onRemoveOption?: (option: AutocompleteOption) => void;
	multiple?: boolean;
	placeholder?: string;
	readOnly?: boolean;
	disabled?: boolean;
	className?: string;
	emptyText?: string;
}

export function Autocomplete({
	query,
	options,
	selectedOptions,
	onQueryChange,
	onSelectOption,
	onRemoveOption,
	multiple,
	placeholder,
	placeholderI18n,
	readOnly,
	disabled,
	className,
	componentKey,
	themeVariant,
	emptyText = 'No results found.',
}: AutocompleteProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Autocomplete',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<VStack gap="sm" className={themed.className}>
			<Command shouldFilter={false} className="rounded-md border border-input">
				<CommandInput
					value={query}
					onValueChange={onQueryChange}
					placeholder={translate(placeholderI18n ?? placeholder)}
					disabled={disabled || readOnly}
				/>
				<CommandList>
					<CommandEmpty>{translate(emptyText)}</CommandEmpty>
					<CommandGroup>
						{options.map((option) => {
							const selected = selectedOptions.some(
								(item) => optionValue(item.value) === optionValue(option.value)
							);
							return (
								<CommandItem
									key={optionValue(option.value)}
									value={translate(option.labelI18n) ?? option.labelI18n}
									onSelect={() => onSelectOption?.(option)}
									disabled={disabled || option.disabled || readOnly}
								>
									<VStack gap="xs">
										<Text>{translate(option.labelI18n)}</Text>
										{option.descriptionI18n ? (
											<Text className="text-muted-foreground text-xs">
												{translate(option.descriptionI18n)}
											</Text>
										) : null}
									</VStack>
									{selected ? (
										<Text className="ml-auto text-muted-foreground text-xs">
											{translate('Selected')}
										</Text>
									) : null}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</Command>
			{selectedOptions.length ? (
				<HStack gap="sm" wrap="wrap">
					{selectedOptions.map((option) => (
						<Button
							key={`selected-${optionValue(option.value)}`}
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onRemoveOption?.(option)}
							disabled={!multiple || readOnly || disabled}
						>
							{translate(option.labelI18n)}
						</Button>
					))}
				</HStack>
			) : null}
		</VStack>
	);
}
