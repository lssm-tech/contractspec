# @contractspec/lib.contracts

Website: https://contractspec.io

**DEPRECATED** monolith package. Exists only as a re-export shim for legacy consumers.**

## What It Provides

- **Layer**: lib (deprecated)
- **Consumers**: legacy code only

## Installation

`npm install @contractspec/lib.contracts`

or

`bun add @contractspec/lib.contracts`

## Local Commands

- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Release video edition tools
- Refactor contracts libs to split them reducing bundle size and load

## Notes

- **Do NOT add new code here.** Migrate consumers to `contracts-spec`, `contracts-integrations`, or `contracts-runtime-*` packages instead.
- This package exists solely for backward compatibility.
