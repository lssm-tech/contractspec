# @lssm/example.integration-hub

A comprehensive integration hub example demonstrating ContractSpec principles for data synchronization.

## Features

- **Multi-Provider Support**: Connect to various external systems (Salesforce, HubSpot, etc.)
- **Bidirectional Sync**: INBOUND, OUTBOUND, or BIDIRECTIONAL data flow
- **Field Mapping**: Configurable field mappings with transforms
- **Sync Engine**: Change detection, deduplication, and error handling
- **Scheduled Sync**: Cron-based scheduled synchronization
- **Feature Flag Integration**: Control integration availability
- **Full Audit Trail**: Track all sync operations

## Entities

### Core
- `Integration` - Integration definition
- `Connection` - Authenticated connection to external system
- `SyncConfig` - Sync configuration for object pairs
- `FieldMapping` - Field-level mapping configuration

### Sync Execution
- `SyncRun` - A single sync execution
- `SyncLog` - Log entries for a sync run
- `SyncRecord` - Tracks synced records for deduplication

## Contracts

### Integration Management
- `integration.create` - Create a new integration
- `integration.connection.create` - Create a connection

### Sync Configuration
- `integration.syncConfig.create` - Create sync config
- `integration.fieldMapping.add` - Add field mapping

### Sync Execution
- `integration.sync.trigger` - Trigger manual sync
- `integration.syncRun.list` - List sync history

## Field Mapping Types

- **DIRECT**: Direct field copy
- **TRANSFORM**: Apply transformation expression
- **LOOKUP**: Lookup from another object
- **CONSTANT**: Fixed value
- **COMPUTED**: Computed from multiple fields

## Sync Engine

The sync engine handles:

1. **Change Detection**: Uses checksums to detect changes
2. **Transformation**: Applies field mappings
3. **Validation**: Validates required fields
4. **Deduplication**: Tracks synced records

```typescript
import { createSyncEngine, BasicFieldTransformer } from '@lssm/example.integration-hub/sync-engine';

const engine = createSyncEngine();

const result = engine.transformRecord(
  { id: '123', data: { FirstName: 'John', LastName: 'Doe' } },
  [
    { sourceField: 'FirstName', targetField: 'first_name', mappingType: 'DIRECT' },
    { sourceField: 'LastName', targetField: 'last_name', mappingType: 'TRANSFORM', transformExpression: 'uppercase' },
  ],
  context
);
// { id: '123', data: { first_name: 'John', last_name: 'DOE' } }
```

## Transform Expressions

- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase
- `trim` - Trim whitespace
- `default:value` - Set default value
- `concat:separator` - Join array
- `split:separator` - Split string
- `number` - Convert to number
- `boolean` - Convert to boolean
- `string` - Convert to string

## Events

- `integration.created` - Integration created
- `integration.connection.created` - Connection created
- `integration.connection.statusChanged` - Connection status changed
- `integration.syncConfig.created` - Sync config created
- `integration.sync.started` - Sync started
- `integration.sync.completed` - Sync completed
- `integration.sync.failed` - Sync failed
- `integration.record.synced` - Record synced

## Usage

```typescript
import { 
  CreateIntegrationContract,
  CreateSyncConfigContract,
  TriggerSyncContract,
  integrationHubSchemaContribution 
} from '@lssm/example.integration-hub';

// Create integration
const integration = await executeContract(CreateIntegrationContract, {
  name: 'Salesforce CRM',
  slug: 'salesforce-crm',
  provider: 'salesforce',
});

// Create sync config
const syncConfig = await executeContract(CreateSyncConfigContract, {
  integrationId: integration.id,
  connectionId: connection.id,
  name: 'Contacts Sync',
  direction: 'BIDIRECTIONAL',
  sourceObject: 'Contact',
  targetObject: 'contacts',
});

// Trigger sync
const run = await executeContract(TriggerSyncContract, {
  syncConfigId: syncConfig.id,
});
```

## Dependencies

- `@lssm/lib.identity-rbac` - User identity and roles
- `@lssm/lib.feature-flags` - Feature flag control
- `@lssm/lib.files` - Import/export file handling
- `@lssm/lib.jobs` - Background sync jobs
- `@lssm/module.audit-trail` - Action auditing















