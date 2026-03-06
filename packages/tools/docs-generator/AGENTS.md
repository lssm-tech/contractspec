# AI Agent Guide -- `@contractspec/tool.docs-generator`

Scope: `packages/tools/docs-generator/*`

CLI tool that reads ContractSpec specs and DocBlocks, then generates documentation artifacts (markdown, component stubs) for the library bundle's docs UI.

## Quick Context

- **Layer**: tool
- **Consumers**: docs pipeline (`bun run docs:generate`), CI

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | CLI entry point and generator logic |

**Binary**: `contractspec-docs`

## Guardrails

- Output paths are configured via CLI flags -- do not hard-code destination directories
- Depends on `@contractspec/lib.contracts-spec` for spec parsing -- changes there may require updates here
- The `docs:generate` script references relative paths to `generated/docs` and the library bundle; verify paths if the monorepo structure changes

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
