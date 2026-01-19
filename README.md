# ContractSpec

[![npm version](https://img.shields.io/npm/v/contractspec)](https://www.npmjs.com/package/contractspec)
[![npm downloads](https://img.shields.io/npm/dt/contractspec)](https://www.npmjs.com/package/contractspec)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lssm-tech/contractspec)


Website: [https://contractspec.io](https://contractspec.io)

**Stabilize your AI-generated code**

The deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. You keep your app. You own the code. We're the compiler, not the prison.

<p align="center">
  <img src="https://www.contractspec.io/icon.png" alt="ContractSpec Logo" width="300" height="300">
</p>

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
bunx contractspec init

# Create a contract spec
contractspec create --type operation

# Generate implementation
contractspec build src/contracts/mySpec.ts

# Validate spec
contractspec validate src/contracts/mySpec.ts
```

See the [CLI documentation](packages/apps/cli-contractspec/README.md) for full usage.

## Example Contract

```typescript
import { defineCommand } from '@contractspec/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

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
    version: '1.0.0',
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

| npm                                                                                                                                                  | Package                                                             | Description                                      |
|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------| ------------------------------------------------ |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.contracts)](https://www.npmjs.com/package/@contractspec/lib.contracts)               |  [`@contractspec/lib.contracts`](packages/libs/contracts/README.md) | Core contract definitions and runtime adapters                                    |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.schema)](https://www.npmjs.com/package/@contractspec/lib.schema)                     |  [`@contractspec/lib.schema`](packages/libs/schema/README.md)                                                                          | Schema definitions for multi-surface consistency                    |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/app.cli-contractspec)](https://www.npmjs.com/package/@contractspec/app.cli-contractspec) |  [`@contractspec/app.cli-contractspec`](packages/apps/cli-contractspec/README.md)                                                     | CLI for creating, building, and validating specs                    |

### AI & Evolution

| npm                                                                                                                                    | Package                                                             | Description                                     |
|----------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------| ----------------------------------------------- |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)   | [`@contractspec/lib.ai-agent`](packages/libs/ai-agent/README.md)    | AI agent orchestration with contract governance |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.evolution)](https://www.npmjs.com/package/@contractspec/lib.evolution) | [`@contractspec/lib.evolution`](packages/libs/evolution/README.md)  | Auto-evolution and safe regeneration            |

### Testing & Quality

| npm                                                                                                                                            | Package                                                                       | Description                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------| ----------------------------------------------- |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.testing)](https://www.npmjs.com/package/@contractspec/lib.testing)             | [`@contractspec/lib.testing`](packages/libs/testing/README.md)                | Golden tests for safe regeneration verification |
| [![npm version](https://img.shields.io/npm/dt/@contractspec/lib.observability)](https://www.npmjs.com/package/@contractspec/lib.observability) | [`@contractspec/lib.observability`](packages/libs/observability/README.md)    | Tracing, metrics, and structured logging        |

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

- [Website](https://contractspec.io)
- [CLI Quick Start](packages/apps/cli-contractspec/QUICK_START.md)
- [Agent Modes](packages/apps/cli-contractspec/AGENT_MODES.md)
- [Examples](packages/examples/)

## License

MIT










