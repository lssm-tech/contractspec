import type { CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views';
import type { OperationSpecRegistry } from '../operations/registry';
import { DatabaseContextCapability } from './capabilities';
import { DatabaseDictionaryGetQuery } from './queries/databaseDictionaryGet.query';
import { DatabaseMigrationsListQuery } from './queries/databaseMigrationsList.query';
import { DatabaseQueryReadonlyQuery } from './queries/databaseQueryReadonly.query';
import { DatabaseSchemaDescribeQuery } from './queries/databaseSchemaDescribe.query';
import { DatabaseSchemasDataView } from './views';

export const databaseOperationContracts = {
	DatabaseSchemaDescribeQuery,
	DatabaseMigrationsListQuery,
	DatabaseDictionaryGetQuery,
	DatabaseQueryReadonlyQuery,
};

export const databaseCapabilityContracts = {
	DatabaseContextCapability,
};

export const databaseDataViewContracts = {
	DatabaseSchemasDataView,
};

export function registerDatabaseOperations(registry: OperationSpecRegistry) {
	return registry
		.register(DatabaseSchemaDescribeQuery)
		.register(DatabaseMigrationsListQuery)
		.register(DatabaseDictionaryGetQuery)
		.register(DatabaseQueryReadonlyQuery);
}

export function registerDatabaseCapabilities(registry: CapabilityRegistry) {
	return registry.register(DatabaseContextCapability);
}

export function registerDatabaseDataViews(registry: DataViewRegistry) {
	return registry.register(DatabaseSchemasDataView);
}
