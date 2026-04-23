import { describe, expect, it } from 'bun:test';
import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import {
	buildZodWithRelations,
	defineFormSpec,
	type FormSpec,
	normalizeFormSpec,
	responsiveFormColumns,
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

	it('creates explicit mobile-safe responsive column hints', () => {
		expect(responsiveFormColumns(2)).toEqual({ base: 1, md: 2 });
		expect(responsiveFormColumns(3, { breakpoint: 'lg' })).toEqual({
			base: 1,
			lg: 3,
		});

		const spec = defineFormSpec({
			meta: {
				key: 'sigil.form.numeric-layout',
				version: '1.0.0',
				title: 'Numeric Layout Form',
				description: 'Exercises legacy numeric layout behavior.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(z.object({ name: z.string() }), {
				name: 'NumericLayoutModel',
			}),
			layout: { columns: 2 },
			fields: [{ kind: 'text', name: 'name' }],
		});

		expect(normalizeFormSpec(spec).layout?.columns).toBe(2);
	});

	it('accepts current and new password text field metadata', () => {
		const spec = defineFormSpec({
			meta: {
				key: 'sigil.form.password',
				version: '1.0.0',
				title: 'Password Form',
				description: 'Exercises password rendering metadata.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			model: fromZod(
				z.object({
					currentPassword: z.string(),
					newPassword: z.string(),
				}),
				{ name: 'PasswordFormModel' }
			),
			fields: [
				{
					kind: 'text',
					name: 'currentPassword',
					password: { purpose: 'current' },
					autoComplete: 'current-password',
				},
				{
					kind: 'text',
					name: 'newPassword',
					password: {
						purpose: 'new',
						visibilityToggle: false,
						showLabelI18n: 'Show new password',
						hideLabelI18n: 'Hide new password',
					},
					keyboard: {
						kind: 'new-password',
						autoComplete: 'new-password',
					},
				},
			],
		});

		const normalized = normalizeFormSpec(spec);
		expect(normalized.fields[0]?.kind).toBe('text');
		expect(normalized.fields[1]?.kind).toBe('text');
		if (normalized.fields[0]?.kind !== 'text') return;
		if (normalized.fields[1]?.kind !== 'text') return;
		expect(normalized.fields[0].password?.purpose).toBe('current');
		expect(normalized.fields[0].autoComplete).toBe('current-password');
		expect(normalized.fields[1].password?.purpose).toBe('new');
		expect(normalized.fields[1].password?.visibilityToggle).toBe(false);
		expect(normalized.fields[1].keyboard?.autoComplete).toBe('new-password');
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
