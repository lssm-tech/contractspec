import { describe, expect, it } from 'bun:test';
import {
	countryFlag,
	countryFromInput,
	phoneCountryOptions,
} from './phone-country-utils';
import { normalizePhoneForDisplay, parsePhoneInput } from './phone-utils';

describe('phone form-contract helpers', () => {
	it('normalizes E.164 values into country metadata for flags', () => {
		const value = normalizePhoneForDisplay(
			{ countryCode: '', nationalNumber: '', e164: '+33612345678' },
			{ defaultIso2: 'US' }
		);

		expect(value.countryIso2).toBe('FR');
		expect(value.countryCode).toBe('+33');
		expect(value.nationalNumber).toBe('612345678');
		expect(countryFlag(value.countryIso2)).toBe('🇫🇷');
	});

	it('detects countries from typed international numbers and calling codes', () => {
		const current = normalizePhoneForDisplay(null, { defaultIso2: 'US' });
		const value = parsePhoneInput('+33612345678', current, {
			defaultIso2: 'US',
		});

		expect(value.countryIso2).toBe('FR');
		expect(value.countryCode).toBe('+33');
		expect(value.e164).toBe('+33612345678');
		expect(countryFromInput('+33', undefined, 'US')).toBe('FR');
	});

	it('derives E.164 from ISO2 country output without leaking ISO text into the number', () => {
		const value = normalizePhoneForDisplay(
			{
				countryCode: 'FR',
				countryIso2: 'FR',
				nationalNumber: '6 12 34 56 78',
			},
			{ defaultIso2: 'US' },
			'iso2'
		);

		expect(value.countryCode).toBe('FR');
		expect(value.countryIso2).toBe('FR');
		expect(value.e164).toBe('+33612345678');
	});

	it('does not auto-switch to a country outside the allowed country list', () => {
		const current = normalizePhoneForDisplay(null, {
			defaultIso2: 'US',
			allowedIso2: ['US'],
		});
		const value = parsePhoneInput('+33612345678', current, {
			defaultIso2: 'US',
			allowedIso2: ['US'],
		});

		expect(value.countryIso2).toBe('US');
		expect(value.countryCode).toBe('+1');
		expect(value.nationalNumber).toBe('+33612345678');
		expect(value.e164).toBeUndefined();
		expect(countryFromInput('FR', { allowedIso2: ['US'] })).toBeUndefined();
	});

	it('builds country option labels from the requested display parts', () => {
		const [option] = phoneCountryOptions(
			{ allowedIso2: ['FR'] },
			{ flag: true, callingCode: true }
		);
		const [compactOption] = phoneCountryOptions(
			{ allowedIso2: ['FR'] },
			{ flag: false, callingCode: false }
		);

		expect(option?.labelI18n).toBe('🇫🇷 FR +33');
		expect(compactOption?.labelI18n).toBe('FR');
	});
});
