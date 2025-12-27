import type { Owner, OwnerShipMeta, Stability, Tag } from '../ownership';

export interface OperationTargetRef {
  key: string;
  version?: number;
}

export interface WorkflowTargetRef {
  key: string;
  version?: number;
}

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
  version: number;
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

export type TestSpecMeta = OwnerShipMeta

export interface TestSpec {
  meta: TestSpecMeta;
  target: TestTarget;
  fixtures?: Fixture[];
  scenarios: TestScenario[];
  coverage?: CoverageRequirement;
}

export interface TestSpecRef {
  key: string;
  version?: number;
}

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

  get(name: string, version?: number): TestSpec | undefined {
    if (version != null) {
      return this.items.get(`${name}.v${version}`);
    }
    let latest: TestSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== name) continue;
      if (spec.meta.version > maxVersion) {
        maxVersion = spec.meta.version;
        latest = spec;
      }
    }
    return latest;
  }
}

export function makeTestKey(meta: TestSpecMeta) {
  return testKey(meta);
}
