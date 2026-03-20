# @contractspec/tool.tsdown

Website: https://contractspec.io

**Shared tsdown configuration presets for the ContractSpec monorepo. Packages that use tsdown for bundling import this preset to keep build config consistent.**

## What It Provides

- **Layer**: tool
- **Consumers**: packages using tsdown (typically libs with `tsdown.config.js`)

## Installation

`npm install @contractspec/tool.tsdown`

or

`bun add @contractspec/tool.tsdown`

## Usage

Import the root entrypoint from `@contractspec/tool.tsdown`, or use one of the documented subpaths when you want a narrower surface area.

## Public Entry Points

- `.` — `./index.js`

## Local Commands

- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- PublishConfig not supported by bun
- Add examples of integration

## Notes

- Changes affect every tsdown consumer's build output -- test downstream packages before merging
- Peer-depends on `tsdown ^0.21` -- keep in sync with the workspace catalog version
- Keep the preset minimal; package-specific overrides belong in each consumer's `tsdown.config.js`
