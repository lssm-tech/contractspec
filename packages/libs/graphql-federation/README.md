# @lssm/lib.graphql-federation

GraphQL Federation utilities for Pothos.

## Purpose

To enable Apollo Federation support for Pothos schemas. This package configures the `@pothos/plugin-federation` and provides helpers for defining entities and resolving references.

## Installation

```bash
npm install @lssm/lib.graphql-federation
# or
bun add @lssm/lib.graphql-federation
```

## Key Concepts

- **Federation**: Apollo Federation V2 support.
- **Entities**: defining `key` fields and `resolveReference` methods.

## Usage

```ts
import { builder } from '@lssm/lib.graphql-core';
import '@lssm/lib.graphql-federation'; // Side-effect import to register plugin if needed, or use factory

builder.asEntity(User, {
  key: builder.selection<{ id: string }>('id'),
  resolveReference: (ref) => getUser(ref.id),
});
```






















