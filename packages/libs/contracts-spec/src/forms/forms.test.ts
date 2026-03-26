import { describe, expect, it } from 'bun:test';
import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import { buildZodWithRelations, type FormSpec } from './forms';

const ArrayFormModel = fromZod(
	z.object({
		force: z.boolean(),
		emails: z.array(
			z.object({
				type: z.string(),
				address: z.string().optional(),
			})
		),
	}),
	{ name: 'ArrayFormModel' }
);

function createFormSpec(): FormSpec<typeof ArrayFormModel> {
	return {
		meta: {
			key: 'sigil.form.array-relations',
			version: '1.0.0',
			title: 'Array Relations Form',
			description: 'Exercises indexed array validation',
			domain: 'testing',
			owners: [OwnersEnum.PlatformSigil],
			tags: [TagsEnum.Auth],
			stability: StabilityEnum.Experimental,
		},
		model: ArrayFormModel,
		fields: [
			{ kind: 'checkbox', name: 'force' },
			{
				kind: 'array',
				name: 'emails',
				of: {
					kind: 'text',
					name: 'address',
					requiredWhen: {
						anyOf: [
							{ when: { path: 'force', op: 'equals', value: true } },
							{
								when: {
									path: 'emails.$index.type',
									op: 'equals',
									value: 'work',
								},
							},
						],
					},
				},
			},
		],
	};
}

describe('buildZodWithRelations', () => {
	it('accepts populated array items when requiredWhen is satisfied', () => {
		const schema = buildZodWithRelations(createFormSpec());
		const result = schema.safeParse({
			force: true,
			emails: [{ type: 'personal', address: 'person@example.com' }],
		});

		expect(result.success).toBe(true);
	});

	it('reports missing array item fields on the indexed path', () => {
		const schema = buildZodWithRelations(createFormSpec());
		const result = schema.safeParse({
			force: true,
			emails: [{ type: 'personal' }],
		});

		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues[0]?.path).toEqual(['emails', 0, 'address']);
	});

	it('resolves $index predicates against the current array item', () => {
		const schema = buildZodWithRelations(createFormSpec());
		const result = schema.safeParse({
			force: false,
			emails: [{ type: 'work' }, { type: 'personal' }],
		});

		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues).toHaveLength(1);
		expect(result.error.issues[0]?.path).toEqual(['emails', 0, 'address']);
	});
});
