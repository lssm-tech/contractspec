import { describe, expect, it } from 'bun:test';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { createImportPlan } from './plans';
import { previewImport } from './preview';
import { createRecordBatch } from './records';

describe('data-exchange-core preview', () => {
	it('builds preview diffs for mapped import plans', () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});
		const sourceBatch = createRecordBatch([
			{ identifier: 'acc-1', status: 'active' },
		]);
		const plan = createImportPlan({
			source: { kind: 'memory', batch: sourceBatch, format: 'json' },
			target: { kind: 'memory', format: 'json' },
			schema,
			sourceBatch,
			mappings: [
				{ sourceField: 'identifier', targetField: 'id' },
				{ sourceField: 'status', targetField: 'status' },
			],
		});

		const preview = previewImport(plan);
		expect(preview.normalizedRecords[0]?.id).toBe('acc-1');
		expect(preview.changes.some((change) => change.fieldPath === 'id')).toBe(
			true
		);
	});
});
