import type {
	FormOption,
	PhoneFieldSpec,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';
import { Input } from '../../components/atoms/Input';
import { HStack, VStack } from '../../components/layout/Stack';
import { inputValue } from '../../components/primitives/control';
import { useTranslatedText } from '../../components/primitives/themed';
import { PhoneCountryControl, PhoneFlag } from './phone-country-control';
import {
	countryCallingCode,
	countryFromInput,
	phoneCountryOptions,
} from './phone-country-utils';
import { normalizePhoneForDisplay, parsePhoneInput } from './phone-utils';
import { FORM_FALLBACK_TEXT } from './values';

export interface PhoneFieldProps {
	id?: string;
	name?: string;
	'aria-invalid'?: boolean;
	'aria-describedby'?: string;
	value?: PhoneFormValue | null;
	onChange?: (value: PhoneFormValue) => void;
	parts?: PhoneFieldSpec['parts'];
	countryOptions?: FormOption[];
	input?: PhoneFieldSpec['input'];
	output?: PhoneFieldSpec['output'];
	country?: PhoneFieldSpec['country'];
	display?: PhoneFieldSpec['display'];
	readOnly?: boolean;
	disabled?: boolean;
}

export const PhoneField = (props: PhoneFieldProps) => {
	const translate = useTranslatedText();
	const inputMode = props.input?.mode ?? 'split';
	const autoSwitch = props.input?.autoSwitch ?? true;
	const countryDetection = props.country?.detection ?? 'input';
	const outputFormat = props.output?.countryCodeFormat;
	const display = {
		flag: props.display?.flag ?? true,
		callingCode: props.display?.callingCode ?? true,
		countrySelect: props.display?.countrySelect ?? true,
		extension: props.display?.extension ?? true,
	};
	const value = normalizePhoneForDisplay(
		props.value,
		props.country,
		outputFormat
	);
	const selectedIso2 = value.countryIso2;
	const selectOptions = props.countryOptions?.length
		? props.countryOptions
		: phoneCountryOptions(props.country, display);
	const selectedCountryValue = selectOptions.some(
		(option) => String(option.value).toUpperCase() === selectedIso2
	)
		? selectedIso2
		: value.countryCode;

	const commit = (next: PhoneFormValue) => {
		props.onChange?.(
			normalizePhoneForDisplay(next, props.country, outputFormat)
		);
	};
	const commitCountry = (raw: string) => {
		const countryIso2 = countryFromInput(raw, props.country, selectedIso2);
		commit({
			...value,
			countryIso2,
			countryCode:
				outputFormat === 'iso2'
					? (countryIso2 ?? raw)
					: countryCallingCode(countryIso2) || raw,
			e164: undefined,
		});
	};
	const commitNational = (raw: string) => {
		if (
			autoSwitch &&
			countryDetection === 'input' &&
			raw.trim().startsWith('+')
		) {
			commit(parsePhoneInput(raw, value, props.country, outputFormat));
			return;
		}
		commit({ ...value, nationalNumber: raw, e164: undefined });
	};
	const singleValue =
		value.e164 || `${value.countryCode}${value.nationalNumber}`;
	const countryControl = (
		<PhoneCountryControl
			id={props.id ? `${props.id}-country` : undefined}
			name={props.name ? `${props.name}.countryCode` : undefined}
			countryCode={value.countryCode}
			countryIso2={selectedIso2}
			selectValue={selectedCountryValue}
			selectOptions={selectOptions}
			parts={props.parts}
			display={display}
			disabled={props.disabled}
			readOnly={props.readOnly}
			onCountryChange={commitCountry}
		/>
	);

	if (inputMode === 'single') {
		return (
			<VStack gap="sm">
				<HStack align="center" gap="sm">
					<PhoneFlag iso2={selectedIso2} hidden={!display.flag} />
					<Input
						id={props.id}
						name={props.name}
						value={singleValue}
						onChange={(event) => {
							const next = inputValue(event);
							if (
								autoSwitch &&
								countryDetection === 'input' &&
								next.trim().startsWith('+')
							) {
								commit(
									parsePhoneInput(next, value, props.country, outputFormat)
								);
								return;
							}
							commit({ ...value, nationalNumber: next, e164: undefined });
						}}
						placeholder={translate(
							props.parts?.placeholdersI18n?.nationalNumber ??
								FORM_FALLBACK_TEXT.phoneNumber
						)}
						keyboard={{ kind: 'phone', autoComplete: 'tel' }}
						aria-invalid={props['aria-invalid']}
						aria-describedby={props['aria-describedby']}
						readOnly={props.readOnly}
						disabled={props.disabled}
					/>
				</HStack>
			</VStack>
		);
	}

	return (
		<VStack gap="sm">
			{countryControl}
			<Input
				id={props.id}
				name={props.name}
				value={value.nationalNumber}
				onChange={(event) => commitNational(inputValue(event))}
				placeholder={translate(
					props.parts?.placeholdersI18n?.nationalNumber ??
						FORM_FALLBACK_TEXT.phoneNumber
				)}
				keyboard={{ kind: 'phone', autoComplete: 'tel-national' }}
				aria-invalid={props['aria-invalid']}
				aria-describedby={props['aria-describedby']}
				readOnly={props.readOnly}
				disabled={props.disabled}
			/>
			{display.extension ? (
				<Input
					id={props.id ? `${props.id}-extension` : undefined}
					name={props.name ? `${props.name}.extension` : undefined}
					value={value.extension ?? ''}
					onChange={(event) =>
						commit({ ...value, extension: inputValue(event) })
					}
					placeholder={translate(
						props.parts?.placeholdersI18n?.extension ??
							FORM_FALLBACK_TEXT.extension
					)}
					keyboard={{ kind: 'number' }}
					aria-label={translate(FORM_FALLBACK_TEXT.extension)}
					readOnly={props.readOnly}
					disabled={props.disabled}
				/>
			) : null}
		</VStack>
	);
};
