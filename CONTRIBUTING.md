# Contributing to ContractSpec

Welcome! We're building the safety layer for AI-native software. We believe in keeping things simple and letting automation handle the boring stuff.

## 🤖 AI-Native Workflow

We embrace AI agents (like Cursor, Claude, Windsurf) as first-class contributors. Our repo is designed to be easily understood and modified by AI.

- **Context is King**: We maintain `AGENTS.md` - **READ THIS FILE FIRST**. It contains the definitive map of the repository, architecture rules, and dependency flows.
- **Agent Configuration Sync**: We use [`agentpacks`](packages/tools/agentpacks/README.md) to generate agent configurations.
  - **Do not edit generated tool files directly** (`AGENTS.md`, `.claude/`, `.github/copilot/`, `.gemini/`, etc.).
  - Edit pack sources in `packs/workspace-specific`, `packs/software-best-practices`, and `packs/contractspec-rules`.
  - Run `bun run agentpacks:all` to regenerate all targets.
- **Validation**: We rely on `contractspec ci` to enforce rules, rather than human nitpicking.

### 🧠 AI Tools & Resources

If you are using an AI agent (Cursor, Windsurf, etc.), you can configure it to use our helper MCP server:

- **ContractSpec Docs MCP**: `https://api.contractspec.io/api/mcp/docs`
  - Provides direct access to system documentation and specs.

## 🏗️ Repository Structure

This monorepo follows a strict layered architecture. **See `AGENTS.md` for the detailed map and dependency rules.**

### 1. `packages/apps/*` (Thin Adapters)

Entry points and platform adapters. **No business logic allowed.** (e.g., `web-landing`, `cli-contractspec`).

### 2. `packages/bundles/*` (The Workhorses)

Domain specific logic, features, and UI. **90% of code goes here.** Organized by domain (e.g., `studio`, `marketing`).

### 3. `packages/libs/*` (Shared Infrastructure)

Reusable utilities, contracts, and the design system. (e.g., `contracts`, `design-system`).

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

## 🧪 Local Checks

- Run `bunx contractspec ci` for contract validation and rules.
- Run `bun run lint` for linting.
- Run `bun run test` for unit tests (when touching modules with tests).

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
- Open a **Docs issue** if a guide is unclear or outdated.
- Open a **Bug report** for incorrect behavior or crashes.
- Open a **Feature request** for problem-first ideas.
