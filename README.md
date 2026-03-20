# ContractSpec

[![npm version](https://img.shields.io/npm/v/contractspec)](https://www.npmjs.com/package/contractspec)
[![npm downloads](https://img.shields.io/npm/dt/contractspec)](https://www.npmjs.com/package/contractspec)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lssm-tech/contractspec)

Website: [https://contractspec.io](https://contractspec.io)

**Stabilize your AI-generated code**

The open spec system for AI-native software. Define explicit contracts, keep every surface aligned, regenerate safely, and adopt Studio when you want the operating layer on top.

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

## Open, Ejectable Foundation

ContractSpec is an **open system**, not a closed platform:

- ✅ Generated code is **standard TypeScript** you can read and modify
- ✅ Uses **standard tech** (Prisma, GraphQL, Zod, React)
- ✅ **No proprietary runtime** — eject anytime, keep everything
- ✅ **Incremental adoption** — start with one module, expand at your pace

## Quick Start

Choose one verified starting path. For the public CLI onboarding flows below, use Bun on Linux or macOS.

### Greenfield

```bash
bun add -D contractspec
contractspec quickstart
contractspec init
contractspec create --type operation
contractspec generate
contractspec ci
```

### Brownfield OpenAPI Import

```bash
bun add -D contractspec
contractspec init
contractspec openapi import path/to/openapi.yaml
contractspec ci
```

### Example-First Exploration

```bash
bun add -D contractspec
contractspec examples list
contractspec examples init crm-pipeline
```

See the [CLI documentation](packages/apps/cli-contractspec/README.md) and [tutorials](docs/tutorials) for the maintained onboarding flows.

## Support Matrix

| Area | Supported Path |
| --- | --- |
| Package manager | `bun` 1.3.x is first-class for CLI onboarding and daily use |
| Operating system | Linux and macOS are covered by packaged smoke tests; Windows is not yet a supported CLI onboarding target |
| Alternate package managers | `npm` and `pnpm` can install libraries, but the `contractspec` CLI onboarding path is not yet certified on them |
| Greenfield onboarding | `contractspec quickstart` + `contractspec init` |
| Brownfield onboarding | `contractspec openapi import` |
| Example exploration | `contractspec examples list` + `contractspec examples init` |
| CI validation | `contractspec ci` (`--check-drift` optional when generated artifacts are part of the contract) |
| Diagnostics | `contractspec doctor` (read-only), `contractspec doctor --fix` (repair mode) |

## First-Class Surfaces

- **Contracts and generation**: `@contractspec/lib.contracts-spec`, the main CLI, and runtime adapters for REST, GraphQL, MCP, and React.
- **Agent and chat runtime**: `@contractspec/lib.ai-agent` and `@contractspec/module.ai-chat` for tool-aware, MCP-aware, agent-governed experiences.
- **Harness and evaluation**: `@contractspec/lib.harness` and `@contractspec/integration.harness-runtime` for controlled inspection, replay, evaluation, and proof-oriented workflows.
- **Ranking and MCP operations**: provider-ranking module and MCP surfaces for ingesting benchmarks, refreshing rankings, and serving leaderboards.
- **Docs, registry, and Studio**: the public docs/web app, the agentpacks registry surfaces, and ContractSpec Studio's trusted operating loop.

## Trust & Verification

- Published npm packages are shipped from provenance-enabled GitHub Actions runs, and each release run uploads a manifest artifact with package name, version, dist-tag, tarball filename, and SHA256.
- Run `bun run repo:health` in this repo to reproduce the baseline trust checks locally: doctor, contract CI, and example validation.
- Verify the published CLI tag with `npm view contractspec dist-tags --json`.
- Verify a specific published package with `npm view contractspec@<version> dist.tarball dist.integrity --json`.
- Security disclosure and support expectations are documented in [SECURITY.md](SECURITY.md).

## GitHub Actions Quickstart

Use the ContractSpec actions directly; this repo's workflows are thin wrappers around them.

### PR checks

```yaml
name: ContractSpec PR
on: pull_request
jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: ContractSpec PR checks
        uses: lssm-tech/contractspec/packages/apps/action-pr@main
        with:
          generate-command: 'bun contractspec generate'
```

### Drift check

```yaml
name: ContractSpec Drift
on:
  push:
    branches: [main]
jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: ContractSpec drift check
        uses: lssm-tech/contractspec/packages/apps/action-drift@main
        with:
          generate-command: 'bun contractspec generate'
```

Notes: add `pull-requests: write` permissions for PR comments, and add `contents: write` + `pull-requests: write` for drift PR creation.

### Inputs (defaults)

| Action | Input                   | Default   | Notes                               |
| ------ | ----------------------- | --------- | ----------------------------------- |
| PR     | `package-manager`       | `bun`     | `bun`, `npm`, `pnpm`, `yarn`        |
| PR     | `working-directory`     | `.`       | Repo root or package path           |
| PR     | `report-mode`           | `summary` | `summary`, `comment`, `both`, `off` |
| PR     | `enable-drift`          | `true`    | Runs generate + drift check         |
| PR     | `fail-on`               | `any`     | `breaking`, `drift`, `any`, `never` |
| PR     | `generate-command`      | required  | Required when drift enabled         |
| PR     | `contracts-dir`         | empty     | Directory for contract changes      |
| PR     | `contracts-glob`        | empty     | Glob for contract changes           |
| Drift  | `generate-command`      | required  | Regenerate artifacts                |
| Drift  | `on-drift`              | `fail`    | `fail`, `issue`, `pr`               |
| Drift  | `drift-paths-allowlist` | empty     | Comma-separated globs               |

### Sample output

```markdown
## ContractSpec Report

### 1) What changed

2 contract file(s) changed.
```

## ContractSpec Studio

[ContractSpec Studio](https://www.contractspec.studio) is the operating product built on top of ContractSpec.

It starts with one trusted product loop for certified live signals, reviewed drafts, supervised exports, and scheduled checks:

```text
Activate -> Connect -> Draft -> Review -> Export -> Check
```

- **Operate**: Run the trusted loop with certified connectors, reviewed work drafts, guarded exports, and follow-up checks.
- **Explore**: Scan any company's public signals to generate Spec Packs, Drift Registers, competitive analysis, and other structured deliverables.
- **Current certified wedge**: Sandbox activation, PostHog, Slack, GitHub, Linear, and Notion.
- **Governance first**: Self-serve workspaces stay draft-only before export, with policy gates, audit trails, retention controls, and no autopilot code push, PR merge, or deployment in v0.

`contractspec` is the open foundation: contracts, generation, runtimes, harnesses, and agent-facing surfaces. Studio is the operating layer that runs on top of it across web, API, and MCP surfaces.

[**Try Studio**](https://www.contractspec.studio)

## Example Contract

```typescript
import { defineCommand } from '@contractspec/lib.contracts-spec';
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

### Contracts Core

| npm                                                                                                                                                                | Package                                                                                      | Description                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-spec)](https://www.npmjs.com/package/@contractspec/lib.contracts-spec)                 | [`@contractspec/lib.contracts-spec`](packages/libs/contracts-spec/README.md)                 | Core contract declarations, registries, policy, workflow, and shared spec types |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-integrations)](https://www.npmjs.com/package/@contractspec/lib.contracts-integrations) | [`@contractspec/lib.contracts-integrations`](packages/libs/contracts-integrations/README.md) | Integration definitions (providers, capabilities, connection/runtime metadata)  |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.schema)](https://www.npmjs.com/package/@contractspec/lib.schema)                                 | [`@contractspec/lib.schema`](packages/libs/schema/README.md)                                 | Schema definitions for multi-surface consistency                                |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/app.cli-contractspec)](https://www.npmjs.com/package/@contractspec/app.cli-contractspec)             | [`@contractspec/app.cli-contractspec`](packages/apps/cli-contractspec/README.md)             | CLI for creating, generating, validating, and running CI checks                 |

### Contracts Runtime Adapters

| npm                                                                                                                                                                                    | Package                                                                                                          | Description                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-runtime-client-react)](https://www.npmjs.com/package/@contractspec/lib.contracts-runtime-client-react)     | [`@contractspec/lib.contracts-runtime-client-react`](packages/libs/contracts-runtime-client-react/README.md)     | React runtime adapters for forms and feature rendering                         |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-runtime-server-rest)](https://www.npmjs.com/package/@contractspec/lib.contracts-runtime-server-rest)       | [`@contractspec/lib.contracts-runtime-server-rest`](packages/libs/contracts-runtime-server-rest/README.md)       | REST server adapters (`rest-next-app`, `rest-express`, `rest-elysia`, generic) |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-runtime-server-graphql)](https://www.npmjs.com/package/@contractspec/lib.contracts-runtime-server-graphql) | [`@contractspec/lib.contracts-runtime-server-graphql`](packages/libs/contracts-runtime-server-graphql/README.md) | GraphQL runtime adapter (`graphql-pothos`)                                     |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts-runtime-server-mcp)](https://www.npmjs.com/package/@contractspec/lib.contracts-runtime-server-mcp)         | [`@contractspec/lib.contracts-runtime-server-mcp`](packages/libs/contracts-runtime-server-mcp/README.md)         | MCP runtime adapter (`provider-mcp` + MCP registrars)                          |

### AI & Evolution

| npm                                                                                                                                        | Package                                                              | Description                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------- |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)     | [`@contractspec/lib.ai-agent`](packages/libs/ai-agent/README.md)     | AI agent orchestration with contract governance |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/module.ai-chat)](https://www.npmjs.com/package/@contractspec/module.ai-chat) | [`@contractspec/module.ai-chat`](packages/modules/ai-chat/README.md) | Reusable AI chat system                         |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.evolution)](https://www.npmjs.com/package/@contractspec/lib.evolution)   | [`@contractspec/lib.evolution`](packages/libs/evolution/README.md)   | Auto-evolution and safe regeneration            |

### Runtime, MCP & Evaluation

| npm                                                                                                                                                                   | Package                                                                                              | Description                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.harness)](https://www.npmjs.com/package/@contractspec/lib.harness)                                 | [`@contractspec/lib.harness`](packages/libs/harness/README.md)                                       | Harness orchestration, evidence, policy, replay, and evaluation runtime         |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/integration.harness-runtime)](https://www.npmjs.com/package/@contractspec/integration.harness-runtime) | [`@contractspec/integration.harness-runtime`](packages/integrations/harness-runtime/README.md)       | Runtime adapters for browser, sandbox, artifact, and MCP-backed harness targets |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/module.provider-ranking)](https://www.npmjs.com/package/@contractspec/module.provider-ranking)         | [`@contractspec/module.provider-ranking`](packages/modules/provider-ranking/README.md)               | Ranking pipelines, storage, and orchestration for provider benchmark data        |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/app.provider-ranking-mcp)](https://www.npmjs.com/package/@contractspec/app.provider-ranking-mcp)       | [`@contractspec/app.provider-ranking-mcp`](packages/apps/provider-ranking-mcp/README.md)             | MCP server for ranking ingest, refresh, leaderboards, and model-profile queries  |

### Testing & Quality

| npm                                                                                                                                              | Package                                                                    | Description                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------- |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.testing)](https://www.npmjs.com/package/@contractspec/lib.testing)             | [`@contractspec/lib.testing`](packages/libs/testing/README.md)             | Golden tests for safe regeneration verification |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.observability)](https://www.npmjs.com/package/@contractspec/lib.observability) | [`@contractspec/lib.observability`](packages/libs/observability/README.md) | Tracing, metrics, and structured logging        |

### Legacy Package

| npm                                                                                                                                      | Package                                                                         | Description                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.contracts)](https://www.npmjs.com/package/@contractspec/lib.contracts) | [`@contractspec/lib.contracts` (deprecated)](packages/libs/contracts/README.md) | Deprecated monolith kept as migration marker; use split packages above |

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
- [CLI Documentation](packages/apps/cli-contractspec/README.md)
- [Examples](packages/examples/)

## License

MIT
