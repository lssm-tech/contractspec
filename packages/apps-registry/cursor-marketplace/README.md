# @contractspec/app.cursor-marketplace

Website: https://contractspec.io

**Cursor marketplace catalog containing publishable plugin artifacts for ContractSpec's IDE integrations.**

## What It Does

- **Layer**: apps-registry
- **Consumers**: Cursor IDE users, marketplace publishing pipeline
- Hosts derived plugin artifacts generated from reusable `packs/*` sources of truth

## Running Locally

From `packages/apps-registry/cursor-marketplace`:

## Local Commands

- `bun run validate` — node ../../../scripts/validate-contractspec-plugin.mjs

## Catalog Structure

- Root catalog manifest: `.cursor-plugin/marketplace.json`
- Publishable plugin artifacts: `plugins/*`
- Reusable source packs live outside this package under `packs/*` and are exported here

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Expose contract management via CLI and MCP
- Add Cursor marketplace catalog for core ContractSpec libraries

## Notes

- Each plugin must have a valid `.cursor-plugin/plugin.json`
- Do not add runtime code; this package contains only declarative metadata
- Customer-facing runtime behavior is produced through `agentpacks` generation and hook/MCP configs, not custom code in this package
- Validate changes with `bun run validate` before publishing
- Logo assets in `assets/` must remain stable (referenced by marketplace)
