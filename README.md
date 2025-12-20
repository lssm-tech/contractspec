# ContractSpec

**Stabilize your AI-generated code**

The deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. You keep your app. You own the code. We're the compiler, not the prison.

## The Problem

In 2025, "vibe coding" and AI agents generate enormous amounts of code. But they have critical limitations:

- **Can't enforce invariants** — AI-generated code drifts from business rules over time
- **Break multi-surface consistency** — API, DB, UI, and events get out of sync
- **Hallucinate refactors** — AI "improvements" introduce subtle bugs and break contracts
- **Destroy long-term maintainability** — No source of truth, no safe regeneration path

**The result:** Teams ship fast initially, then spend months untangling AI-generated spaghetti.

## How ContractSpec Works

1. **Define contracts once** — Write specs in TypeScript. Just types and Zod schemas you already know.
2. **Generate all surfaces** — One spec generates API, DB schema, UI types, events, and MCP tools.
3. **Regenerate safely** — Update specs, regenerate code. Invariants are enforced. Breaking changes caught at compile time.
4. **AI reads specs** — AI agents read contracts as their source of truth, not implementations.

## What Gets Generated

From a single contract spec:

| Surface           | Output                              |
| ----------------- | ----------------------------------- |
| **REST API**      | Type-safe endpoints with validation |
| **GraphQL**       | Schema and resolvers                |
| **Database**      | Prisma migrations and types         |
| **MCP Tools**     | AI agent tool definitions           |
| **Client SDK**    | Type-safe API clients               |
| **UI Components** | React forms and views               |

## No Lock-in

ContractSpec is a **compiler**, not a platform:

- ✅ Generated code is **standard TypeScript** you can read and modify
- ✅ Uses **standard tech** (Prisma, GraphQL, Zod, React)
- ✅ **No proprietary runtime** — eject anytime, keep everything
- ✅ **Incremental adoption** — start with one module, expand at your pace

## Quick Start

```bash
# Install the CLI
pnpm add -D @lssm/tool.contracts-cli

# Create a contract spec
contractspec create --type operation

# Generate implementation
contractspec build src/contracts/mySpec.ts

# Validate spec
contractspec validate src/contracts/mySpec.ts
```

See the [CLI documentation](packages/apps/cli-contracts/README.md) for full usage.

## Example Contract

```typescript
import { defineCommand } from '@lssm/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const UserInput = new SchemaModel({
  name: 'UserInput',
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

export const CreateUser = defineCommand({
  meta: {
    name: 'user.create',
    version: 1,
    description: 'Register a new user',
    owners: ['team-auth'],
    tags: ['auth'],
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

## Packages

### Core

| Package                                                             | Description                                      |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| [`@lssm/lib.contracts`](packages/libs/contracts/README.md)          | Core contract definitions and runtime adapters   |
| [`@lssm/lib.schema`](packages/libs/schema/README.md)                | Schema definitions for multi-surface consistency |
| [`@lssm/tool.contracts-cli`](packages/apps/cli-contracts/README.md) | CLI for creating, building, and validating specs |

### AI & Evolution

| Package                                                    | Description                                     |
| ---------------------------------------------------------- | ----------------------------------------------- |
| [`@lssm/lib.ai-agent`](packages/libs/ai-agent/README.md)   | AI agent orchestration with contract governance |
| [`@lssm/lib.evolution`](packages/libs/evolution/README.md) | Auto-evolution and safe regeneration            |

### Testing & Quality

| Package                                                            | Description                                     |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| [`@lssm/lib.testing`](packages/libs/testing/README.md)             | Golden tests for safe regeneration verification |
| [`@lssm/lib.observability`](packages/libs/observability/README.md) | Tracing, metrics, and structured logging        |

### Infrastructure

| Package                                                                          | Description                     |
| -------------------------------------------------------------------------------- | ------------------------------- |
| [`@lssm/lib.progressive-delivery`](packages/libs/progressive-delivery/README.md) | Canary deployments and rollback |
| [`@lssm/lib.multi-tenancy`](packages/libs/multi-tenancy/README.md)               | Tenant isolation utilities      |

## Who It's For

**AI-Native Startups & Technical Founders**

- Using Cursor, Copilot, Claude, or AI agents heavily
- Messy AI-generated backends, inconsistent APIs
- Need to stabilize without rewriting

**Small Teams with AI-Generated Chaos**

- Shipped fast with AI, now have tech debt
- Multiple surfaces out of sync
- Need incremental stabilization

**AI Dev Agencies**

- Building many projects for clients
- Need reusable templates and consistent quality
- Need professional handoff artifacts

## Learn More

- [CLI Quick Start](packages/apps/cli-contracts/QUICK_START.md)
- [Agent Modes](packages/apps/cli-contracts/AGENT_MODES.md)
- [Examples](packages/examples/)

## License

MIT



