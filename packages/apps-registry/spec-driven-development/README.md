# spec-driven-development

Website: https://contractspec.io

**npm-published CLI alias for ContractSpec under the `sdd` / `spec-driven-development` binary names. Thin wrapper that delegates to `@contractspec/app.cli-contractspec`.**

## What It Does

- **Layer**: apps-registry
- **Consumers**: end-users installing `npx sdd` or `npx spec-driven-development`

## Installation

`npm install spec-driven-development`

or

`bun add spec-driven-development`

## Usage

```bash
npx sdd --help
# or
bunx sdd --help
```

## Public Entry Points

- `sdd` -> `./bin/contractspec.mjs`
- `spec-driven-development` -> `./bin/contractspec.mjs`

## Local Commands

- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- PublishConfig not supported by bun

## Notes

- This package is a shim; all logic lives in `@contractspec/app.cli-contractspec`
- Do not add dependencies beyond the CLI app workspace reference
- Changes to `bin/contractspec.mjs` affect every user -- test locally before publishing
