# AI Agent Guide -- `@contractspec/bundle.workspace`

Scope: `packages/bundles/workspace/*`

Core workspace bundle providing CLI services, AI agents, code generation, validation, and monorepo tooling for ContractSpec development workflows.

## Quick Context

- **Layer**: bundle
- **Consumers**: `apps/cli-contractspec`, `apps/vscode-contractspec`, `apps/jetbrains-contractspec`, `apps/api-library`, `apps/action-drift`, `apps/action-pr`

## Key Directories

- `src/services/` -- use-cases (build, validate, fix, verify, drift, doctor, coverage, etc.)
- `src/adapters/` -- infrastructure adapters (fs, git, AI, workspace)
- `src/ports/` -- adapter interfaces (logger, rulesync)
- `src/ai/` -- AI agents and prompts (Cursor, Claude Code, OpenAI Codex, simple)
- `src/templates/` -- code generation templates (features, events, operations, etc.)
- `src/formatters/` -- output formatters (SARIF, text)
- `src/contracts/` -- operation and feature contracts
- `src/types/` -- shared type definitions
- `src/utils/` -- internal utilities

## Public Exports

- `.` -- ports, adapters, services, operation registry, formatters (namespaced), templates (namespaced), AI agents/prompts, utils (namespaced), fix types

## Guardrails

- Largest bundle in the monorepo (~280 source files); prefer editing existing services over adding new top-level directories.
- Adapters must implement port interfaces; no direct infrastructure calls from services.
- AI agent definitions must stay provider-agnostic via the `ai` SDK abstraction.
- Template changes affect generated code across all consumers; test thoroughly.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
- Test: `bun test`
- Typecheck: `bun run typecheck`
