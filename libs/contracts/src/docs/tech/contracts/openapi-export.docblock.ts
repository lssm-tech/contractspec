import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_contracts_openapi_export_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.openapi-export',
    title: 'OpenAPI export (OpenAPI 3.1) from OperationSpecRegistry',
    summary:
      'Generate a deterministic OpenAPI document from a OperationSpecRegistry using jsonSchemaForSpec + REST transport metadata.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/openapi-export',
    tags: ['contracts', 'openapi', 'rest'],
    body: `## OpenAPI export (OpenAPI 3.1) from OperationSpecRegistry

### Purpose

ContractSpec specs can be exported into an **OpenAPI 3.1** document for tooling (SDK generation, docs, gateways).

The export is **spec-first**:

- Uses \`jsonSchemaForSpec(spec)\` for input/output JSON Schema (from SchemaModel → zod → JSON Schema)
- Uses \`spec.transport.rest.method/path\` when present
- Falls back to deterministic defaults:
  - Method: \`POST\` for commands, \`GET\` for queries
  - Path: \`defaultRestPath(name, version)\` → \`/<dot/name>/v<version>\`

### Library API

- Function: \`openApiForRegistry(registry, options?)\`
- Location: \`@contractspec/lib.contracts/openapi\`

### CLI

Export OpenAPI from a registry module:

\`\`\`bash
contractspec openapi --registry ./src/registry.ts --out ./openapi.json
\`\`\`

The registry module must export one of:

- \`registry: OperationSpecRegistry\`
- \`default(): OperationSpecRegistry | Promise<OperationSpecRegistry>\`
- \`createRegistry(): OperationSpecRegistry | Promise<OperationSpecRegistry>\`

### Notes / limitations (current)

- Responses are generated as a basic \`200\` response (plus schemas when available).
- Query (GET) inputs are currently represented as a JSON request body when an input schema exists.
- Errors are not yet expanded into OpenAPI responses; that will be added when we standardize error envelopes.`,
  },
];

registerDocBlocks(tech_contracts_openapi_export_DocBlocks);
