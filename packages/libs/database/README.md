# @lssm/lib.database

Prisma wrapper and CLI tools for managing database schemas, migrations, and seeding within the LSSM monorepo.

## Purpose

To abstract and standardize Prisma usage across multiple services and verticals. It provides a unified CLI (`database`) to handle common database tasks like migrations (`dbs:migrate`), client generation (`dbs:generate`), and seeding (`dbs:seed`).

## Installation

```bash
npm install @lssm/lib.database
# or
bun add @lssm/lib.database
```

## Key Concepts

- **Unified Config**: Centralizes Prisma configuration.
- **CLI Wrapper**: Wraps standard Prisma commands for consistent execution in the monorepo environment.
- **Seeding**: Standardized seeding entry point.

## Exports

- `cli`: The command-line interface.
- `prisma`: Re-exports `@prisma/client`.

## Usage

### CLI Commands

Run via package scripts:

```bash
# Generate Prisma Client
bun database generate

# Run migrations
bun database migrate:dev

# Seed database
bun database seed
```

### In Code

```ts
import { PrismaClient } from '@lssm/lib.database';

const prisma = new PrismaClient();
const users = await prisma.user.findMany();
```




