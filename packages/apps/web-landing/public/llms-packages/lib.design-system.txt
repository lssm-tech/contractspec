# @contractspec/lib.design-system

`@contractspec/lib.design-system` provides higher-level design-system components, tokens, platform adapters, renderers, and composed layouts used across web, native, marketing, legal, agent, and application surfaces.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.design-system`

or

`npm install @contractspec/lib.design-system`

## What belongs here

This package owns the higher-level design-system layer:

- Theme tokens and token bridging.
- Platform helpers and responsive hooks.
- Renderers and form-contract integration.
- Higher-level atoms, molecules, organisms, templates, and visualization components.
- Registry metadata and shadcn-style component registry support.

Use this package when you want the composed design-system layer. Do not use it when a lower-level primitive from `ui-kit` or `ui-kit-web` is enough.

## Core workflows

### Import a higher-level design-system component

```ts
import { AppLayout, Button, HeroSection } from "@contractspec/lib.design-system";
```

### Work with tokens and platform helpers

```ts
import {
  defaultTokens,
  mapTokensForPlatform,
  withPlatformUI,
} from "@contractspec/lib.design-system";

const nativeTokens = mapTokensForPlatform("native");
const ui = withPlatformUI({
  tokens: defaultTokens,
  platform: "web",
});
```

## API map

### Theme and platform

- `defaultTokens` and token interfaces from `./theme/tokens`
- `mapTokensForPlatform` from `./theme/tokenBridge`
- theme variants
- `withPlatformUI`
- `useColorScheme`
- `useReducedMotion`
- `useResponsive`

### Renderers and hooks

- renderer exports from `./renderers`
- form-contract renderer support
- hooks such as `useListUrlState`
- navigation-related shared types

### Component composition layers

- atoms
- forms
- legal
- marketing
- molecules
- organisms
- templates
- visualization
- agent and approval components

The root barrel is the primary API and already groups these exports in one place.

## Public surface

The root barrel at `src/index.ts` is the main public API for this package.

The export map is broad, but it is centralized:

- theme and platform helpers
- renderer exports
- high-level components grouped by composition layer
- hooks and shared types

The package also ships registry metadata and build support:

- `components.json`
- `registry/registry.json`
- `bun run registry:build`

## Operational semantics and gotchas

- Token names and token shapes are compatibility surface.
- `mapTokensForPlatform()` deliberately returns different token shapes for web and native.
- `withPlatformUI()` is a lightweight adapter, not a full runtime framework.
- The root barrel is broad and therefore high-blast-radius.
- This package depends on both `ui-kit` and `ui-kit-web`.
- The package includes legal, marketing, agent, app-shell, and visualization compositions, not just low-level primitives.

## When not to use this package

- Do not use it for tiny low-level utilities.
- Do not use it for router-agnostic links.
- Do not use it when a single lower-level primitive from `ui-kit` or `ui-kit-web` is enough.

## Related packages

- `@contractspec/lib.ui-kit`
- `@contractspec/lib.ui-kit-web`
- `@contractspec/lib.ui-kit-core`
- `@contractspec/lib.ui-link`

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
