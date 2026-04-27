'use client';

import type { AutocompleteOption } from '@contractspec/lib.contracts-spec/forms';
import { Combobox } from '@contractspec/lib.ui-kit-web/ui/combobox';
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
	id?: string;
	name?: string;
	'aria-invalid'?: boolean;
	'aria-describedby'?: string;
}

function mergeOptions(
	options: readonly AutocompleteOption[],
	selectedOptions: readonly AutocompleteOption[]
) {
	const seen = new Set<string>();
	const merged: AutocompleteOption[] = [];
	for (const option of [...selectedOptions, ...options]) {
		const key = optionValue(option.value);
		if (seen.has(key)) continue;
		seen.add(key);
		merged.push(option);
	}
	return merged;
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
	id,
	name,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
}: AutocompleteProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Autocomplete',
		componentKey,
		themeVariant,
		className,
	});
	const mergedOptions = mergeOptions(options, selectedOptions);
	const optionByValue = new Map(
		mergedOptions.map((option) => [optionValue(option.value), option])
	);

	return (
		<Combobox
			{...themed.props}
			id={id}
			name={name}
			className={themed.className}
			options={mergedOptions.map((option) => ({
				value: optionValue(option.value),
				label: translate(option.labelI18n) ?? option.labelI18n,
				description: option.descriptionI18n
					? (translate(option.descriptionI18n) ?? option.descriptionI18n)
					: undefined,
				disabled: option.disabled,
			}))}
			value={
				multiple ? undefined : optionValue(selectedOptions[0]?.value ?? '')
			}
			selectedValues={
				multiple
					? selectedOptions.map((option) => optionValue(option.value))
					: undefined
			}
			query={query}
			onQueryChange={onQueryChange}
			onValueChange={(nextValue) => {
				const option = optionByValue.get(nextValue);
				if (option) {
					onSelectOption?.(option);
				}
			}}
			onRemoveValue={(nextValue) => {
				const option = optionByValue.get(nextValue);
				if (option) {
					onRemoveOption?.(option);
				}
			}}
			multiple={multiple}
			placeholder={translate(placeholderI18n ?? placeholder)}
			searchPlaceholder={translate(placeholderI18n ?? placeholder)}
			emptyText={translate(emptyText)}
			loadingText={translate(loadingText)}
			errorText={translate(errorText)}
			loading={loading}
			error={error ? translate(error) : null}
			readOnly={readOnly}
			disabled={disabled}
			aria-invalid={ariaInvalid}
			aria-describedby={ariaDescribedBy}
		/>
	);
}
