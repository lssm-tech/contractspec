import {
	defineFormSpec,
	responsiveFormColumns,
} from '@contractspec/lib.contracts-spec/forms';
import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { FormShowcaseAllFieldsModel } from './form-showcase.models';
import {
	contactPreferenceOptions,
	countryOptions,
	reviewerOptions,
	roleOptions,
} from './form-showcase.options';

export const FormShowcaseAllFieldsForm = defineFormSpec({
	meta: {
		key: 'examples.form-showcase.all-fields',
		version: '1.0.0',
		title: 'Form Showcase All Fields',
		description:
			'Complete form-only showcase covering every current ContractSpec field kind and common render metadata.',
		domain: 'examples.forms',
		owners: [OwnersEnum.PlatformCore],
		tags: ['examples', 'forms', 'template', 'all-fields'],
		stability: StabilityEnum.Stable,
	},
	model: FormShowcaseAllFieldsModel,
	layout: {
		columns: responsiveFormColumns(2),
		gap: 'lg',
		flow: {
			kind: 'sections',
			sections: [
				{
					key: 'identity',
					titleI18n: 'Identity',
					fieldNames: ['recordId', 'fullName', 'email', 'username', 'bio'],
					layout: { columns: responsiveFormColumns(2), gap: 'md' },
				},
				{
					key: 'preferences',
					titleI18n: 'Preferences',
					fieldNames: [
						'role',
						'contactPreference',
						'acceptTerms',
						'marketingOptIn',
					],
				},
				{
					key: 'rich-fields',
					titleI18n: 'Rich fields',
					fieldNames: ['reviewer', 'mailingAddress', 'phone'],
					layout: { columns: responsiveFormColumns(3, { breakpoint: 'lg' }) },
				},
			],
		},
	},
	fields: [
		{
			kind: 'text',
			name: 'recordId',
			labelI18n: 'Record ID',
			readOnly: true,
			computeFrom: {
				computeKey: 'recordIdFromSession',
				deps: [],
				readOnly: true,
			},
			inputGroup: {
				addons: [
					{
						align: 'inline-start',
						items: [{ kind: 'text', textI18n: 'ID' }],
					},
				],
			},
		},
		{
			kind: 'text',
			name: 'fullName',
			labelI18n: 'Full name',
			required: true,
			autoComplete: 'name',
			layout: { orientation: 'responsive' },
		},
		{
			kind: 'email',
			name: 'email',
			labelI18n: 'Email',
			required: true,
			autoComplete: 'email',
			inputGroup: {
				addons: [
					{
						align: 'inline-start',
						items: [{ kind: 'icon', iconKey: 'mail', labelI18n: 'Email' }],
					},
				],
			},
		},
		{
			kind: 'text',
			name: 'username',
			labelI18n: 'Username',
			inputMode: 'text',
			minLength: 3,
			maxLength: 32,
			inputGroup: {
				addons: [
					{ align: 'inline-start', items: [{ kind: 'text', textI18n: '@' }] },
				],
			},
		},
		{
			kind: 'textarea',
			name: 'bio',
			labelI18n: 'Bio',
			rows: 4,
			layout: { colSpan: 'full' },
		},
		{
			kind: 'group',
			legendI18n: 'Password fields',
			layout: { columns: responsiveFormColumns(2), gap: 'md', colSpan: 'full' },
			fields: [
				{
					kind: 'text',
					name: 'currentPassword',
					labelI18n: 'Current password',
					password: { purpose: 'current' },
					autoComplete: 'current-password',
				},
				{
					kind: 'text',
					name: 'newPassword',
					labelI18n: 'New password',
					password: {
						purpose: 'new',
						showLabelI18n: 'Show',
						hideLabelI18n: 'Hide',
					},
					autoComplete: 'new-password',
				},
			],
		},
		{ kind: 'select', name: 'role', labelI18n: 'Role', options: roleOptions },
		{
			kind: 'radio',
			name: 'contactPreference',
			labelI18n: 'Preferred contact',
			options: { kind: 'static', options: contactPreferenceOptions },
		},
		{ kind: 'checkbox', name: 'acceptTerms', labelI18n: 'Accept terms' },
		{
			kind: 'switch',
			name: 'marketingOptIn',
			labelI18n: 'Marketing updates',
			enabledWhen: { when: { path: 'acceptTerms', op: 'equals', value: true } },
		},
		{
			kind: 'autocomplete',
			name: 'reviewer',
			labelI18n: 'Reviewer',
			layout: { colSpan: 'full' },
			source: {
				kind: 'local',
				options: reviewerOptions,
				searchKeys: ['name', 'email'],
			},
			valueMapping: { mode: 'object' },
		},
		{
			kind: 'address',
			name: 'mailingAddress',
			labelI18n: 'Mailing address',
			countryOptions,
			layout: { colSpan: { base: 'full', lg: 2 } },
		},
		{ kind: 'phone', name: 'phone', labelI18n: 'Phone', countryOptions },
		{ kind: 'date', name: 'birthDate', labelI18n: 'Birth date' },
		{
			kind: 'time',
			name: 'reminderTime',
			labelI18n: 'Reminder time',
			is24Hour: true,
		},
		{
			kind: 'datetime',
			name: 'launchWindow',
			labelI18n: 'Launch window',
			is24Hour: true,
			visibleWhen: { when: { path: 'role', op: 'notEquals', value: 'viewer' } },
		},
		{
			kind: 'array',
			name: 'contacts',
			labelI18n: 'Contacts',
			min: 1,
			max: 4,
			layout: { colSpan: 'full' },
			of: {
				kind: 'group',
				layout: { columns: responsiveFormColumns(3), gap: 'sm' },
				fields: [
					{ kind: 'text', name: 'label', labelI18n: 'Label' },
					{
						kind: 'email',
						name: 'value',
						labelI18n: 'Email',
						requiredWhen: {
							when: {
								path: 'contacts.$index.label',
								op: 'equals',
								value: 'work',
							},
						},
					},
					{ kind: 'checkbox', name: 'preferred', labelI18n: 'Preferred' },
				],
			},
		},
	],
	constraints: [
		{
			key: 'launch-window-after-birth-date',
			messageI18n: 'Launch window must be after birth date.',
			paths: ['birthDate', 'launchWindow'],
		},
	],
	actions: [{ key: 'submit', labelI18n: 'Save form' }],
	policy: {
		pii: [
			'fullName',
			'email',
			'currentPassword',
			'newPassword',
			'mailingAddress',
			'phone',
		],
		flags: ['form-showcase'],
	},
	renderHints: { ui: 'custom', form: 'react-hook-form' },
});
