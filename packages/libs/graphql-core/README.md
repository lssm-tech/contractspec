# @lssm/lib.graphql-core

Website: https://contractspec.lssm.tech/


Core GraphQL utilities and Pothos builder setup.

## Purpose

To provide a pre-configured Pothos `SchemaBuilder` with common plugins (Complexity, Tracing, Relay, Dataloader) and standard scalar types. This ensures all GraphQL services in the monorepo start with a consistent baseline.

## Installation

```bash
npm install @lssm/lib.graphql-core
# or
bun add @lssm/lib.graphql-core
```

## Key Concepts

- **Shared Builder**: A factory or base builder configuration.
- **Scalars**: Common scalars like `DateTime`, `JSON`, etc.
- **Plugins**: Pre-wired plugins for performance and features.

## Exports

- `builder`: The configured Pothos builder factory.
- `scalars`: Re-exported scalars.

## Usage

```ts
import { builder } from '@lssm/lib.graphql-core';

builder.queryType({
  fields: (t) => ({
    hello: t.string({ resolve: () => 'world' }),
  }),
});

export const schema = builder.toSchema();
```


































