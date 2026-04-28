# @contractspec/lib.presentation-runtime-core

Website: https://contractspec.io

**Core presentation runtime for contract-driven UIs.**

## What It Provides

- **Layer**: lib.
- **Consumers**: presentation-runtime-react, presentation-runtime-react-native.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.presentation-runtime-core`

or

`bun add @contractspec/lib.presentation-runtime-core`

## Usage

Import the root entrypoint from `@contractspec/lib.presentation-runtime-core`, or choose a documented subpath when you only need one part of the package surface.

## Bundler Helpers

Import the bundler helpers from the root package:

```ts
import {
  withPresentationTurbopackAliases,
  withPresentationWebpackAliases,
  withPresentationMetroAliases,
} from '@contractspec/lib.presentation-runtime-core';
```

### Next.js Turbopack helper (default)

Use Turbopack as the default Next.js path:

```ts
import { withPresentationTurbopackAliases } from '@contractspec/lib.presentation-runtime-core';

const nextConfig = withPresentationTurbopackAliases({
  turbopack: {
    resolveAlias: {
      fs: { browser: 'browserify-fs' },
    },
  },
});

export default nextConfig;
```

### Next.js Webpack helper (fallback)

Use Webpack only when you opt in with `next dev --webpack` or `next build --webpack`:

```ts
import { withPresentationWebpackAliases } from '@contractspec/lib.presentation-runtime-core';

const nextConfig = {
  webpack: (config) => withPresentationWebpackAliases(config),
};

export default nextConfig;
```

### Expo / Metro helper

```js
const { getDefaultConfig } = require('expo/metro-config');
const {
  withPresentationMetroAliases,
} = require('@contractspec/lib.presentation-runtime-core');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

module.exports = withPresentationMetroAliases(config);
```

The helpers also keep shared UI imports platform-correct:

- Metro rewrites `@contractspec/lib.ui-kit-web/ui/*` to `@contractspec/lib.ui-kit/ui/*`, `@contractspec/lib.presentation-runtime-react` to `@contractspec/lib.presentation-runtime-react-native`, and `lucide-react` to `lucide-react-native` for native platforms.
- Metro also enables package exports and merges platform export conditions so `ios`, `android`, `react-native`, and `browser` package conditions can resolve platform-specific build-tool outputs.
- Next.js Turbopack/Webpack rewrites the native package names back to the web packages, including `lucide-react-native` to `lucide-react`.

## Architecture

- `src/index.ts` is the root public barrel that builds the package entrypoint.
- `src/metro.ts` is part of the package's public or composition surface.
- `src/next.ts` is part of the package's public or composition surface.
- `src/table.ts` is part of the package's public or composition surface.
- `src/visualization.echarts.ts` is part of the package's public or composition surface.
- `src/visualization.model.builders.ts` is part of the package's public or composition surface.
- `src/visualization.model.helpers.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` publishes through `./dist/index.js`; CommonJS `require` resolves to the generated Metro helper at `./dist/metro.cjs`.
- Bundler helpers are part of the root entrypoint; no dedicated `./webpack` or `./turbopack` subpaths are published.
- Export `./metro` builds from `./src/metro.ts` and publishes a generated CommonJS `dist/metro.cjs` require target for Metro config files.
- Export `./next` builds from `./src/next.ts`.
- Export `./table` builds from `./src/table.ts`.
- Export `./visualization` builds from `./src/visualization.ts`.
- Export `./visualization.echarts` builds from `./src/visualization.echarts.ts`.
- Export `./visualization.model` builds from `./src/visualization.model.ts`.
- Export `./visualization.model.builders` builds from `./src/visualization.model.builders.ts`.
- Export `./visualization.model.helpers` builds from `./src/visualization.model.helpers.ts`.
- Export `./visualization.types` builds from `./src/visualization.types.ts`.
- Export `./visualization.utils` builds from `./src/visualization.utils.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add data visualization capabilities.
- Add table capabilities.
- Add table overflow metadata to controller render models so web and native
  renderers can apply consistent cell overflow behavior.

## Notes

- Core runtime interface is consumed by all presentation runtimes — changes here affect both web and mobile.
- Must remain platform-agnostic; no React or React Native imports allowed.
- API surface changes require coordinated updates in both downstream runtimes.
