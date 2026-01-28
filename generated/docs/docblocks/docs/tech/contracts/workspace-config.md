## Workspace Configuration (.contractsrc)

ContractSpec uses a hierarchical configuration system anchored by `.contractsrc.json` files. Configuration loader supports standard rc-file discovery (cosmiconfig).

### Schema Formats

The `schemaFormat` option controls the output format of schema generation commands (like `contractspec openapi import`).

Supported formats:
- `contractspec` (default): Generates standard `defineSchemaModel` code.
- `zod`: Generates raw Zod schemas using `z.object({...})`.
- `json-schema`: Generates JSON Schema definitions.
- `graphql`: Generates GraphQL SDL type definitions.

### Config Interface

```ts
export interface ContractsrcConfig {
  // ... existing fields ...
  schemaFormat?: 'contractspec' | 'zod' | 'json-schema' | 'graphql';
}
```

Defined in `@contractspec/lib.contracts/workspace-config`.
