import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { loadTypeScriptModule } from '../../utils/module-loader';
import type { Config } from '../../utils/config';
import { TestRunner, type TestSpec } from '@lssm/lib.contracts/tests';
import { SpecRegistry } from '@lssm/lib.contracts';

interface TestCommandOptions {
  registry?: string;
  json?: boolean;
}

interface LoadedRegistryModule {
  default?: unknown;
  createRegistry?: () => Promise<SpecRegistry> | SpecRegistry;
  registry?: SpecRegistry;
}

export async function testCommand(
  specFile: string,
  options: TestCommandOptions,
  _config: Config
) {
  const resolvedSpecPath = path.resolve(specFile);
  const specExports = await loadTypeScriptModule(resolvedSpecPath);
  const specs = extractTestSpecs(specExports);

  if (specs.length === 0) {
    throw new Error(
      `No TestSpec exports found in ${resolvedSpecPath}. Export one or more TestSpec objects.`
    );
  }

  const registry = options.registry
    ? await loadRegistry(path.resolve(options.registry))
    : new SpecRegistry();

  if (!options.registry) {
    console.warn(
      chalk.yellow(
        '⚠️ No registry module provided. Scenarios that execute operations without handlers will fail.'
      )
    );
  }

  const runner = new TestRunner({
    registry,
  });

  const results = [];
  for (const spec of specs) {
    const spinner = ora(`Running ${spec.meta.name}...`).start();
    try {
      const result = await runner.run(spec);
      results.push(result);
      if (result.failed > 0) {
        spinner.fail(
          chalk.red(
            `${spec.meta.name} failed (${result.failed}/${result.scenarios.length} scenarios)`
          )
        );
        logScenarioResults(result);
      } else {
        spinner.succeed(
          chalk.green(
            `${spec.meta.name} passed (${result.passed}/${result.scenarios.length} scenarios)`
          )
        );
      }
    } catch (error) {
      spinner.fail(
        chalk.red(
          `${spec.meta.name} failed with error: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        results.map((result) => ({
          spec: result.spec.meta,
          passed: result.passed,
          failed: result.failed,
          scenarios: result.scenarios.map((scenario) => ({
            name: scenario.scenario.name,
            status: scenario.status,
            error: scenario.error?.message,
            assertions: scenario.assertionResults.map((assertion) => ({
              type: assertion.assertion.type,
              status: assertion.status,
              message: assertion.message,
            })),
          })),
        })),
        null,
        2
      )
    );
  }
}

function extractTestSpecs(exports: Record<string, unknown>): TestSpec[] {
  const specs: TestSpec[] = [];
  for (const value of Object.values(exports)) {
    if (isTestSpec(value)) {
      specs.push(value);
    }
  }
  return specs;
}

function isTestSpec(value: unknown): value is TestSpec {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as TestSpec).scenarios) &&
    !!(value as TestSpec).meta?.name
  );
}

async function loadRegistry(modulePath: string): Promise<SpecRegistry> {
  const exports = (await loadTypeScriptModule(modulePath)) as LoadedRegistryModule;

  if (exports instanceof SpecRegistry) {
    return exports;
  }
  if (exports.registry instanceof SpecRegistry) {
    return exports.registry;
  }

  const factory =
    typeof exports.createRegistry === 'function'
      ? exports.createRegistry
      : typeof exports.default === 'function'
      ? (exports.default as () => Promise<SpecRegistry> | SpecRegistry)
      : undefined;

  if (factory) {
    const result = await factory();
    if (result instanceof SpecRegistry) {
      return result;
    }
  }

  throw new Error(
    `Registry module ${modulePath} must export a SpecRegistry instance or a factory function returning one.`
  );
}

function logScenarioResults(result: Awaited<ReturnType<TestRunner['run']>>) {
  for (const scenario of result.scenarios) {
    if (scenario.status === 'passed') continue;
    console.error(chalk.red(`  ✖ ${scenario.scenario.name}`));
    if (scenario.error) {
      console.error(chalk.red(`    ${scenario.error.message}`));
      continue;
    }
    for (const assertion of scenario.assertionResults) {
      if (assertion.status === 'failed') {
        console.error(
          chalk.red(
            `    ${assertion.assertion.type} failed${
              assertion.message ? `: ${assertion.message}` : ''
            }`
          )
        );
      }
    }
  }
}

