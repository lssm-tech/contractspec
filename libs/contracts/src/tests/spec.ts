import { compareVersions } from 'compare-versions';
import type { OwnerShipMeta } from '../ownership';

export interface OperationTargetRef {
  key: string;
  version?: string;
}

export interface WorkflowTargetRef {
  key: string;
  version?: string;
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

export interface TestSpecRef {
  key: string;
  version?: string;
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
