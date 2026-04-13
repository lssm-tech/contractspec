import {
	createNodeAdapters,
	listTests,
	loadAuthoredModuleExports,
	runTestSpecs,
	TestGeneratorService,
} from '@contractspec/bundle.workspace';
import type { OperationSpec } from '@contractspec/lib.contracts-spec';
import chalk from 'chalk';
import { glob } from 'glob';
import { resolve } from 'path';
import { getAIProvider, validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';

const GLOB_CHARS = /[*?{]/;
const DEFAULT_IGNORES = ['**/node_modules/**', '**/dist/**', '**/.turbo/**'];

interface TestCommandOptions {
	registry?: string;
	json?: boolean;
	generate?: boolean;
	list?: boolean;
}

export async function testCommand(
	specFile: string,
	options: TestCommandOptions,
	config: Config
) {
	const adapters = createNodeAdapters({
		cwd: process.cwd(),
		silent: options.json,
	});

	if (options.list) {
		const specFiles = GLOB_CHARS.test(specFile)
			? await glob(specFile, { ignore: DEFAULT_IGNORES })
			: [specFile];
		const specs = await listTests(specFiles, adapters);
		if (options.json) {
			console.log(JSON.stringify(specs, null, 2));
		} else {
			console.log(chalk.blue(`Found ${specs.length} tests:`));
			for (const spec of specs) {
				console.log(`- ${spec.meta.key} (v${spec.meta.version})`);
			}
		}
		return;
	}

	if (options.generate) {
		// Generate tests logic
		adapters.logger.info(`Generating tests for ${specFile}...`);

		// 1. Load the spec file to find TARGET operations
		// This is basic implementation: specific file -> generate test for it
		try {
			const resolvedPath = resolve(specFile);
			const exports = await loadAuthoredModuleExports(resolvedPath);

			// Find OperationSpecs
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const operations: OperationSpec<any, any>[] = [];
			for (const value of Object.values(exports)) {
				if (isOperationSpec(value)) {
					operations.push(value);
				}
			}

			if (operations.length === 0) {
				adapters.logger.warn(
					'No operations found in file to generate tests for.'
				);
				return;
			}

			const providerStatus = await validateProvider(config);
			if (!providerStatus.success) {
				throw new Error(
					`AI provider unavailable: ${providerStatus.error ?? 'unknown error'}`
				);
			}

			const model = getAIProvider(config);

			const generator = new TestGeneratorService(adapters.logger, model);

			for (const op of operations) {
				// OperationSpec usually has meta { name, ... } or key
				// Checking definition... assuming spec.meta.name if available or fallback
				const opLegacy = op as unknown as {
					meta?: { name?: string };
					key?: string;
				};
				const name = opLegacy.meta?.name || opLegacy.key || 'unknown';
				adapters.logger.info(`Generating test for ${name}...`);
				const testSpec = await generator.generateTests(op);

				if (options.json) {
					console.log(JSON.stringify(testSpec, null, 2));
				} else {
					const opLegacy = op as unknown as {
						meta?: { name?: string };
						key?: string;
					};
					const name = opLegacy.meta?.name || opLegacy.key || 'unknown';
					console.log(chalk.green(`Generated test for ${name}`));
					console.log(JSON.stringify(testSpec, null, 2)); // Print to stdout for pipe
				}
			}
		} catch (error) {
			adapters.logger.error(
				`Generation failed: ${error instanceof Error ? error.message : String(error)}`
			);
			process.exit(1);
		}
		return;
	}

	// Run tests
	const resolvedSpecFiles = GLOB_CHARS.test(specFile)
		? await glob(specFile, { ignore: DEFAULT_IGNORES })
		: [specFile];
	const result = await runTestSpecs(
		resolvedSpecFiles,
		{
			registry: options.registry,
			pattern: undefined, // Could add pattern option to CLI later
		},
		adapters
	);

	if (options.json) {
		console.log(
			JSON.stringify(
				result.results.map((r) => ({
					spec: r.spec.meta,
					passed: r.passed,
					failed: r.failed,
					scenarios: r.scenarios.map((scenario) => ({
						key: scenario.scenario.key,
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

	if (!result.passed) {
		process.exit(1);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isOperationSpec(value: unknown): value is OperationSpec<any, any> {
	return (
		typeof value === 'object' &&
		value !== null &&
		(value as { kind?: unknown }).kind === 'operation'
	);
}
