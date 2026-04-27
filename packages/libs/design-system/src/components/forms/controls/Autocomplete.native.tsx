import type { AutocompleteOption } from '@contractspec/lib.contracts-spec/forms';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
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
	loadingText?: string;
	errorText?: string;
	loading?: boolean;
	error?: string | null;
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
	loadingText = 'Loading options...',
	errorText = 'Unable to load options.',
	loading,
	error,
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
			<Input
				value={query}
				onChange={(value) => {
					if (typeof value === 'string') {
						onQueryChange?.(value);
					}
				}}
				placeholder={translate(placeholderI18n ?? placeholder)}
				disabled={disabled || readOnly}
			/>
			<VStack gap="xs">
				{loading ? (
					<Text>{translate(loadingText)}</Text>
				) : error ? (
					<Text>{translate(error) ?? translate(errorText)}</Text>
				) : options.length ? (
					options.map((option) => (
						<Button
							key={optionValue(option.value)}
							variant="ghost"
							onPress={() => onSelectOption?.(option)}
							disabled={disabled || option.disabled || readOnly}
						>
							<Text>{translate(option.labelI18n)}</Text>
						</Button>
					))
				) : (
					<Text>{translate(emptyText)}</Text>
				)}
			</VStack>
			{selectedOptions.length ? (
				<HStack gap="sm" wrap="wrap">
					{selectedOptions.map((option) => (
						<Button
							key={`selected-${optionValue(option.value)}`}
							variant="outline"
							size="sm"
							onPress={() => onRemoveOption?.(option)}
							disabled={!multiple || readOnly || disabled}
						>
							<Text>{translate(option.labelI18n)}</Text>
						</Button>
					))}
				</HStack>
			) : null}
		</VStack>
	);
}
