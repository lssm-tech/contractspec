import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineQuery } from '../../operations';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';

const DatabaseQueryReadonlyInput = new SchemaModel({
	name: 'DatabaseQueryReadonlyInput',
	fields: {
		dataViewKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		dataViewVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		filters: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		sort: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		redactionMode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const DatabaseQueryReadonlyOutput = new SchemaModel({
	name: 'DatabaseQueryReadonlyOutput',
	fields: {
		rows: {
			type: ScalarTypeEnum.JSONObject(),
			isOptional: false,
			isArray: true,
		},
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		schemaRef: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const DatabaseQueryReadonlyDocBlock = {
	id: 'docs.tech.database.query.readonly',
	title: 'Read-only data query',
	summary: 'Perform a governed read-only query via data views.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/database/query/readonly',
	tags: ['database', 'query', 'readonly'],
	body: `# database.query.readonly

Executes read-only data access using data views with policy and redaction.
`,
} satisfies DocBlock;

export const DatabaseQueryReadonlyQuery = defineQuery({
	meta: {
		key: 'database.query.readonly',
		title: 'Read-Only Data Query',
		version: '1.0.0',
		description: 'Execute a governed read-only query via a data view.',
		goal: 'Allow safe, policy-gated data retrieval for agents and operators.',
		context: 'Used for live data access with redaction and auditing.',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS, 'query', 'readonly'],
		stability: DATABASE_STABILITY,
		docId: [docRef(DatabaseQueryReadonlyDocBlock.id)],
	},
	capability: {
		key: 'database.context',
		version: '1.0.0',
	},
	io: {
		input: DatabaseQueryReadonlyInput,
		output: DatabaseQueryReadonlyOutput,
	},
	policy: {
		auth: 'admin',
		pii: ['rows'],
	},
});
