# AI Agent Guide -- `@contractspec/module.workspace`

Scope: `packages/modules/workspace/*`

Workspace discovery and management module for detecting, validating, and configuring ContractSpec project workspaces.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (contractspec-studio), apps (cli-contractspec, vscode-contractspec)

## Public Exports

- `.` -- root barrel (discovery, validation, configuration)

## Guardrails

- Uses `ts-morph` for AST analysis and `compare-versions` for semver checks -- version bumps may affect parsing behavior
- Workspace detection is file-system-dependent; always use the provided abstractions, never raw `fs` calls
- Changes here affect CLI, VSCode extension, and studio workspace initialization flows

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
