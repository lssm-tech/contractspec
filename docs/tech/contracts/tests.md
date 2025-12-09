## TestSpec & TestRunner

Use `TestSpec` to describe end-to-end scenarios for contracts and workflows. Specs live alongside your contracts and exercise the same SpecRegistry handlers the app uses.

- Types & registry: `packages/libs/contracts/src/tests/spec.ts`
- Runtime runner: `packages/libs/contracts/src/tests/runner.ts`
- CLI: `contractspec test`

### Structure

```ts
export interface TestSpec {
  meta: TestSpecMeta;
  target: TestTarget;  // contract or workflow
  fixtures?: Fixture[]; // optional shared setup before each scenario
  scenarios: TestScenario[];
  coverage?: CoverageRequirement;
}
```

- `Fixture`: run an operation before the scenario (`operation`, optional `input`)
- `Action`: operation input that the scenario exercises
- `Assertion`:
  - `expectOutput` `{ match }` deep-equals the handler output
  - `expectError` `{ messageIncludes? }` ensures an error was thrown
  - `expectEvents` `{ events: [{ name, version, min?, max? }] }` checks emitted events

### Example

```ts
import { defineCommand, type TestSpec } from '@lssm/lib.contracts';

export const AddNumbersSpec = defineCommand({
  meta: { name: 'math.add', version: 1, /* … */ },
  io: {
    input: AddNumbersInput,
    output: AddNumbersOutput,
  },
  policy: { auth: 'user' },
});

export const MathAddTests: TestSpec = {
  meta: {
    name: 'math.add.tests',
    version: 1,
    title: 'Math add scenarios',
    owners: ['@team.math'],
    tags: ['math'],
    stability: StabilityEnum.Experimental,
  },
  target: { type: 'contract', operation: { name: 'math.add' } },
  scenarios: [
    {
      name: 'adds positive numbers',
      when: {
        operation: { name: 'math.add' },
        input: { a: 2, b: 3 },
      },
      then: [
        { type: 'expectOutput', match: { sum: 5 } },
        {
          type: 'expectEvents',
          events: [{ name: 'math.sum_calculated', version: 1, min: 1 }],
        },
      ],
    },
  ],
};
```

### Running tests

1. Register the contract handlers in a `SpecRegistry`:

```ts
export function createRegistry() {
  const registry = new SpecRegistry();
  registry.register(AddNumbersSpec);
  registry.bind(AddNumbersSpec, addNumbersHandler);
  return registry;
}
```

2. Run the CLI:

```
contractspec test apps/math/tests/math.add.tests.ts \
  --registry apps/math/tests/registry.ts
```

- The CLI loads the TestSpec, instantiates the registry (via the provided module), and executes each scenario via `TestRunner`.
- `--json` outputs machine-readable results.

### Programmatic usage

```ts
const runner = new TestRunner({
  registry,
  createContext: () => ({ actor: 'user', organizationId: 'tenant-1' }),
});

const result = await runner.run(MathAddTests);
console.log(result.passed, result.failed);
```

- `createContext` can supply default `HandlerCtx` values.
- `beforeEach` / `afterEach` hooks let you seed databases or reset state.

### Best practices

- Keep fixtures idempotent so scenarios can run in parallel in the future.
- Use `expectEvents` to guard analytics/telemetry expectations.
- Add specs to `TestRegistry` for discovery and documentation.
- `coverage` captures desired coverage metrics (enforced by future tooling).
- Pair TestSpec files with CI using `contractspec test --json` and fail builds when `failed > 0`.

### Mocking with Bun's `vi`

- Pass a single function type to `vi.fn<TFunction>()` so calls retain typed arguments:

```ts
const handler = vi.fn<typeof fetch>();
const fetchImpl: typeof fetch = ((...args) => handler(...args)) as typeof fetch;
Object.defineProperty(fetchImpl, 'preconnect', {
  value: vi.fn<typeof fetch.preconnect>(),
});
```

- When you need to inspect calls, use the typed mock (`handler.mock.calls`) rather than casting to `any`.
- Narrow optional request data defensively (e.g., check for headers before reading them) so tests remain type-safe under strict `tsconfig` settings.

