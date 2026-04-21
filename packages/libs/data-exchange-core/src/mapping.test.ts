import { describe, expect, it } from 'bun:test';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { applyMappingToRecord, inferFieldMappings } from './mapping';
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
});
