# @contractspec/example.integration-hub

Website: https://contractspec.io/

A comprehensive integration hub example demonstrating ContractSpec principles for data synchronization.

## Features

- **Multi-Provider Support**: Connect to various external systems (Salesforce, HubSpot, etc.)
- **Voice Provider Coverage**: Includes seeded examples for `ai-voice.gradium` and `ai-voice.fal`
- **Analytics Coverage**: Includes seeded examples for PostHog analytics
- **Bidirectional Sync**: INBOUND, OUTBOUND, or BIDIRECTIONAL data flow
- **Field Mapping**: Configurable field mappings with transforms
- **Sync Engine**: Change detection, deduplication, and error handling
- **Scheduled Sync**: Cron-based scheduled synchronization
- **Feature Flag Integration**: Control integration availability
- **Full Audit Trail**: Track all sync operations
- **MCP-Ready Providers**: Supports provider configs that call remote MCP tools

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
import { createSyncEngine, BasicFieldTransformer } from '@contractspec/example.integration-hub/sync-engine';

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
} from '@contractspec/example.integration-hub';

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

## MCP Provider Wiring

Provider adapters in this workspace can be configured to call MCP endpoints
(for example `mcpUrl` + headers/tokens on analytics providers, or transport
selection for meeting recorder providers). This example remains provider-agnostic,
so MCP transport details stay in provider config rather than contract logic.

## Run MCP Example

This package now includes a runnable MCP connectivity example:
`src/run-mcp.ts`.

List MCP tools from a local stdio server (default):

```bash
export CONTRACTSPEC_INTEGRATION_HUB_MCP_TRANSPORT="stdio"
export CONTRACTSPEC_INTEGRATION_HUB_MCP_COMMAND="npx"
export CONTRACTSPEC_INTEGRATION_HUB_MCP_ARGS_JSON='["-y","@modelcontextprotocol/server-filesystem","."]'

bun run --filter @contractspec/example.integration-hub run:mcp
```

Call a specific MCP tool:

```bash
export CONTRACTSPEC_INTEGRATION_HUB_MCP_MODE="call"
export CONTRACTSPEC_INTEGRATION_HUB_MCP_TOOL_NAME="read_file"
export CONTRACTSPEC_INTEGRATION_HUB_MCP_TOOL_ARGS_JSON='{"path":"README.md"}'

bun run --filter @contractspec/example.integration-hub run:mcp
```

Remote MCP transport is also supported via:

- `CONTRACTSPEC_INTEGRATION_HUB_MCP_TRANSPORT=http|sse`
- `CONTRACTSPEC_INTEGRATION_HUB_MCP_URL`
- `CONTRACTSPEC_INTEGRATION_HUB_MCP_HEADERS_JSON` (optional)
- `CONTRACTSPEC_INTEGRATION_HUB_MCP_ACCESS_TOKEN` or `..._ACCESS_TOKEN_ENV` (optional)

## Dependencies

- `@contractspec/lib.identity-rbac` - User identity and roles
- `@contractspec/lib.feature-flags` - Feature flag control
- `@contractspec/lib.files` - Import/export file handling
- `@contractspec/lib.jobs` - Background sync jobs
- `@contractspec/module.audit-trail` - Action auditing
