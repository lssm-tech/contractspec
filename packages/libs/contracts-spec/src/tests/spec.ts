import { compareVersions } from 'compare-versions';
/**
 * Reference to an operation to be tested.
 * Version is optional; when omitted, refers to the latest version.
 */
import type { DocBlock } from '../docs/types';
import type { OwnerShipMeta } from '../ownership';
import type { OptionalVersionedSpecRef } from '../versioning';
export type OperationTargetRef = OptionalVersionedSpecRef;

/**
 * Reference to a workflow to be tested.
 * Version is optional; when omitted, refers to the latest version.
 */
export type WorkflowTargetRef = OptionalVersionedSpecRef;

export type TestTarget =
	| { type: 'operation'; operation: OperationTargetRef }
	| { type: 'workflow'; workflow: WorkflowTargetRef };

export interface Fixture {
	description?: string;
	operation: OperationTargetRef;
	input?: unknown;
}

export interface Action {
	operation: OperationTargetRef;
	input?: unknown;
}

export interface ExpectOutputAssertion {
	type: 'expectOutput';
	match: unknown;
}

export interface ExpectErrorAssertion {
	type: 'expectError';
	messageIncludes?: string;
}

export interface ExpectedEvent {
	key: string;
	version: string;
	min?: number;
	max?: number;
}

export interface ExpectEventsAssertion {
	type: 'expectEvents';
	events: ExpectedEvent[];
}

export type Assertion =
	| ExpectOutputAssertion
	| ExpectErrorAssertion
	| ExpectEventsAssertion;

export interface TestScenario {
	key: string;
	description?: string;
	given?: Fixture[];
	when: Action;
	then?: Assertion[];
}

export interface CoverageRequirement {
	statements?: number;
	branches?: number;
	functions?: number;
	lines?: number;
	mutations?: number;
}

export type TestSpecMeta = OwnerShipMeta;

export interface TestSpec {
	meta: TestSpecMeta;
	target: TestTarget;
	fixtures?: Fixture[];
	scenarios: TestScenario[];
	coverage?: CoverageRequirement;
}

/**
 * Reference to a test spec.
 * Version is optional; when omitted, refers to the latest version.
 */
export type TestSpecRef = OptionalVersionedSpecRef;

const testKey = (meta: OwnerShipMeta) => `${meta.key}.v${meta.version}`;

export class TestRegistry {
	private readonly items = new Map<string, TestSpec>();

	register(spec: TestSpec): this {
		const key = testKey(spec.meta);
		if (this.items.has(key)) {
			throw new Error(`Duplicate TestSpec registration for ${key}`);
		}
		this.items.set(key, spec);
		return this;
	}

	list(): TestSpec[] {
		return [...this.items.values()];
	}

	get(name: string, version?: string): TestSpec | undefined {
		if (version != null) {
			return this.items.get(`${name}.v${version}`);
		}
		let latest: TestSpec | undefined;
		for (const spec of this.items.values()) {
			if (spec.meta.key !== name) continue;
			if (
				!latest ||
				compareVersions(spec.meta.version, latest.meta.version) > 0
			) {
				latest = spec;
			}
		}
		return latest;
	}
}

export function makeTestKey(meta: TestSpecMeta) {
	return testKey(meta);
}

export function defineTestSpec(spec: TestSpec) {
	return spec;
}

export const tech_contracts_tests_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.tests',
		title: 'TestSpec & TestRunner',
		summary:
			'Use `TestSpec` to describe end-to-end scenarios for contracts and workflows. Specs live alongside your contracts and exercise the same OperationSpecRegistry handlers the app uses.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/tests',
		tags: ['tech', 'contracts', 'tests'],
		body: "## TestSpec & TestRunner\n\nUse `TestSpec` to describe end-to-end scenarios for contracts and workflows. Specs live alongside your contracts and exercise the same OperationSpecRegistry handlers the app uses.\n\n- Types & registry: `packages/libs/contracts/src/tests/spec.ts`\n- Runtime runner: `packages/libs/contracts/src/tests/runner.ts`\n- CLI: `contractspec test`\n\n### Structure\n\n```ts\nexport interface TestSpec {\n  meta: TestSpecMeta;\n  target: TestTarget;  // contract or workflow\n  fixtures?: Fixture[]; // optional shared setup before each scenario\n  scenarios: TestScenario[];\n  coverage?: CoverageRequirement;\n}\n```\n\n- `Fixture`: run an operation before the scenario (`operation`, optional `input`)\n- `Action`: operation input that the scenario exercises\n- `Assertion`:\n  - `expectOutput` `{ match }` deep-equals the handler output\n  - `expectError` `{ messageIncludes? }` ensures an error was thrown\n  - `expectEvents` `{ events: [{ name, version, min?, max? }] }` checks emitted events\n\n### Example\n\n```ts\nimport { defineCommand, type TestSpec } from '@contractspec/lib.contracts-spec';\n\nexport const AddNumbersSpec = defineCommand({\n  meta: { name: 'math.add', version: '1.0.0', /* \u2026 */ },\n  io: {\n    input: AddNumbersInput,\n    output: AddNumbersOutput,\n  },\n  policy: { auth: 'user' },\n});\n\nexport const MathAddTests: TestSpec = {\n  meta: {\n    name: 'math.add.tests',\n    version: '1.0.0',\n    title: 'Math add scenarios',\n    owners: ['@team.math'],\n    tags: ['math'],\n    stability: StabilityEnum.Experimental,\n  },\n  target: { type: 'contract', operation: { name: 'math.add' } },\n  scenarios: [\n    {\n      name: 'adds positive numbers',\n      when: {\n        operation: { name: 'math.add' },\n        input: { a: 2, b: 3 },\n      },\n      then: [\n        { type: 'expectOutput', match: { sum: 5 } },\n        {\n          type: 'expectEvents',\n          events: [{ name: 'math.sum_calculated', version: '1.0.0', min: 1 }],\n        },\n      ],\n    },\n  ],\n};\n```\n\n### Running tests\n\n1. Register the contract handlers in a `OperationSpecRegistry`:\n\n```ts\nexport function createRegistry() {\n  const registry = new OperationSpecRegistry();\n  registry.register(AddNumbersSpec);\n  registry.bind(AddNumbersSpec, addNumbersHandler);\n  return registry;\n}\n```\n\n2. Run the CLI:\n\n```\ncontractspec test apps/math/tests/math.add.tests.ts \\\n  --registry apps/math/tests/registry.ts\n```\n\n- The CLI loads the TestSpec, instantiates the registry (via the provided module), and executes each scenario via `TestRunner`.\n- `--json` outputs machine-readable results.\n\n### Programmatic usage\n\n```ts\nconst runner = new TestRunner({\n  registry,\n  createContext: () => ({ actor: 'user', organizationId: 'tenant-1' }),\n});\n\nconst result = await runner.run(MathAddTests);\nconsole.log(result.passed, result.failed);\n```\n\n- `createContext` can supply default `HandlerCtx` values.\n- `beforeEach` / `afterEach` hooks let you seed databases or reset state.\n\n### Best practices\n\n- Keep fixtures idempotent so scenarios can run in parallel in the future.\n- Use `expectEvents` to guard analytics/telemetry expectations.\n- Add specs to `TestRegistry` for discovery and documentation.\n- `coverage` captures desired coverage metrics (enforced by future tooling).\n- Pair TestSpec files with CI using `contractspec test --json` and fail builds when `failed > 0`.\n\n### Mocking with Bun's `vi`\n\n- Pass a single function type to `vi.fn<TFunction>()` so calls retain typed arguments:\n\n```ts\nconst handler = vi.fn<typeof fetch>();\nconst fetchImpl: typeof fetch = ((...args) => handler(...args)) as typeof fetch;\nObject.defineProperty(fetchImpl, 'preconnect', {\n  value: vi.fn<typeof fetch.preconnect>(),\n});\n```\n\n- When you need to inspect calls, use the typed mock (`handler.mock.calls`) rather than casting to `any`.\n- Narrow optional request data defensively (e.g., check for headers before reading them) so tests remain type-safe under strict `tsconfig` settings.\n\n",
	},
];
