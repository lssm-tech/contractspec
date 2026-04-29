import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import type { AddressFormValue, PhoneFormValue } from './forms';
import { defineFormSpec } from './forms';

const RichFieldsShowcaseModel = fromZod(
	z.object({
		recordId: z.string(),
		status: z.string(),
		reviewer: z.object({
			id: z.string(),
			name: z.string(),
			email: z.string().email(),
		}),
		contactEmail: z.string().email(),
		currentPassword: z.string().optional(),
		newPassword: z.string().optional(),
		address: z.object({
			line1: z.string(),
			line2: z.string().optional(),
			city: z.string().optional(),
			region: z.string().optional(),
			postalCode: z.string().optional(),
			countryCode: z.string().optional(),
		}) satisfies z.ZodType<AddressFormValue>,
		phone: z.object({
			countryCode: z.string(),
			countryIso2: z.string().optional(),
			nationalNumber: z.string(),
			extension: z.string().optional(),
			e164: z.string().optional(),
		}) satisfies z.ZodType<PhoneFormValue>,
		startDate: z.coerce.date(),
		startTime: z.string(),
		publishedAt: z.coerce.date(),
		budget: z.number(),
		completionRatio: z.number(),
		allocation: z.number(),
		estimatedDuration: z.number(),
		contacts: z.array(
			z.object({
				label: z.string(),
				value: z.string(),
			})
		),
	}),
	{
		name: 'RichFieldsShowcaseModel',
		description: 'Canonical FormSpec example for rich field authoring.',
	}
);

export const RichFieldsShowcaseForm = defineFormSpec({
	meta: {
		key: 'forms.rich-fields-showcase',
		version: '1.0.0',
		title: 'Rich Fields Showcase',
		description:
			'Canonical showcase for readonly, password, autocomplete, address, phone, temporal, and repeated grouped fields.',
		domain: 'forms',
		owners: [OwnersEnum.PlatformCore],
		tags: [TagsEnum.Docs, 'forms', 'showcase'],
		stability: StabilityEnum.Experimental,
	},
	model: RichFieldsShowcaseModel,
	layout: { columns: 1, gap: 'lg' },
	fields: [
		{
			kind: 'group',
			legendI18n: 'Publication details',
			descriptionI18n: 'Review metadata used before publishing.',
			layout: {
				columns: { base: 1, md: 2 },
				gap: 'md',
			},
			fields: [
				{
					kind: 'text',
					name: 'recordId',
					labelI18n: 'Record ID',
					readOnly: true,
					inputGroup: {
						addons: [
							{
								align: 'inline-start',
								items: [
									{
										kind: 'icon',
										iconKey: 'info',
										labelI18n: 'Record identifier',
									},
									{ kind: 'text', textI18n: 'ID' },
								],
							},
						],
					},
				},
				{
					kind: 'select',
					name: 'status',
					labelI18n: 'Status',
					options: {
						kind: 'static',
						options: [
							{ labelI18n: 'Draft', value: 'draft' },
							{ labelI18n: 'Ready', value: 'ready' },
							{ labelI18n: 'Published', value: 'published' },
						],
					},
				},
				{
					kind: 'autocomplete',
					name: 'reviewer',
					labelI18n: 'Reviewer',
					placeholderI18n: 'Search a reviewer',
					layout: { colSpan: 'full' },
					source: {
						kind: 'local',
						searchKeys: ['id', 'name', 'email'],
						options: [
							{
								labelI18n: 'Alice Martin',
								value: 'usr_1',
								data: {
									id: 'usr_1',
									name: 'Alice Martin',
									email: 'alice@example.com',
								},
							},
							{
								labelI18n: 'Bob Chen',
								value: 'usr_2',
								data: {
									id: 'usr_2',
									name: 'Bob Chen',
									email: 'bob@example.com',
								},
							},
						],
					},
					valueMapping: { mode: 'object' },
				},
			],
		},
		{
			kind: 'group',
			legendI18n: 'Password fields',
			descriptionI18n: 'Password manager compatible fields.',
			layout: {
				columns: { base: 1, md: 2 },
				gap: 'md',
			},
			fields: [
				{
					kind: 'text',
					name: 'currentPassword',
					labelI18n: 'Current password',
					placeholderI18n: 'Enter current password',
					password: { purpose: 'current' },
				},
				{
					kind: 'text',
					name: 'newPassword',
					labelI18n: 'New password',
					placeholderI18n: 'Enter new password',
					password: {
						purpose: 'new',
						showLabelI18n: 'Show new password',
						hideLabelI18n: 'Hide new password',
					},
				},
			],
		},
		{
			kind: 'group',
			legendI18n: 'Contact channels',
			layout: {
				columns: { base: 1, md: 2 },
				gap: 'md',
			},
			fields: [
				{ kind: 'address', name: 'address', labelI18n: 'Address' },
				{
					kind: 'email',
					name: 'contactEmail',
					labelI18n: 'Contact email',
					placeholderI18n: 'support@example.com',
				},
				{
					kind: 'phone',
					name: 'phone',
					labelI18n: 'Phone',
					country: { defaultIso2: 'FR', detection: 'input' },
					input: { mode: 'split', autoSwitch: true },
					display: { flag: true, callingCode: true, countrySelect: true },
				},
				{
					kind: 'date',
					name: 'startDate',
					labelI18n: 'Start date',
					format: { dateStyle: 'medium' },
				},
				{
					kind: 'time',
					name: 'startTime',
					labelI18n: 'Start time',
					is24Hour: true,
					format: { timeStyle: 'short', hour12: false },
				},
				{
					kind: 'datetime',
					name: 'publishedAt',
					labelI18n: 'Published at',
					layout: { colSpan: 'full' },
					is24Hour: true,
					format: { dateStyle: 'medium', timeStyle: 'short', hour12: false },
				},
				{
					kind: 'number',
					name: 'budget',
					labelI18n: 'Budget units',
					min: 0,
					step: 1,
					format: { maximumFractionDigits: 0, useGrouping: true },
				},
				{
					kind: 'percent',
					name: 'completionRatio',
					labelI18n: 'Completion',
					valueScale: 'fraction',
					step: 0.1,
					format: { valueScale: 'fraction', maximumFractionDigits: 1 },
				},
				{
					kind: 'currency',
					name: 'allocation',
					labelI18n: 'Allocation',
					min: 0,
					step: 0.01,
					format: { currency: 'EUR', currencyDisplay: 'symbol' },
				},
				{
					kind: 'duration',
					name: 'estimatedDuration',
					labelI18n: 'Estimated duration',
					valueUnit: 'minute',
					min: 0,
					step: 15,
					format: { unit: 'minute', display: 'short' },
				},
			],
		},
		{
			kind: 'array',
			name: 'contacts',
			labelI18n: 'Contacts',
			min: 1,
			of: {
				kind: 'group',
				fields: [
					{ kind: 'text', name: 'label', labelI18n: 'Label' },
					{ kind: 'text', name: 'value', labelI18n: 'Value' },
				],
			},
		},
	],
	actions: [{ key: 'submit', labelI18n: 'Save' }],
	policy: {
		flags: [],
		pii: ['contactEmail', 'currentPassword', 'newPassword', 'address', 'phone'],
	},
	renderHints: { ui: 'custom', form: 'react-hook-form' },
});
