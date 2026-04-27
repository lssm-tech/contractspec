import { describe, expect, test } from 'bun:test';
import {
	buildZodWithRelations,
	type FieldSpec,
} from '@contractspec/lib.contracts-spec/forms';
import example from './example';
import {
	FormShowcaseAllFieldsForm,
	FormShowcaseForms,
	FormShowcaseProgressiveStepsForm,
	FormShowcaseRegistry,
} from './forms';

function collectFieldKinds(
	fields: readonly FieldSpec[],
	kinds = new Set<string>()
) {
	for (const field of fields) {
		kinds.add(field.kind);
		if (field.kind === 'group') {
			collectFieldKinds(field.fields, kinds);
		}
		if (field.kind === 'array') {
			collectFieldKinds([field.of], kinds);
		}
	}
	return kinds;
}

describe('@contractspec/example.form-showcase smoke', () => {
	test('publishes template metadata for the examples registry', () => {
		expect(example.meta.kind).toBe('template');
		expect(example.meta.key).toBe('form-showcase');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.form-showcase'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox.enabled).toBe(true);
	});

	test('covers every current form field kind', () => {
		expect(
			[...collectFieldKinds(FormShowcaseAllFieldsForm.fields)].sort()
		).toEqual([
			'address',
			'array',
			'autocomplete',
			'checkbox',
			'date',
			'datetime',
			'email',
			'group',
			'phone',
			'radio',
			'select',
			'switch',
			'text',
			'textarea',
			'time',
		]);
	});

	test('demonstrates section and step layout flows', () => {
		expect(FormShowcaseAllFieldsForm.layout?.flow?.kind).toBe('sections');
		expect(FormShowcaseProgressiveStepsForm.layout?.flow?.kind).toBe('steps');
		expect(
			FormShowcaseProgressiveStepsForm.layout?.flow?.sections.map(
				(section) => section.key
			)
		).toEqual(['workspace', 'plan', 'review']);
	});

	test('registers both form specs for discovery', () => {
		expect(FormShowcaseForms).toHaveLength(2);
		expect(FormShowcaseRegistry.get('examples.form-showcase.all-fields')).toBe(
			FormShowcaseAllFieldsForm
		);
		expect(FormShowcaseRegistry.listByTag('forms')).toHaveLength(2);
	});

	test('enforces indexed requiredWhen metadata through relation validation', () => {
		const schema = buildZodWithRelations(FormShowcaseAllFieldsForm);
		const result = schema.safeParse({
			recordId: 'rec_1',
			fullName: 'Ada Lovelace',
			email: 'ada@example.com',
			username: 'ada',
			role: 'admin',
			contactPreference: 'email',
			acceptTerms: true,
			marketingOptIn: true,
			reviewer: {
				id: 'usr_alice',
				name: 'Alice Martin',
				email: 'alice@example.com',
			},
			mailingAddress: { line1: '1 Main St', countryCode: 'US' },
			phone: { countryCode: 'US', nationalNumber: '5550100' },
			contacts: [{ label: 'work' }],
		});

		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues[0]?.path).toEqual(['contacts', 0, 'value']);
	});
});
