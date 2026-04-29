import { describe, expect, it } from 'bun:test';
import {
	defineExportTemplate,
	defineImportTemplate,
	type RecordBatch,
} from '@contractspec/lib.data-exchange-core';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
	dryRunExport,
	dryRunImport,
	executeExport,
	executeImport,
} from './services';

describe('data-exchange-server execution', () => {
	it('executes a dry preview-backed import into memory', async () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});

		const result = await executeImport({
			source: {
				kind: 'memory',
				format: 'json',
				batch: {
					format: 'json',
					columns: [],
					records: [{ identifier: 'acc-1', status: 'active' }],
				},
			},
			target: { kind: 'memory', format: 'json' },
			schema,
			mappings: [
				{ sourceField: 'identifier', targetField: 'id' },
				{ sourceField: 'status', targetField: 'status' },
			],
		});

		expect(result.success).toBe(true);
		expect(result.batch?.records[0]?.id).toBe('acc-1');
	});

	it('dry-runs and executes imports with template aliases and formats', async () => {
		const schema = defineSchemaModel({
			name: 'InvoiceImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
				active: { type: ScalarTypeEnum.Boolean(), isOptional: false },
			},
		});
		const sourceBatch: RecordBatch = {
			format: 'json',
			columns: [
				{
					key: 'Invoice Number',
					label: 'Invoice Number',
					sourcePath: 'Invoice Number',
					detectedType: 'string',
					nullable: false,
					sampleValues: ['inv-1'],
				},
				{
					key: 'Montant',
					label: 'Montant',
					sourcePath: 'Montant',
					detectedType: 'string',
					nullable: false,
					sampleValues: ['1.234,50'],
				},
				{
					key: 'Actif',
					label: 'Actif',
					sourcePath: 'Actif',
					detectedType: 'string',
					nullable: false,
					sampleValues: ['oui'],
				},
			],
			records: [
				{
					'Invoice Number': 'inv-1',
					Montant: '1.234,50',
					Actif: 'oui',
				},
			],
		};
		const template = defineImportTemplate({
			key: 'invoices.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'Invoice ID',
					targetField: 'id',
					required: true,
					sourceAliases: ['Invoice Number'],
				},
				{
					key: 'amount',
					label: 'Amount',
					targetField: 'amount',
					required: true,
					sourceAliases: ['Montant'],
					format: {
						kind: 'number',
						decimalSeparator: ',',
						thousandsSeparator: '.',
					},
				},
				{
					key: 'active',
					label: 'Active',
					targetField: 'active',
					required: true,
					sourceAliases: ['Actif'],
					format: { kind: 'boolean', trueValues: ['oui'] },
				},
			],
		});

		const dryRun = await dryRunImport({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			template,
		});
		expect(dryRun.plan.mappingSource).toBe('template');
		expect(dryRun.normalizedRecords[0]?.amount).toBe(1234.5);

		const result = await executeImport({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			template,
		});
		expect(result.success).toBe(true);
		expect(result.batch?.records[0]?.amount).toBe(1234.5);
		expect(
			result.auditTrail.some((entry) =>
				entry.message.includes('template mapping')
			)
		).toBe(true);
	});

	it('keeps mapping audit evidence when template validation blocks execution', async () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
			},
		});
		const sourceBatch: RecordBatch = {
			format: 'json',
			columns: [],
			records: [{ name: 'missing-id' }],
		};
		const template = defineImportTemplate({
			key: 'accounts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'ID',
					targetField: 'id',
					required: true,
				},
			],
		});

		const result = await executeImport({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			template,
		});

		expect(result.success).toBe(false);
		expect(
			result.issues.some((issue) => issue.code === 'mapping.required-unmatched')
		).toBe(true);
		expect(result.auditTrail).toContainEqual({
			step: 'mapping',
			status: 'error',
			message: 'Resolved mappings using template mapping.',
		});
		expect(result.auditTrail.some((entry) => entry.step === 'write')).toBe(
			false
		);
	});

	it('dry-runs and executes exports with template mappings', async () => {
		const schema = defineSchemaModel({
			name: 'InvoiceExport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
			},
		});
		const sourceBatch: RecordBatch = {
			format: 'json',
			columns: [
				{
					key: 'Invoice Number',
					label: 'Invoice Number',
					sourcePath: 'Invoice Number',
					detectedType: 'string',
					nullable: false,
					sampleValues: ['inv-1'],
				},
				{
					key: 'Amount',
					label: 'Amount',
					sourcePath: 'Amount',
					detectedType: 'string',
					nullable: false,
					sampleValues: ['1,50'],
				},
			],
			records: [{ 'Invoice Number': 'inv-1', Amount: '1,50' }],
		};
		const template = defineExportTemplate({
			key: 'invoices.export',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'Invoice ID',
					targetField: 'id',
					sourceAliases: ['Invoice Number'],
				},
				{
					key: 'amount',
					label: 'Amount',
					targetField: 'amount',
					format: { kind: 'number', decimalSeparator: ',' },
				},
			],
		});

		const dryRun = await dryRunExport({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			template,
		});
		expect(dryRun.plan.mappingSource).toBe('template');
		expect(dryRun.normalizedRecords[0]?.amount).toBe(1.5);

		const result = await executeExport({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			template,
		});
		expect(result.success).toBe(true);
		expect(result.batch?.records[0]?.amount).toBe(1.5);
		expect(
			result.auditTrail.some((entry) =>
				entry.message.includes('template mapping')
			)
		).toBe(true);
	});
});
