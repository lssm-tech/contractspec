import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
	HarnessScenarioRegistry,
	HarnessSuiteRegistry,
	type HarnessScenarioSpec,
	type HarnessSuiteSpec,
} from '@contractspec/lib.contracts-spec';
import { HarnessEvaluationRunner, HarnessRunner } from '@contractspec/lib.harness';
import {
	DefaultHarnessTargetResolver,
	FilesystemHarnessArtifactStore,
	PlaywrightBrowserHarnessAdapter,
	SandboxedCodeExecutionAdapter,
} from '@contractspec/integration.harness-runtime';
import { loadTypeScriptModule } from '../../utils/module-loader';
import type { Config } from '../../utils/config';

interface ConnectEvaluationRuntime {
	runScenarioEvaluation(input: {
		scenarioKey: string;
		version?: string;
		context?: Record<string, unknown>;
	}): Promise<unknown>;
	runSuiteEvaluation(input: {
		suiteKey: string;
		version?: string;
		context?: Record<string, unknown>;
	}): Promise<unknown>;
}

export async function createConnectEvaluationRuntime(input: {
	registryPath: string;
	config: Config;
	packageRoot: string;
	decisionId: string;
}): Promise<ConnectEvaluationRuntime> {
	const registries = await loadHarnessRegistries(resolve(input.registryPath));
	const historyDir = resolveDecisionHistoryDir(input.packageRoot, input.config, input.decisionId);
	const browserAdapter = new PlaywrightBrowserHarnessAdapter();
	const runner = new HarnessRunner({
		targetResolver: new DefaultHarnessTargetResolver({
			previewBaseUrl: process.env.HARNESS_PREVIEW_BASE_URL,
			taskBaseUrl: process.env.HARNESS_TASK_BASE_URL,
			sharedBaseUrl: process.env.HARNESS_SHARED_BASE_URL,
			sandboxBaseUrl: process.env.HARNESS_SANDBOX_BASE_URL,
		}),
		artifactStore: new FilesystemHarnessArtifactStore(join(historyDir, 'artifacts')),
		adapters: [new SandboxedCodeExecutionAdapter(), browserAdapter],
		defaultMode: 'code-execution',
	});
	const evaluationRunner = new HarnessEvaluationRunner({
		runner,
		scenarioRegistry: registries.scenarioRegistry,
		suiteRegistry: registries.suiteRegistry,
		replaySink: {
			save: async (bundle) => {
				const bundlePath = join(historyDir, 'replay-bundle.json');
				await writeFile(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf-8');
				return bundlePath;
			},
		},
	});

	return {
		runScenarioEvaluation: async ({ scenarioKey, version, context }) => {
			try {
				const scenario = registries.scenarioRegistry.get(scenarioKey, version);
				if (!scenario) {
					throw new Error(`Unknown harness scenario ${scenarioKey}`);
				}
				return await evaluationRunner.runScenarioEvaluation({ scenario, context });
			} finally {
				await browserAdapter.dispose();
			}
		},
		runSuiteEvaluation: async ({ suiteKey, version, context }) => {
			try {
				return await evaluationRunner.runSuiteEvaluation({
					suiteKey,
					version,
					context,
				});
			} finally {
				await browserAdapter.dispose();
			}
		},
	};
}

async function loadHarnessRegistries(registryPath: string) {
	try {
		const loaded = await loadTypeScriptModule(registryPath);
		const scenarios = collectScenarios(loaded);
		const suites = collectSuites(loaded);

		return {
			scenarioRegistry:
				loaded.scenarioRegistry instanceof HarnessScenarioRegistry
					? loaded.scenarioRegistry
					: new HarnessScenarioRegistry(scenarios),
			suiteRegistry:
				loaded.suiteRegistry instanceof HarnessSuiteRegistry
					? loaded.suiteRegistry
					: new HarnessSuiteRegistry(suites),
		};
	} catch (error) {
		throw new Error(
			`Could not load registry module: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

function collectScenarios(exportsObject: Record<string, unknown>): HarnessScenarioSpec[] {
	const explicit = Array.isArray(exportsObject.scenarios)
		? (exportsObject.scenarios as HarnessScenarioSpec[])
		: [];
	const inferred = Object.values(exportsObject).filter(isScenarioSpec) as HarnessScenarioSpec[];
	return dedupeByKey([...explicit, ...inferred].filter(Boolean));
}

function collectSuites(exportsObject: Record<string, unknown>): HarnessSuiteSpec[] {
	const explicit = Array.isArray(exportsObject.suites)
		? (exportsObject.suites as HarnessSuiteSpec[])
		: [];
	const inferred = Object.values(exportsObject).filter(isSuiteSpec) as HarnessSuiteSpec[];
	return dedupeByKey([...explicit, ...inferred].filter(Boolean));
}

function dedupeByKey<T extends { meta: { key: string; version?: string } }>(items: T[]): T[] {
	return Array.from(
		new Map(items.map((item) => [`${item.meta.key}@${item.meta.version ?? '1.0.0'}`, item])).values()
	);
}

function isScenarioSpec(value: unknown): value is HarnessScenarioSpec {
	return Boolean(
		value &&
			typeof value === 'object' &&
			'meta' in value &&
			'steps' in value &&
			Array.isArray((value as HarnessScenarioSpec).steps)
	);
}

function isSuiteSpec(value: unknown): value is HarnessSuiteSpec {
	return Boolean(
		value &&
			typeof value === 'object' &&
			'meta' in value &&
			'scenarios' in value &&
			Array.isArray((value as HarnessSuiteSpec).scenarios)
	);
}

function resolveDecisionHistoryDir(
	packageRoot: string,
	config: Config,
	decisionId: string
): string {
	const root = config.connect?.storage?.root ?? '.contractspec/connect';
	return resolve(packageRoot, root, 'decisions', decisionId);
}
