import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { DatabaseContextDocBlock } from '../../../database/capabilities/databaseContext.capability';
import { DatabaseDictionaryGetDocBlock } from '../../../database/queries/databaseDictionaryGet.query';
import { DatabaseMigrationsListDocBlock } from '../../../database/queries/databaseMigrationsList.query';
import { DatabaseQueryReadonlyDocBlock } from '../../../database/queries/databaseQueryReadonly.query';
import { DatabaseSchemaDescribeDocBlock } from '../../../database/queries/databaseSchemaDescribe.query';
import { DatabaseSchemasDataViewDocBlock } from '../../../database/views/databaseSchemas.dataView';

export const tech_database_context_DocBlocks: DocBlock[] = [
	DatabaseContextDocBlock,
	DatabaseSchemaDescribeDocBlock,
	DatabaseSchemasDataViewDocBlock,
	DatabaseMigrationsListDocBlock,
	DatabaseDictionaryGetDocBlock,
	DatabaseQueryReadonlyDocBlock,
];
