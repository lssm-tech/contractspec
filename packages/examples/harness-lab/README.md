# @contractspec/example.harness-lab

Website: https://contractspec.io

**Focused harness example for scenario contracts, suites, orchestration, and real runtime adapters.**

## What This Demonstrates

- Contract layer: canonical `harness-scenario` and `harness-suite` exports.
- Orchestration layer: `HarnessRunner`, `HarnessEvaluationRunner`, and replay bundle generation.
- Runtime layer: `SandboxedCodeExecutionAdapter`, `PlaywrightBrowserHarnessAdapter`, optional `AgentBrowserHarnessAdapter`, `DefaultHarnessTargetResolver`, and `InMemoryHarnessArtifactStore`.
- A deterministic local browser fixture that stays offline and exercises Playwright, auth profile refs, visual diff evidence, and optional agent-browser evidence.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/harness-lab`:
- `bunx playwright install chromium`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.harness-lab` as the focused harness reference package. It pairs with `@contractspec/example.agent-console`, which remains the business-oriented proof example for harness contracts.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/harness-lab.feature.ts` defines the feature entrypoint for docs/discovery.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/runtime/` contains the runnable sandbox and browser evaluation helpers plus the local browser fixture.
- `src/scenarios/` contains sandbox, Playwright browser, authenticated browser, visual baseline, and optional agent-browser scenario contracts.
- `src/suite/` contains the dual-mode harness suite contract.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/harness-lab.docblock` resolves through `./src/docs/harness-lab.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./harness-lab.feature` resolves through `./src/harness-lab.feature.ts`.
- Export `./runtime` resolves through `./src/runtime/index.ts`.
- Export `./runtime/runAgentBrowserEvaluation` resolves through `./src/runtime/runAgentBrowserEvaluation.ts`.
- Export `./runtime/runAuthenticatedBrowserEvaluation` resolves through `./src/runtime/runAuthenticatedBrowserEvaluation.ts`.
- Export `./runtime/runBrowserEvaluation` resolves through `./src/runtime/runBrowserEvaluation.ts`.
- Export `./runtime/runSandboxEvaluation` resolves through `./src/runtime/runSandboxEvaluation.ts`.
- Export `./runtime/runVisualEvaluation` resolves through `./src/runtime/runVisualEvaluation.ts`.
- Export `./scenarios` resolves through `./src/scenarios/index.ts`.
- Export `./scenarios/harnessLabAgentBrowser.scenario` resolves through `./src/scenarios/harnessLabAgentBrowser.scenario.ts`.
- Export `./scenarios/harnessLabAuthenticatedBrowser.scenario` resolves through `./src/scenarios/harnessLabAuthenticatedBrowser.scenario.ts`.
- Export `./scenarios/harnessLabBrowser.scenario` resolves through `./src/scenarios/harnessLabBrowser.scenario.ts`.
- Export `./scenarios/harnessLabSandbox.scenario` resolves through `./src/scenarios/harnessLabSandbox.scenario.ts`.
- Export `./scenarios/harnessLabVisual.scenario` resolves through `./src/scenarios/harnessLabVisual.scenario.ts`.
- Export `./suite` resolves through `./src/suite/index.ts`.
- The package publishes 21 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Notes

- Browser tests use a real local Playwright run against an in-package HTTP fixture. Install Chromium locally before running `bun run test`.
- Agent-browser tests are optional and skip automatically when the `agent-browser` CLI is unavailable.
- Authenticated scenarios use named auth profile refs; storage state is created by the test harness and credentials are not embedded in scenario specs.
