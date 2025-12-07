# @lssm/lib.contracts

**The core of ContractSpec** — Define contracts once, generate consistent code across all surfaces.

Unified specifications for Operations (commands/queries), Events, and Presentations. Contracts serve as the canonical source of truth that AI agents and code generators read to understand system constraints.

## Purpose

To provide a single, typed source of truth for backend operations (`ContractSpec`), events (`EventSpec`), and UI/data presentations. This enables **runtime adapters** (REST, GraphQL, MCP, UI) to automatically generate endpoints, schemas, and user interfaces without code duplication.

## Installation

```bash
npm install @lssm/lib.contracts @lssm/lib.schema
# or
bun add @lssm/lib.contracts @lssm/lib.schema
```

## Key Concepts

- **Spec-First, TypeScript-First**: Define operations in pure TypeScript (no YAML).
- **Runtime Adapters**: The `SpecRegistry` is passed to adapters (e.g., `makeNextAppHandler`) to serve APIs dynamically. There is no intermediate "compile" step to generate code; the spec _is_ the code.
- **Capabilities**: `defineCommand` (writes) and `defineQuery` (reads) with Zod-backed I/O.
- **Events**: `defineEvent` for type-safe side effects.
- **Presentations**: (V2) Describe how data is rendered (Web Components, Markdown, Data) for automated UI generation.

## Exports

- **Core**: `SpecRegistry`, `defineCommand`, `defineQuery`, `defineEvent`.
- **Adapters**:
  - `server/rest-next-app`: Next.js App Router adapter.
  - `server/provider-mcp`: Model Context Protocol (MCP) adapter for AI agents.
  - `server/graphql-pothos`: GraphQL schema generator.
- **Docs**: `markdown` utilities to generate human-readable documentation from specs.

## Usage

### 1. Define a Spec

```ts
import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import * as z from "zod";
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const UserInput = new SchemaModel({
  name: 'UserInput',
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
  },
});

export const CreateUser = defineCommand({
  meta: {
    name: 'user.create',
    version: 1,
    description: 'Register a new user',
    owners: ['team-auth'],
    tags: ['auth'],
    goal: 'Onboard users',
    context: 'Public registration',
    stability: 'stable',
  },
  io: {
    input: UserInput,
    output: new SchemaModel({
      name: 'UserOutput',
      fields: {
        id: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'anonymous',
  },
});
```

### 2. Register and Implement

```ts
import { SpecRegistry, installOp } from '@lssm/lib.contracts';

const reg = new SpecRegistry();

installOp(reg, CreateUser, async (ctx, input) => {
  // Implementation logic here
  return { id: '123' };
});
```

### 3. Serve (Next.js Adapter)

```ts
// app/api/[...route]/route.ts
import { makeNextAppHandler } from '@lssm/lib.contracts/server/rest-next-app';

const handler = makeNextAppHandler(reg, (req) => ({ actor: 'anonymous' }));

export { handler as GET, handler as POST };
```
