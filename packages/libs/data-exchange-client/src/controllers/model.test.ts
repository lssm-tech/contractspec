import { describe, expect, it } from 'bun:test';
import {
	createImportPlan,
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
});
