# @contractspec/tool.typescript

Website: https://contractspec.io

**Shared TypeScript configuration presets (base, nextjs, react-library) extended by every package's `tsconfig.json` in the monorepo.**

## What It Provides

- **Layer**: tool
- **Consumers**: all monorepo packages (via `"extends": "@contractspec/tool.typescript/..."`)

## Installation

`npm install @contractspec/tool.typescript`

or

`bun add @contractspec/tool.typescript`

## Local Commands

- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- PublishConfig not supported by bun
- Migrate non-app builds to shared Bun toolchain

## Notes

- Compiler option changes propagate to every package -- verify with `bun run typecheck` across the repo
- Do not weaken strict-mode settings (`strict`, `noUncheckedIndexedAccess`, etc.)
- Adding a new preset file requires documenting which packages should use it
