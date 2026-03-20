# @contractspec/app.cursor-marketplace

Website: https://contractspec.io

**Cursor marketplace catalog containing plugin definitions (rules, commands, agents, skills, assets) for ContractSpec's Cursor IDE integrations.**

## What It Does

- **Layer**: apps-registry
- **Consumers**: Cursor IDE users, marketplace publishing pipeline

## Running Locally

From `packages/apps-registry/cursor-marketplace`:

## Local Commands

- `bun run validate` — node ../../../scripts/validate-contractspec-plugin.mjs

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Expose contract management via CLI and MCP
- Add Cursor marketplace catalog for core ContractSpec libraries

## Notes

- Each plugin must have a valid `.cursor-plugin/plugin.json`
- Do not add runtime code; this package contains only declarative metadata
- Validate changes with `bun run validate` before publishing
- Logo assets in `assets/` must remain stable (referenced by marketplace)
