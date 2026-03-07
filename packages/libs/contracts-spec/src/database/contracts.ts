import type { CapabilityRegistry } from '../capabilities';
import type { OperationSpecRegistry } from '../operations/registry';
import type { DataViewRegistry } from '../data-views';
import { DatabaseSchemaDescribeQuery } from './queries/databaseSchemaDescribe.query';
import { DatabaseMigrationsListQuery } from './queries/databaseMigrationsList.query';
import { DatabaseDictionaryGetQuery } from './queries/databaseDictionaryGet.query';
import { DatabaseQueryReadonlyQuery } from './queries/databaseQueryReadonly.query';
import { DatabaseContextCapability } from './capabilities';
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
