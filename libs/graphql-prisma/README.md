# @contractspec/lib.graphql-prisma

Website: https://contractspec.io/


Prisma integration for Pothos GraphQL schemas.

## Purpose

To seamlessly integrate Prisma models into the Pothos GraphQL builder, allowing for type-safe field definition based on the database schema.

## Installation

```bash
npm install @contractspec/lib.graphql-prisma
# or
bun add @contractspec/lib.graphql-prisma
```

## Key Concepts

- **Pothos Prisma Plugin**: Automatically exposes Prisma models as GraphQL types.
- **DMMF**: Uses Prisma's DMMF for type generation.

## Usage

```ts
import { builder } from '@contractspec/lib.graphql-prisma';
import { prisma } from '@contractspec/app.cli-database';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
  }),
});
```


































