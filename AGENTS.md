# AI Agent Guide (`AGENTS.md`)

> **Role**: You are an expert software engineer and architect working on the **ContractSpec** monorepo.
> **Mission**: Build the safety layer for AI-native software. Stabilization, not replacement.
> **Source of Truth**: This file defines the map of the territory, rules of engagement, and available tools.

## 🗺️ Map of the Territory

This monorepo uses a strict layered architecture. You must understand where code lives to avoid circular dependencies and architectural drift.

### 1. `packages/libs/*` (Infrastructure & Contracts)
**Purpose**: Shared infrastructure, pure utilities, and core contracts.
- **Dependencies**: Can ONLY depend on other `libs`. NEVER depend on `bundles` or `apps`.
- **Key Packages**:
  - `contracts`: Core ContractSpec definitions (the "DNA" of the system).
  - `design-system`: UI atoms and tokens. **Source of truth for UI.**
  - `ui-kit` / `ui-kit-web`: Platform-specific UI implementations.
  - `ai-agent`: LLM integration and orchestration utilities.
  - `database`: Prisma schemas and clients.

### 2. `packages/bundles/*` (Business Domains)
**Purpose**: The core "features" of the system. Organized by **Business Domain**, not technical layer.
- **Dependencies**: Can depend on `libs`. NEVER depend on `apps`.
- **Structure**:
  - `contractspec-studio`: The main visual builder business logic.
  - `marketing`: content and implementation for the landing page.
  - `workspace`: domain logic for workspace management.
- **Internal Structure** (Domain-First):
  - `src/domain`: Pure business logic & entities.
  - `src/application`: Services & use cases.
  - `src/infrastructure`: Adapters (GraphQL, DB, API).
  - `src/presentation`: Reusable UI components (molecules/organisms).

### 3. `packages/apps/*` (Platform Adapters)
**Purpose**: Thin entry points that wire bundles together.
- **Dependencies**: Depend on `bundles` and `libs`.
- **Rule**: **NO BUSINESS LOGIC HERE.** Only routing, config, and wiring.
- **Key Apps**:
  - `web-landing`: Next.js marketing site.
  - `cli-contractspec`: The main CLI tool.
  - `api-library`: Elysia-based API server.

### 4. `packages/modules/*`
**Purpose**: Self-contained lifecycle or feature modules that don't fit into the main bundle monoliths but aren't generic enough for `libs`.
- Examples: `ai-chat`, `lifecycle-advisor`.

## 🚦 Dependency Flow & Rules

1.  **Strict Direction**: `apps` -> `bundles` -> `libs`. **Never Upward.**
2.  **No Raw HTML**: In `apps` and `bundles`, you MUST use `@contractspec/lib.design-system` components.
    - ❌ `<div className="p-4">...</div>`
    - ✅ `<Box padding="4">...</Box>`
3.  **File Size**:
    - Components: Max 150 lines.
    - Services: Max 200 lines.
    - Split immediately if limits are reached.
4.  **No `any`**: Strict TypeScript. Use `unknown` with type guards if necessary.

## 🤖 Tools & Resources for Agents

### MCP Servers
You currently have access to the following MCP servers to assist you:

-   **`contractspec-docs`**:
    -   **URL**: `https://api.contractspec.io/api/mcp/docs`
    -   **Usage**: Use this to query the official documentation, specs, and architectural decisions of the ContractSpec system. If you are unsure about a contract definition or a core concept, **ask this server first**.

### Rule Synchronization (`rulesync`)
- We use `rulesync` (defined in `.rulesync/`) to generate `.cursorrules` and other agent configs.
- **DO NOT** edit files in `.agent/` directly. Edit the source in `.rulesync/` and run the sync command if instructed.

## 📝 Coding Standards (Summary)

-   **Language**: TypeScript (Strict).
-   **Style**: Prettier + ESLint (Standard).
-   **Style**: Prettier + ESLint (Standard).
-   **Linting**: Run `bun lint` to check for issues. Fix all errors before submitting.
-   **Testing**:
    -   Run `bun test` to execute tests.
    -   **Requirement**: All new logic must have unit tests.
    -   **Approach**: Test behavior and public contracts, not implementation details.
    -   **Verification**: Run `bun test` after changes to ensure no regressions.
-   **Naming**:
    -   Files: `kebab-case.ts` (utilities), `PascalCase.tsx` (components).
    -   Variables: `camelCase`.
    -   Types/Interfaces: `PascalCase`.

---
*If you are ever unsure, referring to this file and the `package-architecture.md` memory is your best path to correctness.*
