# @contractspec/tool.bun

Website: https://contractspec.io

**Shared Bun build presets and CLI for ContractSpec packages. Provides the `contractspec-bun-build` binary used by nearly every package's `build`, `dev`, and `prebuild` scripts.**

## What It Provides

- **Layer**: tool
- **Consumers**: all monorepo packages (via `contractspec-bun-build` in their scripts)

## Installation

`npm install @contractspec/tool.bun`

or

`bun add @contractspec/tool.bun`

## Usage

```bash
npx contractspec-bun-build --help
# or
bunx contractspec-bun-build --help
```

## Style Exports

`contractspec-bun-build` scans public CSS style entries separately from TypeScript entries so style files do not affect JavaScript output roots.

Default style entries:

- `styles/**/*.css`
- `src/*.css`
- `!**/*.module.css`

Packages can override or disable style entries from their build config:

```js
export default {
	styleEntry: ['styles/**/*.css'],
	// or: styles: { entry: ['styles/**/*.css'] },
	// or: styleEntry: false,
};
```

Style entries are exported under the `style` and `default` conditions, for example `./styles/globals.css`.

## Public Entry Points

- `contractspec-bun-build` -> `./bin/contractspec-bun-build.mjs`
- `.` — `./index.js`

## Local Commands

- `bun run test` — bun test
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Add direct CSS style subpath exports for public style files
- Replace eslint+prettier by biomejs to optimize speed
- Add multi platform support to bun build
- Use-client within lib surface-runtime

## Notes

- Changes here affect every package's build pipeline -- test broadly before merging
- Do not remove or rename CLI sub-commands (`transpile`, `types`, `dev`, `prebuild`) without updating all consumers
- Keep the package dependency-light; only `glob` as a dev dependency
