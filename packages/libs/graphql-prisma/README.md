# @lssm/lib.graphql-prisma

Prisma integration for Pothos GraphQL schemas.

## Purpose

To seamlessly integrate Prisma models into the Pothos GraphQL builder, allowing for type-safe field definition based on the database schema.

## Installation

```bash
npm install @lssm/lib.graphql-prisma
# or
bun add @lssm/lib.graphql-prisma
```

## Key Concepts

- **Pothos Prisma Plugin**: Automatically exposes Prisma models as GraphQL types.
- **DMMF**: Uses Prisma's DMMF for type generation.

## Usage

```ts
import { builder } from '@lssm/lib.graphql-prisma';
import { prisma } from '@lssm/lib.database';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});
```

