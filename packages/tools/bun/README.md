# @contractspec/tool.bun

Shared Bun-based build presets and CLI for ContractSpec workspace packages.

## Commands

- `contractspec-bun-build help`, `contractspec-bun-build --help`, and `contractspec-bun-build -h` print usage information.
- `contractspec-bun-build prebuild` regenerates `exports` and `publishConfig.exports`.
- `contractspec-bun-build transpile` transpiles source with Bun.
- `contractspec-bun-build types` emits declaration files with `tsc`.
- `contractspec-bun-build build` runs prebuild + transpile + types.
- `contractspec-bun-build dev` starts Bun watch mode for configured targets.

## Platform Variants

- `.web.*` files are treated as browser-specific variants and feed canonical `browser` exports.
- `.native.*` files are treated as React Native variants and feed canonical `react-native` exports.
- Direct suffixed subpaths like `./foo.web` and `./foo.native` are preserved alongside the canonical export.
