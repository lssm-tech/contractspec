import { deepStrictEqual } from 'node:assert';
import { SpecRegistry } from '../index';
import type { HandlerCtx } from '../types';
import type {
  Action,
  Assertion,
  ExpectErrorAssertion,
  ExpectEventsAssertion,
  ExpectOutputAssertion,
  Fixture,
  TestScenario,
  TestSpec,
} from './spec';

export interface ScenarioRunResult {
  scenario: TestScenario;
  status: 'passed' | 'failed';
  error?: Error;
  assertionResults: AssertionResult[];
}

export interface AssertionResult {
  assertion: Assertion;
  status: 'passed' | 'failed';
  message?: string;
}

export interface TestRunResult {
  spec: TestSpec;
  scenarios: ScenarioRunResult[];
  passed: number;
  failed: number;
}

export interface TestRunnerConfig {
  registry: SpecRegistry;
  createContext?: () => HandlerCtx | Promise<HandlerCtx>;
  beforeEach?: (scenario: TestScenario) => void | Promise<void>;
  afterEach?: (
    scenario: TestScenario,
    result: ScenarioRunResult
  ) => void | Promise<void>;
}

interface OperationResult {
  output?: unknown;
  error?: Error;
  events: RecordedEvent[];
}

interface RecordedEvent {
  name: string;
  version: number;
  payload: unknown;
}

export class TestRunner {
  constructor(private readonly config: TestRunnerConfig) {}

  async run(spec: TestSpec): Promise<TestRunResult> {
    const scenarios: ScenarioRunResult[] = [];
    let passed = 0;
    let failed = 0;

    for (const scenario of spec.scenarios) {
      await this.config.beforeEach?.(scenario);

      const result = await this.runScenario(spec, scenario);
      scenarios.push(result);
      if (result.status === 'passed') passed += 1;
      else failed += 1;

      await this.config.afterEach?.(scenario, result);
    }

    return {
      spec,
      scenarios,
      passed,
      failed,
    };
  }

  private async runScenario(
    spec: TestSpec,
    scenario: TestScenario
  ): Promise<ScenarioRunResult> {
    const assertionResults: AssertionResult[] = [];

    try {
      const context = await this.createContext();
      const fixtures = [...(spec.fixtures ?? []), ...(scenario.given ?? [])];
      const events: RecordedEvent[] = [];

      for (const fixture of fixtures) {
        await this.executeOperation(fixture, context, events);
      }

      const actionResult = await this.executeOperation(
        scenario.when,
        context,
        events
      );

      const assertions = scenario.then ?? [];
      for (const assertion of assertions) {
        const assertionResult = this.evaluateAssertion(
          assertion,
          actionResult,
          events
        );
        assertionResults.push(assertionResult);
      }

      const hasFailure = assertionResults.some(
        (assertion) => assertion.status === 'failed'
      );
      return {
        scenario,
        status: hasFailure ? 'failed' : 'passed',
        assertionResults,
      };
    } catch (error) {
      return {
        scenario,
        status: 'failed',
        error: error as Error,
        assertionResults,
      };
    }
  }

  private async createContext(): Promise<HandlerCtx> {
    const baseCtx = (await this.config.createContext?.()) ?? {};
    return { ...baseCtx };
  }

  private async executeOperation(
    action: Action | Fixture,
    baseCtx: HandlerCtx,
    recordedEvents: RecordedEvent[]
  ): Promise<OperationResult> {
    const ctx: HandlerCtx = {
      ...baseCtx,
      eventPublisher: async (event) => {
        recordedEvents.push({
          name: event.name,
          version: event.version,
          payload: event.payload,
        });
        await baseCtx.eventPublisher?.(event);
      },
    };

    try {
      const output = await this.config.registry.execute(
        action.operation.name,
        action.operation.version,
        action.input ?? null,
        ctx
      );
      return { output, events: recordedEvents };
    } catch (error) {
      return { error: error as Error, events: recordedEvents };
    }
  }

  private evaluateAssertion(
    assertion: Assertion,
    result: OperationResult,
    events: RecordedEvent[]
  ): AssertionResult {
    switch (assertion.type) {
      case 'expectOutput':
        return this.evaluateOutputAssertion(assertion, result);
      case 'expectError':
        return this.evaluateErrorAssertion(assertion, result);
      case 'expectEvents':
        return this.evaluateEventsAssertion(assertion, events);
      default:
        return {
          assertion,
          status: 'failed',
          message: `Unknown assertion type ${(assertion as Assertion).type}`,
        };
    }
  }

  private evaluateOutputAssertion(
    assertion: ExpectOutputAssertion,
    result: OperationResult
  ): AssertionResult {
    if (result.error) {
      return {
        assertion,
        status: 'failed',
        message: `Expected output but operation threw error: ${result.error.message}`,
      };
    }
    try {
      deepStrictEqual(result.output, assertion.match);
      return { assertion, status: 'passed' };
    } catch (error) {
      return {
        assertion,
        status: 'failed',
        message:
          error instanceof Error ? error.message : 'Output assertion failed',
      };
    }
  }

  private evaluateErrorAssertion(
    assertion: ExpectErrorAssertion,
    result: OperationResult
  ): AssertionResult {
    if (!result.error) {
      return {
        assertion,
        status: 'failed',
        message: 'Expected an error but operation completed successfully',
      };
    }
    if (
      assertion.messageIncludes &&
      !result.error.message.includes(assertion.messageIncludes)
    ) {
      return {
        assertion,
        status: 'failed',
        message: `Error message "${result.error.message}" did not include expected substring "${assertion.messageIncludes}"`,
      };
    }
    return { assertion, status: 'passed' };
  }

  private evaluateEventsAssertion(
    assertion: ExpectEventsAssertion,
    events: RecordedEvent[]
  ): AssertionResult {
    const failures: string[] = [];

    for (const expected of assertion.events) {
      const matches = events.filter(
        (event) =>
          event.name === expected.name && event.version === expected.version
      );
      const count = matches.length;
      if (
        (typeof expected.min === 'number' && count < expected.min) ||
        (typeof expected.max === 'number' && count > expected.max)
      ) {
        failures.push(
          `Event ${expected.name}.v${expected.version} occurred ${count} times (expected ${expected.min ?? 0} - ${expected.max ?? '∞'})`
        );
      } else if (
        typeof expected.min === 'undefined' &&
        typeof expected.max === 'undefined' &&
        count === 0
      ) {
        failures.push(
          `Event ${expected.name}.v${expected.version} did not occur`
        );
      }
    }

    if (failures.length > 0) {
      return {
        assertion,
        status: 'failed',
        message: failures.join('; '),
      };
    }
    return { assertion, status: 'passed' };
  }
}

