# @contractspec/app.expo-demo

**Minimal Expo React Native app demonstrating ContractSpec's mobile runtime with a task list workflow.**

## What This Demonstrates

- Demonstrates a spec-first mobile flow from contracts to handlers to React Native screens.
- Uses the RN-safe subset of the ContractSpec UI kit and presentation runtime.
- Ships task list, create-task, and status-update flows backed by an in-memory store.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

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

- `app/` contains Expo Router routes and screen wiring.
- `src/contracts/` defines the task entity and mobile demo operations.
- `src/handlers/` registers demo handlers against the operation registry.
- `src/screens/` contains screen-level UI composition for list and form flows.

## Public Entry Points

- Deployable Expo app with no published library exports.
- Primary runtime surfaces are the Expo routes in `app/` and the registered operations in `src/handlers/`.

## Local Commands

- `bun run dev` — expo start
- `bun run start` — expo start
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run android` — expo start --android
- `bun run ios` — expo start --ios

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Stability.
- Package exports.
- Mobile app example.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.presentation-runtime-react-native`, `@contractspec/lib.schema`, `@contractspec/lib.ui-kit`, ...
