'use client';

import { shadcnDriver } from '@contractspec/lib.contracts-runtime-client-react/drivers/shadcn';
import { createFormRenderer } from '@contractspec/lib.contracts-runtime-client-react/form-render';
import type {
	AddressFormValue,
	FormOption,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import { Autocomplete } from '../components/forms/controls/Autocomplete';
import {
	Checkbox,
	RadioGroup,
	Switch,
} from '../components/forms/controls/ChoiceControls';
import {
	DatePicker,
	DateTimePicker,
	TimePicker,
} from '../components/forms/controls/DateTimeControls';
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	Field as FieldWrap,
} from '../components/forms/controls/Field';
import { Select } from '../components/forms/controls/Select';
import { HStack, VStack } from '../components/layout/Stack';
import {
	resolveTranslationNode,
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../i18n/translation';

function optionValue(value: unknown) {
	return typeof value === 'string' ? value : String(value ?? '');
}

function inputValue(value: unknown) {
	if (typeof value === 'string') return value;
	if (typeof value === 'object' && value !== null && 'currentTarget' in value) {
		const currentTarget = value.currentTarget;
		if (
			typeof currentTarget === 'object' &&
			currentTarget !== null &&
			'value' in currentTarget
		) {
			return optionValue(currentTarget.value);
		}
	}
	return optionValue(value);
}

const FORM_FALLBACK_TEXT = {
	addressLine1: 'Address line 1',
	addressLine2: 'Address line 2',
	city: 'City',
	countryCode: 'Country code',
	extension: 'Extension',
	phoneNumber: 'Phone number',
	postalCode: 'Postal code',
	region: 'Region',
} as const;

function useTranslateString() {
	const translate = useDesignSystemTranslation();
	return (value: string | undefined) =>
		resolveTranslationString(value, translate);
}

function useTranslateNode() {
	const translate = useDesignSystemTranslation();
	return (value: React.ReactNode) => resolveTranslationNode(value, translate);
}

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
		<VStack gap="sm">
			<Input
				value={props.value?.line1 ?? ''}
				onChange={(event) =>
					props.onChange?.(
						updateAddress(props.value, 'line1', inputValue(event))
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
						updateAddress(props.value, 'line2', inputValue(event))
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
						updateAddress(props.value, 'city', inputValue(event))
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
						updateAddress(props.value, 'region', inputValue(event))
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
						updateAddress(props.value, 'postalCode', inputValue(event))
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
							updateAddress(props.value, 'countryCode', inputValue(event))
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
		</VStack>
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
		<VStack gap="sm">
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
							updatePhone(props.value, 'countryCode', inputValue(event))
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
						updatePhone(props.value, 'nationalNumber', inputValue(event))
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
						updatePhone(props.value, 'extension', inputValue(event))
					)
				}
				placeholder={translate(
					props.parts?.placeholdersI18n?.extension ??
						FORM_FALLBACK_TEXT.extension
				)}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
		</VStack>
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

type TranslatedButtonProps = Omit<
	React.ComponentProps<typeof Button>,
	'onClick' | 'onPress'
> & {
	onClick?: () => void;
	onPress?: () => void;
};

const TranslatedButton = ({
	children,
	onClick,
	onPress,
	...props
}: TranslatedButtonProps) => {
	const translate = useTranslateNode();
	return (
		<Button
			{...(props as React.ComponentProps<typeof Button>)}
			onClick={onClick ? () => onClick() : undefined}
			onPress={onPress ?? onClick}
		>
			{translate(children)}
		</Button>
	);
};

const FormRoot = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="lg" className={className}>
		{children}
	</VStack>
);

const FieldArray = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="md" className={className}>
		{children}
	</VStack>
);

const FieldArrayItem = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<VStack gap="sm" className={className}>
		{children}
	</VStack>
);

const Actions = ({
	children,
	className,
}: React.PropsWithChildren<{ className?: string }>) => (
	<HStack gap="sm" wrap="wrap" className={className}>
		{children}
	</HStack>
);

export const formRenderer = createFormRenderer({
	submitMode: 'button',
	driver: shadcnDriver({
		FormRoot,
		Field: FieldWrap,
		FieldLabel: TranslatedFieldLabel,
		FieldDescription: TranslatedFieldDescription,
		FieldError: TranslatedFieldError,
		FieldGroup,
		FieldSet: (props) => <VStack gap="md" {...props} />,
		FieldLegend: (props) => {
			const translate = useTranslateNode();
			return <Text {...props}>{translate(props.children)}</Text>;
		},
		FieldArray,
		FieldArrayItem,
		Actions,
		Input: TranslatedInput as never,
		Textarea: TranslatedTextarea as never,
		Select,
		Checkbox,
		RadioGroup,
		Switch,
		Autocomplete,
		AddressField,
		PhoneField,
		DateField: DatePicker as never,
		TimeField: TimePicker as never,
		DateTimeField: DateTimePicker as never,
		Button: TranslatedButton as never,
	}),
});
