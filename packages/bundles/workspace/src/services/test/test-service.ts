import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec';
import {
	TestRunner,
	type TestRunResult,
	type TestSpec,
} from '@contractspec/lib.contracts-spec/tests';
import { resolve } from 'path';
import type { WorkspaceAdapters } from '../../ports/logger';
import {
	loadAuthoredModuleExports,
	loadAuthoredModuleValue,
} from '../module-loader';

export interface TestServiceOptions {
	registry?: string;
	pattern?: string;
}

export interface TestServiceResult {
	results: TestRunResult[];
	passed: boolean;
}

export interface RunTestsResult {
	results: TestRunResult[];
	passed: number;
	failed: number;
}

export async function runTests(
	specs: TestSpec[],
	registry: OperationSpecRegistry
): Promise<RunTestsResult> {
	const runner = new TestRunner({ registry });

	const results: TestRunResult[] = [];
	let passed = 0;
	let failed = 0;

	for (const spec of specs) {
		const result = await runner.run(spec);
		results.push(result);
		passed += result.passed;
		failed += result.failed;
	}

	return { results, passed, failed };
}

export async function runTestSpecs(
	specFiles: string[],
	options: TestServiceOptions,
	adapters: WorkspaceAdapters
): Promise<TestServiceResult> {
	const { logger } = adapters;

	// Load registry
	let registry: OperationSpecRegistry;
	if (options.registry) {
		registry = await loadRegistry(resolve(options.registry));
	} else {
		registry = new OperationSpecRegistry();
		logger.warn(
			'No registry module provided. Scenarios that execute operations without handlers will fail.'
		);
	}

	const runner = new TestRunner({ registry });
	const results: TestRunResult[] = [];
	let allPassed = true;

	for (const specFile of specFiles) {
		try {
			const resolvedPath = resolve(specFile);
			const exports = await loadAuthoredModuleExports(resolvedPath);
			const specs = extractTestSpecs(exports);

			if (specs.length === 0) {
				logger.warn(`No TestSpec exports found in ${specFile}`);
				continue;
			}

			for (const spec of specs) {
				logger.info(`Running ${spec.meta.key}...`);
				const result = await runner.run(spec);
				results.push(result);

				if (result.failed > 0) {
					allPassed = false;
					logger.error(
						`${spec.meta.key} failed (${result.failed}/${result.scenarios.length})`
					);
				} else {
					logger.info(
						`${spec.meta.key} passed (${result.passed}/${result.scenarios.length})`
					);
				}
			}
		} catch (error) {
			logger.error(
				`Failed to load/run spec ${specFile}: ${error instanceof Error ? error.message : String(error)}`
			);
			allPassed = false;
		}
	}

	return { results, passed: allPassed };
}

/**
 * List all available tests in the given files.
 */
export async function listTests(
	specFiles: string[],
	adapters: WorkspaceAdapters
): Promise<TestSpec[]> {
	const specs: TestSpec[] = [];

	for (const specFile of specFiles) {
		try {
			const resolvedPath = resolve(specFile);
			const exports = await loadAuthoredModuleExports(resolvedPath);
			const fileSpecs = extractTestSpecs(exports);
			specs.push(...fileSpecs);
		} catch (error) {
			adapters.logger.warn(
				`Failed to load tests from ${specFile}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	return specs;
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
		!!(value as TestSpec).meta?.key
	);
}

async function loadRegistry(
	modulePath: string
): Promise<OperationSpecRegistry> {
	return loadAuthoredModuleValue(modulePath, {
		description: 'OperationSpecRegistry',
		isValue: (value): value is OperationSpecRegistry =>
			value instanceof OperationSpecRegistry,
		instanceKeys: ['registry'],
		factoryKeys: ['createRegistry', 'default'],
	});
}
