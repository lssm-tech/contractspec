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

By default, style entries are processed with `bun build`. Packages that need to preserve CSS directives for another processor, such as Tailwind `@source`, `@custom-variant`, `@theme`, or `@tailwind`, can copy style files unchanged:

```js
export default {
	styleEntry: ['src/styles/**/*.css'],
	styleMode: 'copy',
	// or: styles: { entry: ['src/styles/**/*.css'], mode: 'copy' },
};
```

Style entries are exported under the `style` and `default` conditions, for example `./styles/globals.css`.

## Platform Variants

`contractspec-bun-build` recognizes platform suffixes in public TypeScript entries and emits conditional exports plus matching build outputs:

| Source suffix | Export condition | Build output |
| --- | --- | --- |
| `.web` | `browser` | `dist/browser/*` plus the Bun default when no base entry exists |
| `.native` | `react-native` | `dist/native/*` |
| `.ios` | `ios` | `dist/native/*` |
| `.android` | `android` | `dist/native/*` |

Exact subpaths such as `./foo.web`, `./foo.native`, `./foo.ios`, and `./foo.android` are exported alongside canonical subpaths such as `./foo`.

## Public Entry Points

- `contractspec-bun-build` -> `./bin/contractspec-bun-build.mjs`
- `.` — `./index.js`

## Local Commands

- `bun run test` — bun test
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary

## Recent Updates

- Add copy mode for public CSS style files that must preserve framework directives
- Add direct CSS style subpath exports for public style files
- Replace eslint+prettier by biomejs to optimize speed
- Add multi platform support to bun build
- Use-client within lib surface-runtime

## Notes

- Changes here affect every package's build pipeline -- test broadly before merging
- Do not remove or rename CLI sub-commands (`transpile`, `types`, `dev`, `prebuild`) without updating all consumers
- Keep the package dependency-light; only `glob` as a dev dependency
