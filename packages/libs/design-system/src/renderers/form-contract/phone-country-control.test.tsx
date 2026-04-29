import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { PhoneCountryControl } from './phone-country-control';
import { phoneCountryOptions } from './phone-country-utils';

describe('PhoneCountryControl', () => {
	it('renders country selects without duplicate external adornments', () => {
		const html = renderToStaticMarkup(
			<PhoneCountryControl
				id="phone-country"
				name="phone.countryCode"
				countryCode="+33"
				countryIso2="FR"
				selectValue="FR"
				selectOptions={phoneCountryOptions(
					{ defaultIso2: 'FR', detection: 'input' },
					{ flag: true, callingCode: true }
				)}
				display={{
					flag: true,
					callingCode: true,
					countrySelect: true,
					extension: true,
				}}
				onCountryChange={() => undefined}
			/>
		);

		expect(html).toContain('id="phone-country"');
		expect(html).not.toContain('aria-label="FR"');
		expect(html).not.toContain('min-w-12 text-muted-foreground text-sm');
	});
});
