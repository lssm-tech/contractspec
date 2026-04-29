import type {
	PhoneCountryCodeFormat,
	PhoneCountrySpec,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import {
	countryCallingCode,
	countryFromCallingCode,
	isAllowedPhoneCountry,
	normalizeIso2,
} from './phone-country-utils';

function phoneWithE164(value: PhoneFormValue): PhoneFormValue {
	const nationalDigits = value.nationalNumber.replace(/\D+/g, '');
	const trimmedNational = value.nationalNumber.trim();
	const normalizedCountryCode = value.countryCode.trim();
	const callingCode =
		normalizedCountryCode.startsWith('+') || /^\d+$/.test(normalizedCountryCode)
			? normalizedCountryCode.replace(/^\+?/, '+')
			: countryCallingCode(value.countryIso2);
	return {
		...value,
		e164:
			value.e164 ??
			(callingCode && nationalDigits && !trimmedNational.startsWith('+')
				? `${callingCode}${nationalDigits}`
				: undefined),
	};
}

export function normalizePhoneForDisplay(
	value: PhoneFormValue | null | undefined,
	country?: PhoneCountrySpec,
	format?: PhoneCountryCodeFormat
): PhoneFormValue {
	const parsed = value?.e164
		? parsePhoneNumberFromString(value.e164)
		: undefined;
	const parsedPhone =
		parsed?.country && !isAllowedPhoneCountry(parsed.country, country)
			? undefined
			: parsed;
	const valueCountry = normalizeIso2(value?.countryIso2);
	const codeCountry =
		format === 'iso2'
			? normalizeIso2(value?.countryCode)
			: countryFromCallingCode(value?.countryCode, country, valueCountry);
	const countryIso2 =
		valueCountry ??
		parsedPhone?.country ??
		codeCountry ??
		normalizeIso2(country?.defaultIso2);
	const countryCode =
		format === 'iso2'
			? (countryIso2 ?? value?.countryCode ?? '')
			: value?.countryCode?.startsWith('+')
				? value.countryCode
				: countryCallingCode(countryIso2);

	return phoneWithE164({
		countryCode,
		countryIso2,
		nationalNumber: parsedPhone?.nationalNumber ?? value?.nationalNumber ?? '',
		extension: parsedPhone?.ext ?? value?.extension,
		e164: parsedPhone?.number ?? value?.e164,
	});
}

export function parsePhoneInput(
	input: string,
	current: PhoneFormValue,
	country?: PhoneCountrySpec,
	format?: PhoneCountryCodeFormat
): PhoneFormValue {
	const parsed = parsePhoneNumberFromString(
		input,
		normalizeIso2(current.countryIso2 ?? country?.defaultIso2)
	);
	if (
		!parsed ||
		(parsed.country && !isAllowedPhoneCountry(parsed.country, country))
	) {
		return normalizePhoneForDisplay(
			{ ...current, nationalNumber: input, e164: undefined },
			country,
			format
		);
	}
	return normalizePhoneForDisplay(
		{
			countryCode:
				format === 'iso2'
					? (parsed.country ?? current.countryIso2 ?? '')
					: `+${parsed.countryCallingCode}`,
			countryIso2: parsed.country ?? current.countryIso2,
			nationalNumber: parsed.nationalNumber,
			extension: parsed.ext,
			e164: parsed.number,
		},
		country,
		format
	);
}
