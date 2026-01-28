## OpenAPI Import (OpenAPI 3.1)

### Purpose

Import external API definitions into your codebase. Supports both one-time scaffolding and multi-format generation for integration.

### Modes

#### 1. ContractSpec Scaffolding (Default)

Generates standard `defineSchemaModel` definitions for full ContractSpec integration.

```bash
contractspec openapi import --file api.json --output ./src/contracts
```

#### 2. Multi-Format Generation

Generate schemas in specific formats for direct use in other parts of your stack (adapters, UI, etc.).

- **Zod**: Pure Zod schemas (`z.object(...)`).
- **GraphQL**: GraphQL SDL type definitions.
- **JSON Schema**: Standard JSON Schema objects.

```bash
# Generate Zod schemas suitable for runtime validation
contractspec openapi import --file api.json --output ./src/zod --schema-format zod
```

### Library API

- Function: `importFromOpenApi(doc, options)`
- Location: `@contractspec/lib.contracts-transformers/openapi`
- Options:
  - `schemaFormat`: 'contractspec' | 'zod' | 'json-schema' | 'graphql'
  - `prefix`: Prefix for model names
  - `tags`: Filter by OpenAPI tags

### CLI

```bash
contractspec openapi import --file <path-or-url> --output <dir> [--schema-format <format>]
```
