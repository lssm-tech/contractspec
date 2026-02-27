# contractspec-contracts-spec Cursor Plugin

Focused plugin for teams working directly in `@contractspec/lib.contracts-spec`.

This plugin enforces:

- Operation-first contract authoring before runtime implementation.
- Strict compatibility classification and release impact discipline.
- Policy/workflow integrity for executable contracts.

## Included workflows

- Run `contracts-spec-impact` before merge to classify breaking risk.
- Run `contracts-spec-library-check` before release for validation and typed checks.

## Included MCP servers

- `contractspec-docs` -> `https://api.contractspec.io/api/mcp/docs`
- `contractspec-cli` -> `https://api.contractspec.io/api/mcp/cli`
- `contractspec-internal` -> `https://api.contractspec.io/api/mcp/internal`
