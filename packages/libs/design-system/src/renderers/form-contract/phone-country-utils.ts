import type {
	FormOption,
	PhoneCountrySpec,
	PhoneFieldSpec,
} from '@contractspec/lib.contracts-spec/forms';
import getCountryFlag from 'country-flag-icons/unicode';
import {
	type CountryCode,
	getCountries,
	getCountryCallingCode,
} from 'libphonenumber-js/min';

const COUNTRY_CODES = getCountries();

export function normalizeIso2(
	value: string | undefined
): CountryCode | undefined {
	const iso2 = value?.trim().toUpperCase();
	return iso2 && COUNTRY_CODES.includes(iso2 as CountryCode)
		? (iso2 as CountryCode)
		: undefined;
}

export function countryCallingCode(iso2: string | undefined) {
	const country = normalizeIso2(iso2);
	return country ? `+${getCountryCallingCode(country)}` : '';
}

export function countryFlag(iso2: string | undefined) {
	const country = normalizeIso2(iso2);
	return country ? getCountryFlag(country) : '';
}

function allowedCountries(country?: PhoneCountrySpec) {
	const allowed = country?.allowedIso2
		?.map((iso2) => normalizeIso2(iso2))
		.filter((iso2): iso2 is CountryCode => Boolean(iso2));
	return allowed?.length ? allowed : COUNTRY_CODES;
}

export function isAllowedPhoneCountry(
	value: string | undefined,
	country?: PhoneCountrySpec
) {
	const iso2 = normalizeIso2(value);
	return Boolean(iso2 && allowedCountries(country).includes(iso2));
}

export function countryFromCallingCode(
	callingCode: string | undefined,
	country?: PhoneCountrySpec,
	preferredIso2?: string
) {
	const normalized = callingCode?.trim().replace(/^\+/, '');
	if (!normalized) return undefined;
	const countries = allowedCountries(country);
	const preferred = normalizeIso2(preferredIso2);
	if (
		preferred &&
		countries.includes(preferred) &&
		getCountryCallingCode(preferred) === normalized
	) {
		return preferred;
	}
	return countries.find((iso2) => getCountryCallingCode(iso2) === normalized);
}

export function countryFromInput(
	value: string | undefined,
	country?: PhoneCountrySpec,
	preferredIso2?: string
) {
	const trimmed = value?.trim();
	const iso2 = normalizeIso2(trimmed);
	return (
		(iso2 && isAllowedPhoneCountry(iso2, country) ? iso2 : undefined) ??
		countryFromCallingCode(trimmed, country, preferredIso2)
	);
}

export function phoneCountryOptions(
	country?: PhoneCountrySpec,
	display?: Pick<NonNullable<PhoneFieldSpec['display']>, 'flag' | 'callingCode'>
): FormOption[] {
	return allowedCountries(country).map((iso2) => {
		const callingCode = countryCallingCode(iso2);
		const labelParts = [
			display?.flag === false ? undefined : countryFlag(iso2),
			iso2,
			display?.callingCode === false ? undefined : callingCode,
		].filter((part): part is string => Boolean(part));
		return {
			labelI18n: labelParts.join(' '),
			value: iso2,
		};
	});
}
