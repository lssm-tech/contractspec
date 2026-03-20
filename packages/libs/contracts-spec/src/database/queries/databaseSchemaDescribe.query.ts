import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';

const DatabaseSchemaDescribeInput = new SchemaModel({
	name: 'DatabaseSchemaDescribeInput',
	fields: {
		databaseKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		schemaKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		schemaVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		includeModels: { type: ScalarTypeEnum.Boolean(), isOptional: true },
	},
});

const DatabaseModelSummary = new SchemaModel({
	name: 'DatabaseModelSummary',
	fields: {
		name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		fieldCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		relationCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		piiFields: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const DatabaseSchemaSummary = new SchemaModel({
	name: 'DatabaseSchemaSummary',
	fields: {
		databaseKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		schemaKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		modelCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		models: { type: DatabaseModelSummary, isOptional: true, isArray: true },
		updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

const DatabaseSchemaDescribeOutput = new SchemaModel({
	name: 'DatabaseSchemaDescribeOutput',
	fields: {
		schemas: { type: DatabaseSchemaSummary, isOptional: false, isArray: true },
	},
});

export const DatabaseSchemaDescribeQuery = defineQuery({
	meta: {
		key: 'database.schema.describe',
		title: 'Describe Database Schema',
		version: '1.0.0',
		description: 'Describe database schemas and models with PII indicators.',
		goal: 'Provide deterministic schema context for agents and operators.',
		context:
			'Used before live data access to ensure schema awareness and policy checks.',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS, 'describe'],
		stability: DATABASE_STABILITY,
		docId: [docId('docs.tech.database.schema.describe')],
	},
	capability: {
		key: 'database.context',
		version: '1.0.0',
	},
	io: {
		input: DatabaseSchemaDescribeInput,
		output: DatabaseSchemaDescribeOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
