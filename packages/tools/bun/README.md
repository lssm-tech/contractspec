# @contractspec/tool.bun

Shared Bun-based build presets and CLI for ContractSpec workspace packages.

## Commands

- `contractspec-bun-build prebuild` regenerates `exports` and `publishConfig.exports`.
- `contractspec-bun-build transpile` transpiles source with Bun.
- `contractspec-bun-build types` emits declaration files with `tsc`.
- `contractspec-bun-build build` runs prebuild + transpile + types.
- `contractspec-bun-build dev` starts Bun watch mode for configured targets.
