import {
	defineFormSpec,
	responsiveFormColumns,
} from '@contractspec/lib.contracts-spec/forms';
import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { FormShowcaseProgressiveStepsModel } from './form-showcase.models';

export const FormShowcaseProgressiveStepsForm = defineFormSpec({
	meta: {
		key: 'examples.form-showcase.progressive-steps',
		version: '1.0.0',
		title: 'Form Showcase Progressive Steps',
		description:
			'Step-based form template showing progressive disclosure, resolver-backed choices, and conditional review fields.',
		domain: 'examples.forms',
		owners: [OwnersEnum.PlatformCore],
		tags: ['examples', 'forms', 'template', 'steps'],
		stability: StabilityEnum.Stable,
	},
	model: FormShowcaseProgressiveStepsModel,
	layout: {
		columns: responsiveFormColumns(2),
		gap: 'md',
		fieldOrientation: 'vertical',
		flow: {
			kind: 'steps',
			previousLabelI18n: 'Back',
			nextLabelI18n: 'Continue',
			sections: [
				{
					key: 'workspace',
					titleI18n: 'Workspace',
					descriptionI18n: 'Name and route the workspace.',
					fieldNames: ['companyName', 'workspaceSlug'],
					layout: { columns: responsiveFormColumns(2), gap: 'md' },
				},
				{
					key: 'plan',
					titleI18n: 'Plan',
					descriptionI18n: 'Choose the template plan.',
					fieldNames: ['plan', 'ownerEmail'],
					layout: { columns: responsiveFormColumns(2), gap: 'md' },
				},
				{
					key: 'review',
					titleI18n: 'Review',
					fieldNames: ['needsSecurityReview', 'securityNotes', 'goLiveDate'],
				},
			],
		},
	},
	fields: [
		{
			kind: 'text',
			name: 'companyName',
			labelI18n: 'Company name',
			required: true,
			autoComplete: 'organization',
		},
		{
			kind: 'text',
			name: 'workspaceSlug',
			labelI18n: 'Workspace slug',
			required: true,
			inputMode: 'url',
			computeFrom: {
				computeKey: 'slugifyCompanyName',
				deps: ['companyName'],
				mode: 'blur-xs',
			},
			inputGroup: {
				addons: [
					{
						align: 'inline-end',
						items: [{ kind: 'text', textI18n: '.contractspec.app' }],
					},
				],
			},
		},
		{
			kind: 'autocomplete',
			name: 'plan',
			labelI18n: 'Plan',
			source: {
				kind: 'resolver',
				resolverKey: 'plans.search',
				deps: ['companyName'],
				minQueryLength: 0,
				debounceMs: 100,
			},
			valueMapping: { mode: 'scalar' },
		},
		{
			kind: 'email',
			name: 'ownerEmail',
			labelI18n: 'Owner email',
			required: true,
			autoComplete: 'email',
		},
		{
			kind: 'switch',
			name: 'needsSecurityReview',
			labelI18n: 'Needs security review',
			layout: { orientation: 'horizontal', colSpan: 'full' },
		},
		{
			kind: 'textarea',
			name: 'securityNotes',
			labelI18n: 'Security notes',
			rows: 5,
			layout: { colSpan: 'full' },
			visibleWhen: {
				when: { path: 'needsSecurityReview', op: 'equals', value: true },
			},
			requiredWhen: {
				when: { path: 'needsSecurityReview', op: 'equals', value: true },
			},
		},
		{
			kind: 'date',
			name: 'goLiveDate',
			labelI18n: 'Go-live date',
			layout: { colSpan: { base: 'full', md: 1 } },
		},
	],
	actions: [
		{ key: 'save-draft', labelI18n: 'Save draft' },
		{ key: 'submit', labelI18n: 'Create workspace' },
	],
	policy: {
		pii: ['ownerEmail', 'securityNotes'],
		flags: ['form-showcase', 'progressive-steps'],
	},
	renderHints: { ui: 'shadcn', form: 'react-hook-form' },
});
