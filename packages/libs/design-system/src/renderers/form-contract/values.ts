import type {
	AddressFormValue,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';

export const FORM_FALLBACK_TEXT = {
	addressLine1: 'Address line 1',
	addressLine2: 'Address line 2',
	city: 'City',
	countryCode: 'Country code',
	extension: 'Extension',
	phoneNumber: 'Phone number',
	postalCode: 'Postal code',
	region: 'Region',
} as const;

export function updateAddress(
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

export function updatePhone(
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
