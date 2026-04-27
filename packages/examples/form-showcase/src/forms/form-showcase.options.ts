import type {
	AutocompleteOption,
	FormOption,
} from '@contractspec/lib.contracts-spec/forms';

export const roleOptions: readonly FormOption[] = [
	{ labelI18n: 'Admin', value: 'admin' },
	{ labelI18n: 'Editor', value: 'editor' },
	{ labelI18n: 'Viewer', value: 'viewer' },
];

export const contactPreferenceOptions: readonly FormOption[] = [
	{ labelI18n: 'Email', value: 'email' },
	{ labelI18n: 'Phone', value: 'phone' },
	{ labelI18n: 'SMS', value: 'sms' },
];

export const countryOptions: readonly FormOption[] = [
	{ labelI18n: 'United States', value: 'US' },
	{ labelI18n: 'France', value: 'FR' },
	{ labelI18n: 'United Kingdom', value: 'GB' },
];

export const reviewerOptions: readonly AutocompleteOption[] = [
	{
		labelI18n: 'Alice Martin',
		value: 'usr_alice',
		data: { id: 'usr_alice', name: 'Alice Martin', email: 'alice@example.com' },
	},
	{
		labelI18n: 'Bob Chen',
		value: 'usr_bob',
		data: { id: 'usr_bob', name: 'Bob Chen', email: 'bob@example.com' },
	},
];
