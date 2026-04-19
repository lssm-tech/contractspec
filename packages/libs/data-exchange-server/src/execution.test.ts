import { describe, expect, it } from 'bun:test';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { executeImport } from './services';

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
});
