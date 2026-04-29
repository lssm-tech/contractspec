import { describe, expect, it } from 'bun:test';
import {
	createImportPlan,
	defineImportTemplate,
	previewImport,
} from '@contractspec/lib.data-exchange-core';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { createDataExchangeViewModel } from './model';

describe('data-exchange-client view model', () => {
	it('derives mapping, preview, and validation rows from preview results', () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});
		const sourceBatch = {
			format: 'json' as const,
			columns: [],
			records: [{ identifier: 'acc-1', status: 'active' }],
		};
		const preview = previewImport(
			createImportPlan({
				source: { kind: 'memory', batch: sourceBatch, format: 'json' },
				target: { kind: 'memory', format: 'json' },
				schema,
				sourceBatch,
				mappings: [
					{ sourceField: 'identifier', targetField: 'id' },
					{ sourceField: 'status', targetField: 'status' },
				],
			})
		);

		const model = createDataExchangeViewModel({ preview });
		expect(model.mappingRows).toHaveLength(2);
		expect(model.previewRows[0]?.id).toBe('acc-1');
		expect(model.validationSummary.errors).toBe(0);
	});

	it('exposes template mapping rows and ignored source columns', () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});
		const sourceBatch = {
			format: 'json' as const,
			columns: [
				{
					key: 'Account Identifier',
					label: 'Account Identifier',
					sourcePath: 'Account Identifier',
					detectedType: 'string' as const,
					nullable: false,
					sampleValues: ['acc-1'],
				},
				{
					key: 'Ignored',
					label: 'Ignored',
					sourcePath: 'Ignored',
					detectedType: 'string' as const,
					nullable: false,
					sampleValues: ['x'],
				},
			],
			records: [{ 'Account Identifier': 'acc-1', Ignored: 'x' }],
		};
		const template = defineImportTemplate({
			key: 'accounts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'Account ID',
					targetField: 'id',
					required: true,
					sourceAliases: ['Account Identifier'],
					format: { kind: 'text', trim: true },
				},
				{
					key: 'status',
					label: 'Status',
					targetField: 'status',
					required: true,
				},
			],
		});
		const preview = previewImport(
			createImportPlan({
				source: { kind: 'memory', batch: sourceBatch, format: 'json' },
				target: { kind: 'memory', format: 'json' },
				schema,
				sourceBatch,
				template,
			})
		);

		const model = createDataExchangeViewModel({ preview });
		expect(model.templateRows).toHaveLength(2);
		expect(model.templateRows[0]?.sourceField).toBe('Account Identifier');
		expect(model.templateRows[0]?.formatLabel).toBe('text');
		expect(model.unmatchedRequiredRows.map((row) => row.targetField)).toEqual([
			'status',
		]);
		expect(model.ignoredSourceColumns).toEqual(['Ignored']);
	});
});
