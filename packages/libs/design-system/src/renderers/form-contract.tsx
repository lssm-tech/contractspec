'use client';

import { shadcnDriver } from '@contractspec/lib.contracts-runtime-client-react/drivers/shadcn';
import { createFormRenderer } from '@contractspec/lib.contracts-runtime-client-react/form-render';
import type {
	AddressFormValue,
	AutocompleteOption,
	FormOption,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';
import { Checkbox as CheckboxUiKit } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@contractspec/lib.ui-kit-web/ui/command';
import { DatePicker } from '@contractspec/lib.ui-kit-web/ui/date-picker';
import { DateTimePicker } from '@contractspec/lib.ui-kit-web/ui/datetime-picker';
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	Field as FieldWrap,
} from '@contractspec/lib.ui-kit-web/ui/field';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
	RadioGroupItem,
	RadioGroup as RadioGroupUiKit,
} from '@contractspec/lib.ui-kit-web/ui/radio-group';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	Select as SelectUiKit,
	SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import { Switch as SwitchUiKit } from '@contractspec/lib.ui-kit-web/ui/switch';
import { TimePicker } from '@contractspec/lib.ui-kit-web/ui/time-picker';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import {
	resolveTranslationNode,
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../i18n/translation';

function optionValue(value: unknown) {
	return typeof value === 'string' ? value : String(value ?? '');
}

const FORM_FALLBACK_TEXT = {
	addressLine1: 'Address line 1',
	addressLine2: 'Address line 2',
	city: 'City',
	countryCode: 'Country code',
	extension: 'Extension',
	noResultsFound: 'No results found.',
	phoneNumber: 'Phone number',
	postalCode: 'Postal code',
	region: 'Region',
	search: 'Search',
	selected: 'Selected',
} as const;

function useTranslateString() {
	const translate = useDesignSystemTranslation();
	return (value: string | undefined) =>
		resolveTranslationString(value, translate);
}

function translateWithFallback(
	translate: (value: string | undefined) => string | undefined,
	value: string | undefined,
	fallback: string
) {
	return translate(value) ?? fallback;
}

function useTranslateNode() {
	const translate = useDesignSystemTranslation();
	return (value: React.ReactNode) => resolveTranslationNode(value, translate);
}

const Select = (props: {
	options?: FormOption[];
	value?: unknown;
	onChange?: (value: unknown) => void;
	placeholder?: string;
	disabled?: boolean;
	id?: string;
	name?: string;
}) => {
	const translate = useTranslateString();
	const { options, value, onChange, placeholder, ...rest } = props;
	return (
		<SelectUiKit
			value={value == null ? '' : optionValue(value)}
			onValueChange={(next) => onChange?.(next)}
			{...rest}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder={translate(placeholder)} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options?.map((option, index) => (
						<SelectItem
							key={`${optionValue(option.value)}-${index}`}
							value={optionValue(option.value)}
							disabled={option.disabled}
						>
							{translate(option.labelI18n)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</SelectUiKit>
	);
};

const Checkbox = (props: {
	checked?: boolean;
	onCheckedChange?: (value: boolean) => void;
}) => (
	<CheckboxUiKit
		checked={Boolean(props.checked)}
		onCheckedChange={(value) => props.onCheckedChange?.(Boolean(value))}
	/>
);

const RadioGroup = (props: {
	options?: FormOption[];
	value?: unknown;
	onValueChange?: (value: unknown) => void;
	disabled?: boolean;
}) => {
	const translate = useTranslateString();
	return (
		<RadioGroupUiKit
			value={props.value == null ? '' : optionValue(props.value)}
			onValueChange={(value) => props.onValueChange?.(value)}
			disabled={props.disabled}
		>
			{props.options?.map((option) => {
				const value = optionValue(option.value);
				return (
					<div key={value} className="flex items-center gap-3">
						<RadioGroupItem value={value} id={value} />
						<Label htmlFor={value}>{translate(option.labelI18n)}</Label>
					</div>
				);
			})}
		</RadioGroupUiKit>
	);
};

const Switch = (props: {
	checked?: boolean;
	onCheckedChange?: (value: boolean) => void;
}) => (
	<SwitchUiKit
		checked={Boolean(props.checked)}
		onCheckedChange={(value) => props.onCheckedChange?.(Boolean(value))}
	/>
);

const Autocomplete = (props: {
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
}) => {
	const translate = useTranslateString();
	return (
		<div className="space-y-2">
			<Command shouldFilter={false} className="rounded-md border border-input">
				<CommandInput
					value={props.query}
					onValueChange={props.onQueryChange}
					placeholder={translateWithFallback(
						translate,
						props.placeholder,
						FORM_FALLBACK_TEXT.search
					)}
					disabled={props.disabled || props.readOnly}
				/>
				<CommandList>
					<CommandEmpty>
						{translateWithFallback(
							translate,
							FORM_FALLBACK_TEXT.noResultsFound,
							FORM_FALLBACK_TEXT.noResultsFound
						)}
					</CommandEmpty>
					<CommandGroup>
						{props.options.map((option) => {
							const selected = props.selectedOptions.some(
								(item) => optionValue(item.value) === optionValue(option.value)
							);
							return (
								<CommandItem
									key={optionValue(option.value)}
									value={translate(option.labelI18n) ?? option.labelI18n}
									onSelect={() => props.onSelectOption?.(option)}
									disabled={props.disabled || option.disabled || props.readOnly}
								>
									<div className="flex flex-col">
										<span>{translate(option.labelI18n)}</span>
										{option.descriptionI18n ? (
											<span className="text-muted-foreground text-xs">
												{translate(option.descriptionI18n)}
											</span>
										) : null}
									</div>
									{selected ? (
										<span className="ml-auto text-muted-foreground text-xs">
											{translateWithFallback(
												translate,
												FORM_FALLBACK_TEXT.selected,
												FORM_FALLBACK_TEXT.selected
											)}
										</span>
									) : null}
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</Command>
			{props.selectedOptions.length ? (
				<div className="flex flex-wrap gap-2">
					{props.selectedOptions.map((option) => (
						<Button
							key={`selected-${optionValue(option.value)}`}
							type="button"
							variant="outline"
							size="sm"
							onClick={() => props.onRemoveOption?.(option)}
							disabled={!props.multiple || props.readOnly || props.disabled}
						>
							{translate(option.labelI18n)}
						</Button>
					))}
				</div>
			) : null}
		</div>
	);
};

function updateAddress(
	value: AddressFormValue | null | undefined,
	key: keyof AddressFormValue,
	next: string
) {
	return {
		line1: value?.line1 ?? '',
		line2: value?.line2,
		city: value?.city,
		region: value?.region,
		postalCode: value?.postalCode,
		countryCode: value?.countryCode,
		[key]: next,
	} satisfies AddressFormValue;
}

const AddressField = (props: {
	value?: AddressFormValue | null;
	onChange?: (value: AddressFormValue) => void;
	parts?: {
		labelsI18n?: Partial<Record<keyof AddressFormValue, string>>;
		placeholdersI18n?: Partial<Record<keyof AddressFormValue, string>>;
	};
	countryOptions?: FormOption[];
	readOnly?: boolean;
	disabled?: boolean;
}) => {
	const translate = useTranslateString();
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<Input
				value={props.value?.line1 ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'line1', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.line1 ??
						FORM_FALLBACK_TEXT.addressLine1
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.line2 ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'line2', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.line2 ??
						FORM_FALLBACK_TEXT.addressLine2
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.city ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'city', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.city ?? FORM_FALLBACK_TEXT.city
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.region ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'region', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.region ?? FORM_FALLBACK_TEXT.region
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.postalCode ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'postalCode', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.postalCode ??
						FORM_FALLBACK_TEXT.postalCode
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			{props.countryOptions?.length ? (
				<Select
					value={props.value?.countryCode ?? ''}
					onChange={(value) =>
						props.onChange?.(
							updateAddress(props.value, 'countryCode', optionValue(value))
						)
					}
					options={props.countryOptions}
					disabled={props.disabled || props.readOnly}
				/>
			) : (
				<Input
					value={props.value?.countryCode ?? ''}
					onChange={(event) =>
						props.onChange?.(
							updateAddress(
								props.value,
								'countryCode',
								event.currentTarget.value
							)
						)
					}
					placeholder={translate(
						props.parts?.placeholdersI18n?.countryCode ??
							FORM_FALLBACK_TEXT.countryCode
					)}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			)}
		</div>
	);
};

function updatePhone(
	value: PhoneFormValue | null | undefined,
	key: keyof PhoneFormValue,
	next: string
) {
	return {
		countryCode: value?.countryCode ?? '',
		nationalNumber: value?.nationalNumber ?? '',
		extension: value?.extension,
		e164: value?.e164,
		[key]: next,
	} satisfies PhoneFormValue;
}

const PhoneField = (props: {
	value?: PhoneFormValue | null;
	onChange?: (value: PhoneFormValue) => void;
	parts?: {
		labelsI18n?: Partial<Record<keyof PhoneFormValue, string>>;
		placeholdersI18n?: Partial<Record<keyof PhoneFormValue, string>>;
	};
	countryOptions?: FormOption[];
	readOnly?: boolean;
	disabled?: boolean;
}) => {
	const translate = useTranslateString();
	return (
		<div className="grid gap-3 md:grid-cols-3">
			{props.countryOptions?.length ? (
				<Select
					value={props.value?.countryCode ?? ''}
					onChange={(value) =>
						props.onChange?.(
							updatePhone(props.value, 'countryCode', optionValue(value))
						)
					}
					options={props.countryOptions}
					disabled={props.disabled || props.readOnly}
				/>
			) : (
				<Input
					value={props.value?.countryCode ?? ''}
					onChange={(event) =>
						props.onChange?.(
							updatePhone(props.value, 'countryCode', event.currentTarget.value)
						)
					}
					placeholder={translate(
						props.parts?.placeholdersI18n?.countryCode ??
							FORM_FALLBACK_TEXT.countryCode
					)}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			)}
			<Input
				value={props.value?.nationalNumber ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updatePhone(
							props.value,
							'nationalNumber',
							event.currentTarget.value
						)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.nationalNumber ??
						FORM_FALLBACK_TEXT.phoneNumber
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			<Input
				value={props.value?.extension ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updatePhone(props.value, 'extension', event.currentTarget.value)
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.extension ??
						FORM_FALLBACK_TEXT.extension
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
		</div>
	);
};

const DateField = (props: {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	placeholder?: string;
	minDate?: Date;
	maxDate?: Date;
}) => {
	const translate = useTranslateString();
	return (
		<DatePicker
			value={props.value ?? null}
			onChange={props.onChange ?? (() => undefined)}
			disabled={props.disabled}
			placeholder={translate(props.placeholder)}
			minDate={props.minDate}
			maxDate={props.maxDate}
		/>
	);
};

const TimeField = (props: {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	placeholder?: string;
	is24Hour?: boolean;
}) => {
	const translate = useTranslateString();
	return (
		<TimePicker
			value={props.value ?? null}
			onChange={props.onChange ?? (() => undefined)}
			disabled={props.disabled}
			placeholder={translate(props.placeholder)}
			is24Hour={props.is24Hour}
		/>
	);
};

const DateTimeField = (props: {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	disabled?: boolean;
	datePlaceholder?: string;
	timePlaceholder?: string;
	minDate?: Date;
	maxDate?: Date;
	is24Hour?: boolean;
}) => {
	const translate = useTranslateString();
	return (
		<DateTimePicker
			value={props.value ?? null}
			onChange={props.onChange ?? (() => undefined)}
			disabled={props.disabled}
			datePlaceholder={translate(props.datePlaceholder)}
			timePlaceholder={translate(props.timePlaceholder)}
			minDate={props.minDate}
			maxDate={props.maxDate}
			is24Hour={props.is24Hour}
		/>
	);
};

const TranslatedFieldLabel = (
	props: React.ComponentProps<typeof FieldLabel>
) => {
	const translate = useTranslateNode();
	return <FieldLabel {...props}>{translate(props.children)}</FieldLabel>;
};

const TranslatedFieldDescription = (
	props: React.ComponentProps<typeof FieldDescription>
) => {
	const translate = useTranslateNode();
	return (
		<FieldDescription {...props}>{translate(props.children)}</FieldDescription>
	);
};

const TranslatedFieldError = (
	props: React.ComponentProps<typeof FieldError>
) => {
	const translate = useTranslateNode();
	return <FieldError {...props}>{translate(props.children)}</FieldError>;
};

const TranslatedInput = (props: React.ComponentProps<typeof Input>) => {
	const translate = useTranslateString();
	return <Input {...props} placeholder={translate(props.placeholder)} />;
};

const TranslatedTextarea = (props: React.ComponentProps<typeof Textarea>) => {
	const translate = useTranslateString();
	return <Textarea {...props} placeholder={translate(props.placeholder)} />;
};

const TranslatedButton = (props: React.ComponentProps<typeof Button>) => {
	const translate = useTranslateNode();
	return <Button {...props}>{translate(props.children)}</Button>;
};

export const formRenderer = createFormRenderer({
	driver: shadcnDriver({
		Field: FieldWrap,
		FieldLabel: TranslatedFieldLabel,
		FieldDescription: TranslatedFieldDescription,
		FieldError: TranslatedFieldError,
		FieldGroup,
		FieldSet: (props) => <fieldset {...props} />,
		FieldLegend: (props) => {
			const translate = useTranslateNode();
			return <legend {...props}>{translate(props.children)}</legend>;
		},
		Input: TranslatedInput as never,
		Textarea: TranslatedTextarea as never,
		Select,
		Checkbox,
		RadioGroup,
		Switch,
		Autocomplete,
		AddressField,
		PhoneField,
		DateField,
		TimeField,
		DateTimeField,
		Button: TranslatedButton as never,
	}),
});
