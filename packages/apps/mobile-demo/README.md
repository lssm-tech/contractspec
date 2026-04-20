# @contractspec/app.expo-demo

**Expo landing companion for the shared ContractSpec OSS-first product story.**

## What This Demonstrates

- Shares platform-neutral landing content from `@contractspec/bundle.marketing/content`.
- Presents the same positioning as `@contractspec/app.web-landing`: open spec system first, Studio as the optional operating layer.
- Uses a mobile-native Expo screen with ContractSpec registry-backed story loading and CTA resolution.
- `src/contracts/` defines landing companion query and CTA command specs.
- `src/handlers/` registers demo handlers against the operation registry.
- `src/components/landing/` and `src/screens/` contain the React Native composition.

## Running Locally

From `packages/apps/mobile-demo`:

- `bun run dev`
- `bun run start`
- `bun run test`
- `bun run typecheck`

## Usage

```bash
bun run dev
```

## Architecture

- `src/app/` contains the Expo Router entrypoint.
- `src/contracts/` defines `mobile-demo.landing` and operations for story loading plus CTA resolution.
- `src/handlers/` adapts shared marketing content into ContractSpec operation results.
- `src/components/landing/` renders the mobile-native companion UI.
- `src/screens/` owns screen-level loading, error, and CTA opening behavior.

## Public Entry Points

- Deployable Expo app with no published library exports.
- Primary runtime surfaces are the Expo route in `src/app/` and the registered operations in `src/handlers/`.
- Shared story data comes from the public `@contractspec/bundle.marketing/content` subpath.

## Local Commands

- `bun run dev` - expo start
- `bun run start` - expo start
- `bun run test` - bun test
- `bun run lint` - bun run lint:fix
- `bun run lint:check` - biome check .
- `bun run lint:fix` - biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` - tsc --noEmit
- `bun run android` - expo run:android
- `bun run ios` - expo run:ios

## Notes

- This package intentionally replaces the old task-list demo with a landing companion use-case.
- Keep app-local UI mobile-native; do not import web-only marketing components into Expo.
- Keep `@contractspec/bundle.marketing/content`, this README, and `@contractspec/app.web-landing` positioning aligned when the public story changes.
