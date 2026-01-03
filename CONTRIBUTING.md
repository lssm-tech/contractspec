# Contributing to ContractSpec

Welcome! We're building the safety layer for AI-native software. We believe in keeping things simple and letting automation handle the boring stuff.

## 🤖 AI-Native Workflow

We embrace AI agents (like Cursor, Claude, Windsurf) as first-class contributors. Our repo is designed to be easily understood and modified by AI.
- **Context is King**: We maintain `AGENTS.md` and the `.rulesync/` folder to help AI agents understand the codebase.
- **Rule Synchronization**: We use [rulesync](https://github.com/dyoshikawa/rulesync) to generate agent configurations.
  - **Do not edit `.agent/` directly.**
  - Edit files in `.rulesync/` instead.
  - Run `bun run rulessync:all` to regenerate rules.
- **Validation**: We rely on `contractspec ci` to enforce rules, rather than human nitpicking.

## 🏗️ Repository Structure

This monorepo follows a strict layered architecture to ensure separation of concerns:

### 1. `packages/apps/*` (Thin Adapters)
**Goal**: Entry points and platform adapters.
- **No business logic allowed.**
- These are thin wrappers (Next.js apps, CLIs) that wire together bundles.
- Examples: `web-landing` (Next.js), `api-library` (Elysia), `cli-contractspec`.

### 2. `packages/bundles/*` (The Workhorses)
**Goal**: Domain specific logic, features, and UI.
- **This is where 90% of your code should go.**
- Organized by business domain (e.g., `marketing`, `studio`, `library`).
- Contains: UI components, data fetching, business rules, and integrations.

### 3. `packages/libs/*` (Shared Infrastructure)
**Goal**: Reusable utilities and contracts.
- **`contracts`**: The core ContractSpec definitions.
- **`design-system`**: Shared UI atoms and tokens.
- **`database`**: Prisma schemas and clients.
- **`ai-agent`**: LLM integration utilities.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    bun install
    ```

2.  **Start development server**:
    ```bash
    bun dev
    ```
    (This starts all apps. To start a specific app, use `bun dev --filter=@contractspec/app.web-landing`)

## 🤝 Contribution Workflow

1.  **Find your place**:
    - **Frontend UI/Content**: Go to `packages/bundles/marketing` or `packages/bundles/library`.
    - **Core Logic**: Go to `packages/bundles/*`.
    - **Infrastructure/Tools**: Go to `packages/libs/*` or `packages/tools/*`.

2.  **Make changes**:
    - Keep files small.
    - Follow the "One Concept per File" rule.
    - Use our Design System components; avoid raw HTML/CSS.

3.  **Validate**:
    - Run `bunx contractspec ci` to run validation checks locally.

4.  **Pull Request**:
    - Open a PR.
    - Our `action-validation` will check your code.
    - Our `action-version` will analyze versioning impact.
    - Wait for the bots to report status.

## 📏 Standards & Conventions

- **Package Manager**: `bun`
- **Formatting**: `prettier` (handled by CI)
- **Linting**: `eslint` (handled by CI)
- **Commits**: Conventional Commits (e.g., `feat: ...`, `fix: ...`)

## ❓ Need Help?

- Check **Discussions** for Q&A.
- Open an **Issue** if you find a bug.
