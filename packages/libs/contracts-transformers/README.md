# @lssm/lib.contracts-transformers

Contract format transformations: bidirectional import/export between ContractSpec and external API specification formats.

## Supported Formats

- **OpenAPI 3.x** - Import from and export to OpenAPI specifications (JSON/YAML, URL/file)

## Installation

```bash
bun add @lssm/lib.contracts-transformers
```

## Usage

### Export ContractSpec to OpenAPI

```typescript
import { openApiForRegistry } from '@lssm/lib.contracts-transformers/openapi';
import { OperationSpecRegistry } from '@lssm/lib.contracts';

const registry = new OperationSpecRegistry();
// ... register your specs ...

const openApiDoc = openApiForRegistry(registry, {
  title: 'My API',
  version: '1.0.0',
  description: 'API generated from ContractSpec',
  servers: [{ url: 'https://api.example.com' }],
});
```

### Import from OpenAPI

```typescript
import { parseOpenApi, importFromOpenApi } from '@lssm/lib.contracts-transformers/openapi';

// Parse OpenAPI from file or URL
const openApiDoc = await parseOpenApi('./api.yaml');
// Or from URL
const openApiDoc = await parseOpenApi('https://api.example.com/openapi.json');

// Convert to ContractSpec specs
const importResult = importFromOpenApi(openApiDoc, {
  prefix: 'myApi',
  tags: ['users', 'orders'], // Optional: filter by tags
  exclude: ['deprecated_endpoint'], // Optional: exclude by operationId
});

// importResult contains generated spec code as strings
for (const spec of importResult.specs) {
  console.log(spec.name, spec.code);
}
```

### Diff ContractSpec vs OpenAPI

```typescript
import { diffSpecs } from '@lssm/lib.contracts-transformers/openapi';

const diffs = diffSpecs(existingSpecs, importedSpecs);

for (const diff of diffs) {
  console.log(`${diff.operationId}: ${diff.changes.length} changes`);
  for (const change of diff.changes) {
    console.log(`  - ${change.path}: ${change.type}`);
  }
}
```

## Architecture

This library is organized by format:

- `openapi/` - OpenAPI 3.x transformations
  - `parser.ts` - Parse OpenAPI from JSON/YAML/URL
  - `importer.ts` - Convert OpenAPI to ContractSpec
  - `exporter.ts` - Convert ContractSpec to OpenAPI
  - `differ.ts` - Diff specs for sync operations
  - `schema-converter.ts` - JSON Schema <-> SchemaModel conversion
- `common/` - Shared utilities and types

## Future Formats

The library is designed to be extensible for additional formats:

- AsyncAPI (event-driven APIs)
- gRPC/Protobuf
- GraphQL Schema

