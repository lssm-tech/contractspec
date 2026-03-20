# contractspec

Website: https://contractspec.io

**npm-published CLI entry point for ContractSpec. Thin wrapper that delegates to `@contractspec/app.cli-contractspec` via `bin/contractspec.mjs`.**

## What It Does

- **Layer**: apps-registry
- **Consumers**: end-users installing `npx contractspec` or `bun x contractspec`

## Installation

`npm install contractspec`

or

`bun add contractspec`

## Usage

```bash
npx contractspec --help
# or
bunx contractspec --help
```

## Public Entry Points

- `contractspec` -> `./bin/contractspec.mjs`

## Local Commands

- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Stability
- Refactor contracts libs to split them reducing bundle size and load

## Notes

- This package is a shim; all logic lives in `@contractspec/app.cli-contractspec`
- Do not add dependencies beyond the CLI app workspace reference
- Changes to `bin/contractspec.mjs` affect every user -- test locally before publishing
