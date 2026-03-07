# AI Agent Guide -- `@contractspec/tool.create-contractspec-plugin`

Scope: `packages/tools/create-contractspec-plugin/*`

CLI scaffolding tool that generates new ContractSpec plugin projects from templates. Prompts the user for plugin metadata and writes a ready-to-develop package.

## Quick Context

- **Layer**: tool
- **Consumers**: plugin authors (via `create-contractspec-plugin` CLI)

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | CLI entry point |
| `./templates/example-generator` | Built-in generator template |
| `./utils` | Shared scaffolding utilities |

**Binary**: `create-contractspec-plugin`

## Guardrails

- Template files live in `templates/` -- keep them in sync with the current plugin contract
- Do not change interactive prompts without updating the corresponding template variables
- Depends on `@contractspec/lib.contracts-spec` and `@contractspec/lib.schema` -- respect their APIs

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
