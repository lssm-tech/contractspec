import { describe, expect, it } from 'bun:test';
import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import {
	buildZodWithRelations,
	defineFormSpec,
	type FormSpec,
	normalizeFormSpec,
} from './forms';

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

	it('normalizes computeFrom.readOnly onto top-level readOnly', () => {
		const normalized = normalizeFormSpec({
			meta: {
				key: 'sigil.form.readonly',
				version: '1.0.0',
				title: 'Readonly Alias Form',
				description: 'Exercises readonly normalization.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(z.object({ id: z.string() }), {
				name: 'ReadonlyAliasModel',
			}),
			fields: [
				{
					kind: 'text',
					name: 'id',
					computeFrom: {
						computeKey: 'noop',
						deps: [],
						readOnly: true,
					},
				},
			],
		});

		expect(normalized.fields[0]?.readOnly).toBe(true);
	});

	it('normalizes wrapper orientation into field layout orientation', () => {
		const normalized = normalizeFormSpec({
			meta: {
				key: 'sigil.form.wrapper-layout',
				version: '1.0.0',
				title: 'Wrapper Layout Form',
				description: 'Exercises layout normalization.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(z.object({ enabled: z.boolean() }), {
				name: 'WrapperLayoutModel',
			}),
			fields: [
				{
					kind: 'switch',
					name: 'enabled',
					wrapper: { orientation: 'horizontal' },
				},
			],
		});

		expect(normalized.fields[0]?.layout?.orientation).toBe('horizontal');
	});

	it('accepts typed layout and input group configuration without changing paths', () => {
		const spec = defineFormSpec({
			meta: {
				key: 'sigil.form.layout',
				version: '1.0.0',
				title: 'Layout Form',
				description: 'Exercises rendering layout hints.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(
				z.object({
					query: z.string(),
					notes: z.string().optional(),
					nested: z.object({ code: z.string().optional() }),
				}),
				{ name: 'LayoutModel' }
			),
			layout: { columns: { base: 1, md: 2 }, gap: 'md' },
			fields: [
				{
					kind: 'text',
					name: 'query',
					labelI18n: 'Query',
					layout: { colSpan: 'full' },
					inputGroup: {
						addons: [
							{
								align: 'inline-start',
								items: [
									{ kind: 'icon', iconKey: 'search', labelI18n: 'Search' },
									{ kind: 'text', textI18n: 'Find' },
								],
							},
						],
					},
				},
				{
					kind: 'textarea',
					name: 'notes',
					labelI18n: 'Notes',
					inputGroup: {
						addons: [
							{
								align: 'block-end',
								items: [{ kind: 'text', textI18n: 'Optional' }],
							},
						],
					},
				},
				{
					kind: 'group',
					legendI18n: 'Nested',
					layout: { columns: 2, gap: 'sm' },
					fields: [{ kind: 'text', name: 'nested.code' }],
				},
			],
			constraints: [
				{
					key: 'query-notes',
					messageI18n: 'Required',
					paths: ['query', 'notes', 'nested.code'],
				},
			],
		});

		expect(spec.layout?.columns).toEqual({ base: 1, md: 2 });
		expect(spec.fields[0]?.kind).toBe('text');
		expect(spec.constraints?.[0]?.paths).toEqual([
			'query',
			'notes',
			'nested.code',
		]);
	});

	it('supports group items inside arrays for indexed relation checks', () => {
		const spec = {
			meta: {
				key: 'sigil.form.group-array',
				version: '1.0.0',
				title: 'Group Array Form',
				description: 'Exercises grouped array item validation.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(
				z.object({
					contacts: z.array(
						z.object({
							label: z.string(),
							value: z.string().optional(),
						})
					),
				}),
				{ name: 'GroupArrayModel' }
			),
			fields: [
				{
					kind: 'array',
					name: 'contacts',
					of: {
						kind: 'group',
						fields: [
							{ kind: 'text', name: 'label' },
							{
								kind: 'text',
								name: 'value',
								requiredWhen: {
									when: {
										path: 'contacts.$index.label',
										op: 'equals',
										value: 'work',
									},
								},
							},
						],
					},
				},
			],
		} satisfies FormSpec;

		const schema = buildZodWithRelations(spec);
		const result = schema.safeParse({
			contacts: [{ label: 'work' }, { label: 'personal', value: '' }],
		});

		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues[0]?.path).toEqual(['contacts', 0, 'value']);
	});

	it('accepts rich field kinds in the contract surface', () => {
		const spec = {
			meta: {
				key: 'sigil.form.rich-kinds',
				version: '1.0.0',
				title: 'Rich Kinds Form',
				description: 'Exercises rich field kind shapes.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(
				z.object({
					reviewer: z.object({
						id: z.string(),
						name: z.string(),
					}),
					address: z.object({ line1: z.string() }),
					phone: z.object({
						countryCode: z.string(),
						nationalNumber: z.string(),
					}),
					startDate: z.coerce.date(),
					startTime: z.string(),
					publishedAt: z.coerce.date(),
				}),
				{ name: 'RichKindsModel' }
			),
			fields: [
				{
					kind: 'autocomplete',
					name: 'reviewer',
					source: {
						kind: 'resolver',
						resolverKey: 'reviewers',
						deps: [],
						minQueryLength: 2,
						debounceMs: 150,
					},
					valueMapping: { mode: 'object' },
				},
				{ kind: 'address', name: 'address' },
				{ kind: 'phone', name: 'phone' },
				{ kind: 'date', name: 'startDate' },
				{ kind: 'time', name: 'startTime' },
				{ kind: 'datetime', name: 'publishedAt' },
			],
		} satisfies FormSpec;

		expect(spec.fields.map((field) => field.kind)).toEqual([
			'autocomplete',
			'address',
			'phone',
			'date',
			'time',
			'datetime',
		]);
	});
});
