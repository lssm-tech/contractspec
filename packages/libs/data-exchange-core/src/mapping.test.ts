import { describe, expect, it } from 'bun:test';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
	applyColumnValueFormat,
	applyMappingToRecord,
	defineImportTemplate,
	inferFieldMappings,
	resolveImportTemplateMappings,
	resolveTemplateMappings,
} from './mapping';
import { createImportPlan } from './plans';
import { createRecordBatch } from './records';
import { coerceRecordToSchema } from './schema';

describe('data-exchange-core mapping', () => {
	const ContactModel = defineSchemaModel({
		name: 'ContactImport',
		fields: {
			id: { type: ScalarTypeEnum.ID(), isOptional: false },
			email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
			active: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		},
	});

	it('infers mappings and coerces data against SchemaModel', () => {
		const batch = createRecordBatch([
			{ ID: 'usr_1', Email: 'user@example.com', active: 'true' },
		]);
		const mappings = inferFieldMappings(batch, ContactModel);
		expect(mappings.map((mapping) => mapping.targetField)).toEqual([
			'id',
			'email',
			'active',
		]);

		const mapped = applyMappingToRecord(batch.records[0]!, mappings);
		const coerced = coerceRecordToSchema(mapped, ContactModel);
		expect(coerced.issues).toHaveLength(0);
		expect(coerced.record.active).toBe(true);
	});

	it('resolves import template mappings from aliases and normalized headers', () => {
		const batch = createRecordBatch([
			{
				'Account Identifier': 'acc-1',
				'lifecycle-status': 'active',
				'Unused Column': 'ignored',
			},
		]);
		const template = defineImportTemplate({
			key: 'accounts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'account-id',
					label: 'Account ID',
					targetField: 'id',
					required: true,
					sourceAliases: ['Account Identifier'],
				},
				{
					key: 'status',
					label: 'Status',
					targetField: 'status',
					required: true,
					sourceAliases: ['Lifecycle status'],
				},
			],
		});
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
				email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
			},
		});

		const result = resolveImportTemplateMappings({
			batch,
			schema,
			template,
		});

		expect(result.source).toBe('template');
		expect(result.mappings.map((mapping) => mapping.targetField)).toEqual([
			'id',
			'status',
		]);
		expect(result.matchedColumns.map((match) => match.strategy)).toEqual([
			'alias',
			'normalized',
		]);
		expect(result.unmatchedSourceColumns.map((column) => column.key)).toEqual([
			'Unused Column',
		]);
	});

	it('lets explicit mappings override template resolution', () => {
		const batch = createRecordBatch([
			{ external_id: 'acc-1', 'Account ID': 'wrong', ignored: 'x' },
		]);
		const template = defineImportTemplate({
			key: 'accounts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'ID',
					targetField: 'id',
					required: true,
					sourceAliases: ['Account ID'],
					format: { kind: 'number' },
				},
				{
					key: 'email',
					label: 'Email',
					targetField: 'email',
					required: true,
				},
			],
		});
		const plan = createImportPlan({
			source: { kind: 'memory', batch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema: ContactModel,
			sourceBatch: batch,
			template,
			formatProfile: { defaultFormat: { kind: 'text', case: 'uppercase' } },
			mappings: [
				{
					sourceField: 'external_id',
					targetField: 'id',
					format: { kind: 'text', trim: false },
				},
			],
		});

		expect(plan.mappingSource).toBe('explicit');
		expect(plan.mappings[0]?.sourceField).toBe('external_id');
		expect(plan.mappings[0]?.status).toBe('manual');
		expect(plan.mappings[0]?.format?.kind).toBe('text');
		expect(plan.mappings[0]?.format?.trim).toBe(false);
		expect(plan.issues).toHaveLength(0);
		expect(
			plan.templateMapping?.unmatchedSourceColumns.map((column) => column.key)
		).toEqual(['Account ID', 'ignored']);
	});

	it('applies format profiles to explicit mappings that do not define a format', () => {
		const batch = createRecordBatch([
			{ external_id: 'acc-1', active_text: 'oui' },
		]);
		const plan = createImportPlan({
			source: { kind: 'memory', batch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema: ContactModel,
			sourceBatch: batch,
			formatProfile: {
				columns: {
					active_flag: { kind: 'boolean', trueValues: ['oui'] },
				},
			},
			mappings: [
				{ sourceField: 'external_id', targetField: 'id' },
				{
					sourceField: 'active_text',
					targetField: 'active',
					templateColumnKey: 'active_flag',
				},
			],
		});

		const mapped = applyMappingToRecord(batch.records[0]!, plan.mappings);
		expect(plan.mappingSource).toBe('explicit');
		expect(plan.mappings[1]?.format?.kind).toBe('boolean');
		expect(mapped.active).toBe(true);
	});

	it('appends schema fallback mappings outside template columns', () => {
		const batch = createRecordBatch([
			{ 'Contact ID': 'usr_1', Email: 'user@example.com', active: 'false' },
		]);
		const template = defineImportTemplate({
			key: 'contacts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'Contact ID',
					targetField: 'id',
					required: true,
				},
			],
		});

		const result = resolveImportTemplateMappings({
			batch,
			schema: ContactModel,
			template,
		});

		expect(result.mappings.map((mapping) => mapping.targetField)).toEqual([
			'id',
			'email',
			'active',
		]);
		expect(
			result.mappings.find((mapping) => mapping.targetField === 'email')?.status
		).toBe('inferred');
		expect(
			result.matchedColumns.map((match) => match.templateColumnKey)
		).toEqual(['id']);
	});

	it('prefers exact matches and prevents source reuse across template columns', () => {
		const batch = createRecordBatch([
			{ id: 'exact-id', 'Account Identifier': 'alias-id' },
		]);
		const template = defineImportTemplate({
			key: 'contacts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'ID',
					targetField: 'id',
					sourceAliases: ['Account Identifier'],
				},
				{
					key: 'duplicate-id',
					label: 'Duplicate ID',
					targetField: 'email',
					sourceAliases: ['id', 'Account Identifier'],
				},
			],
		});

		const result = resolveImportTemplateMappings({
			batch,
			schema: ContactModel,
			template,
			formatProfile: {
				columns: { email: { kind: 'text', case: 'lowercase' } },
				defaultFormat: { kind: 'text', trim: true },
			},
		});

		expect(result.matchedColumns[0]?.strategy).toBe('exact');
		expect(result.mappings[0]?.sourceField).toBe('id');
		expect(result.mappings[1]?.sourceField).toBe('Account Identifier');
		expect(result.mappings[1]?.format?.case).toBe('lowercase');
	});

	it('reports missing required template columns', () => {
		const batch = createRecordBatch([{ Email: 'user@example.com' }]);
		const template = defineImportTemplate({
			key: 'contacts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'Contact ID',
					targetField: 'id',
					required: true,
				},
			],
		});
		const plan = createImportPlan({
			source: { kind: 'memory', batch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema: ContactModel,
			sourceBatch: batch,
			template,
		});

		expect(
			plan.issues.some((issue) => issue.code === 'mapping.required-unmatched')
		).toBe(true);
		expect(plan.templateMapping?.unmatchedTemplateColumns[0]?.targetField).toBe(
			'id'
		);
	});

	it('rejects ambiguous template column identities', () => {
		expect(() =>
			defineImportTemplate({
				key: 'duplicate.keys',
				version: '1.0.0',
				columns: [
					{ key: 'id', label: 'ID', targetField: 'id' },
					{ key: 'id', label: 'Email', targetField: 'email' },
				],
			})
		).toThrow('Duplicate import template column key "id".');
		expect(() =>
			defineImportTemplate({
				key: 'duplicate.targets',
				version: '1.0.0',
				columns: [
					{ key: 'id', label: 'ID', targetField: 'id' },
					{ key: 'external-id', label: 'External ID', targetField: 'id' },
				],
			})
		).toThrow('Duplicate import template target field "id".');
	});

	it('validates raw templates passed directly into mapping resolution', () => {
		const batch = createRecordBatch([{ id: 'acc-1' }]);
		expect(() =>
			resolveTemplateMappings({
				batch,
				schema: ContactModel,
				template: {
					key: 'raw.template',
					version: '1.0.0',
					columns: [
						{ key: 'id', label: 'ID', targetField: 'id' },
						{ key: 'id', label: 'Email', targetField: 'email' },
					],
				},
			})
		).toThrow('Duplicate import template column key "id".');
	});

	it('formats mapped column values before schema coercion', () => {
		const batch = createRecordBatch([
			{
				amount: '1.234,50',
				enabled: 'oui',
				started: '31/12/2025',
				tags: 'red; blue',
				ratio: '12,5%',
				payload: '{"ok":true}',
			},
		]);
		const mapped = applyMappingToRecord(batch.records[0]!, [
			{
				sourceField: 'amount',
				targetField: 'amount',
				format: {
					kind: 'number',
					decimalSeparator: ',',
					thousandsSeparator: '.',
				},
			},
			{
				sourceField: 'enabled',
				targetField: 'enabled',
				format: { kind: 'boolean', trueValues: ['oui'] },
			},
			{
				sourceField: 'started',
				targetField: 'started',
				format: { kind: 'date', inputFormats: ['dd/MM/yyyy'] },
			},
			{
				sourceField: 'tags',
				targetField: 'tags',
				format: { kind: 'split', delimiter: ';' },
			},
			{
				sourceField: 'ratio',
				targetField: 'ratio',
				format: {
					kind: 'percentage',
					decimalSeparator: ',',
					percentScale: 'whole',
				},
			},
			{
				sourceField: 'payload',
				targetField: 'payload',
				format: { kind: 'json' },
			},
		]);

		expect(mapped.amount).toBe(1234.5);
		expect(mapped.enabled).toBe(true);
		expect(mapped.started).toBeInstanceOf(Date);
		expect(mapped.tags).toEqual(['red', 'blue']);
		expect(mapped.ratio).toBe(0.125);
		expect(mapped.payload).toEqual({ ok: true });
		expect(
			applyColumnValueFormat('', {
				kind: 'text',
				defaultValue: 'fallback',
			})
		).toBe('fallback');
		expect(
			applyColumnValueFormat('non', {
				kind: 'boolean',
				falseValues: ['non'],
			})
		).toBe(false);
		expect(
			applyColumnValueFormat('', { kind: 'text', emptyAsNull: true })
		).toBe(null);
		expect(
			applyColumnValueFormat('  keep  ', { kind: 'text', trim: false })
		).toBe('  keep  ');
		expect(
			applyColumnValueFormat('0.125', {
				kind: 'percentage',
				percentScale: 'fraction',
			})
		).toBe(0.125);
		expect(applyColumnValueFormat('0.125', { kind: 'percentage' })).toBe(0.125);
		expect(() => applyColumnValueFormat('{bad', { kind: 'json' })).toThrow();
	});
});
