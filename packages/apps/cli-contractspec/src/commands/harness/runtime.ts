import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { loadAuthoredModuleExports } from '@contractspec/bundle.workspace';
import {
	AgentBrowserHarnessAdapter,
	DefaultHarnessTargetResolver,
	FilesystemHarnessArtifactStore,
	type HarnessBrowserAuthProfileRef,
	type HarnessBrowserEngine,
	PlaywrightBrowserHarnessAdapter,
	SandboxedCodeExecutionAdapter,
} from '@contractspec/integration.harness-runtime';
import {
	HarnessScenarioRegistry,
	type HarnessScenarioSpec,
	HarnessSuiteRegistry,
	type HarnessSuiteSpec,
} from '@contractspec/lib.contracts-spec';
import type { TestingHarnessAuthProfileConfig } from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-types';
import {
	type HarnessApprovalGateway,
	HarnessEvaluationRunner,
	type HarnessReplayBundle,
	HarnessRunner,
} from '@contractspec/lib.harness';
import type { Config } from '../../utils/config';

export interface HarnessEvaluationRuntime {
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
	dispose(): Promise<void>;
}

export interface CreateHarnessEvaluationRuntimeInput {
	registryPath: string;
	config: Config;
	packageRoot: string;
	decisionId?: string;
	browserEngine?: HarnessBrowserEngine;
	targetUrl?: string;
	authProfile?: string;
}

export async function createHarnessEvaluationRuntime(
	input: CreateHarnessEvaluationRuntimeInput
): Promise<HarnessEvaluationRuntime> {
	const registries = await loadHarnessRegistries(resolve(input.registryPath));
	const paths = resolveHarnessRuntimePaths(input);
	const harnessConfig = input.config.testing?.harness;
	const browserEngine =
		input.browserEngine ?? harnessConfig?.browserEngine ?? 'playwright';
	const authProfiles = normalizeAuthProfiles(harnessConfig?.authProfiles);
	const browserAdapter = new PlaywrightBrowserHarnessAdapter({
		authProfiles,
		visual: harnessConfig?.visual,
	});
	const agentBrowserAdapter = new AgentBrowserHarnessAdapter({
		authProfiles,
		visual: harnessConfig?.visual,
	});
	const adapters = [
		new SandboxedCodeExecutionAdapter(),
		...(browserEngine === 'playwright' || browserEngine === 'both'
			? [browserAdapter]
			: []),
		...(browserEngine === 'agent-browser' || browserEngine === 'both'
			? [agentBrowserAdapter]
			: []),
	];
	const runner = new HarnessRunner({
		targetResolver: new DefaultHarnessTargetResolver({
			previewBaseUrl:
				input.targetUrl ??
				process.env.HARNESS_PREVIEW_BASE_URL ??
				harnessConfig?.targetBaseUrls?.preview,
			taskBaseUrl:
				process.env.HARNESS_TASK_BASE_URL ??
				harnessConfig?.targetBaseUrls?.task,
			sharedBaseUrl:
				process.env.HARNESS_SHARED_BASE_URL ??
				harnessConfig?.targetBaseUrls?.shared,
			sandboxBaseUrl:
				process.env.HARNESS_SANDBOX_BASE_URL ??
				harnessConfig?.targetBaseUrls?.sandbox,
			allowlistedDomains: harnessConfig?.allowlistedDomains,
		}),
		artifactStore: new FilesystemHarnessArtifactStore(paths.artifactRoot),
		adapters,
		approvalGateway: createHarnessCliApprovalGateway({
			allowlistedDomains: harnessConfig?.allowlistedDomains,
		}),
		defaultMode:
			browserEngine === 'agent-browser'
				? 'visual-computer-use'
				: 'deterministic-browser',
	});
	const evaluationRunner = new HarnessEvaluationRunner({
		runner,
		scenarioRegistry: registries.scenarioRegistry,
		suiteRegistry: registries.suiteRegistry,
		replaySink: {
			save: async (bundle) => saveReplayBundle(paths, bundle),
		},
	});

	return {
		runScenarioEvaluation: async ({ scenarioKey, version, context }) => {
			const scenario = registries.scenarioRegistry.get(scenarioKey, version);
			if (!scenario) throw new Error(`Unknown harness scenario ${scenarioKey}`);
			return evaluationRunner.runScenarioEvaluation({
				scenario,
				mode: resolveScenarioMode(scenario, browserEngine),
				target:
					input.targetUrl || harnessConfig?.allowlistedDomains
						? {
								baseUrl: input.targetUrl,
								allowlistedDomains: harnessConfig?.allowlistedDomains,
							}
						: undefined,
				context: withHarnessMetadata(context, input.authProfile),
			});
		},
		runSuiteEvaluation: async ({ suiteKey, version, context }) =>
			evaluationRunner.runSuiteEvaluation({
				suiteKey,
				version,
				mode: resolveSuiteMode({
					browserEngine,
					scenarioRegistry: registries.scenarioRegistry,
					suiteKey,
					suiteRegistry: registries.suiteRegistry,
					version,
				}),
				target:
					input.targetUrl || harnessConfig?.allowlistedDomains
						? {
								baseUrl: input.targetUrl,
								allowlistedDomains: harnessConfig?.allowlistedDomains,
							}
						: undefined,
				context: withHarnessMetadata(context, input.authProfile),
			}),
		dispose: async () => {
			await browserAdapter.dispose();
			await agentBrowserAdapter.dispose();
		},
	};
}

export function createHarnessCliApprovalGateway(input: {
	allowlistedDomains?: string[];
}): HarnessApprovalGateway {
	return {
		async approve(request) {
			const autoApprovable =
				request.actionClass === 'login' ||
				request.actionClass === 'form-submit';
			if (!autoApprovable) {
				return {
					approved: false,
					reason: `Action ${request.actionClass} requires explicit approval.`,
				};
			}
			if (
				!isLocalAutoApprovalTarget(request.target, input.allowlistedDomains)
			) {
				return {
					approved: false,
					reason: 'Approval required for non-local harness target.',
				};
			}
			return {
				approved: true,
				approverId: 'contractspec-harness-local-auto-approval',
				reason: 'Auto-approved local harness browser flow.',
			};
		},
	};
}

async function loadHarnessRegistries(registryPath: string) {
	try {
		const loaded = await loadAuthoredModuleExports(registryPath);
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

function collectScenarios(
	exportsObject: Record<string, unknown>
): HarnessScenarioSpec[] {
	const explicit = Array.isArray(exportsObject.scenarios)
		? (exportsObject.scenarios as HarnessScenarioSpec[])
		: [];
	const inferred = Object.values(exportsObject).filter(
		isScenarioSpec
	) as HarnessScenarioSpec[];
	return dedupeByKey([...explicit, ...inferred].filter(Boolean));
}

function collectSuites(
	exportsObject: Record<string, unknown>
): HarnessSuiteSpec[] {
	const explicit = Array.isArray(exportsObject.suites)
		? (exportsObject.suites as HarnessSuiteSpec[])
		: [];
	const inferred = Object.values(exportsObject).filter(
		isSuiteSpec
	) as HarnessSuiteSpec[];
	return dedupeByKey([...explicit, ...inferred].filter(Boolean));
}

function dedupeByKey<T extends { meta: { key: string; version?: string } }>(
	items: T[]
): T[] {
	return Array.from(
		new Map(
			items.map((item) => [
				`${item.meta.key}@${item.meta.version ?? '1.0.0'}`,
				item,
			])
		).values()
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

function normalizeAuthProfiles(
	profiles: Record<string, TestingHarnessAuthProfileConfig> | undefined
): Record<string, HarnessBrowserAuthProfileRef> | undefined {
	if (!profiles) return undefined;
	return Object.fromEntries(
		Object.entries(profiles).map(([key, value]) => [
			key,
			{ key, ...(value as Omit<HarnessBrowserAuthProfileRef, 'key'>) },
		])
	);
}

function resolveHarnessRuntimePaths(
	input: CreateHarnessEvaluationRuntimeInput
) {
	if (input.decisionId) {
		const root = input.config.connect?.storage?.root ?? '.contractspec/connect';
		const decisionRoot = resolve(
			input.packageRoot,
			root,
			'decisions',
			input.decisionId
		);
		return {
			mode: 'connect' as const,
			root: decisionRoot,
			artifactRoot: join(decisionRoot, 'artifacts'),
		};
	}

	const root = resolve(
		input.packageRoot,
		input.config.testing?.harness?.artifactRoot ?? '.contractspec/harness'
	);
	return {
		mode: 'harness' as const,
		root,
		artifactRoot: join(root, 'runs'),
	};
}

async function saveReplayBundle(
	paths: ReturnType<typeof resolveHarnessRuntimePaths>,
	bundle: unknown
) {
	const runId = isReplayBundle(bundle) ? bundle.run.runId : 'unknown-run';
	const bundlePath =
		paths.mode === 'connect'
			? join(paths.root, 'replay-bundle.json')
			: join(paths.root, 'runs', runId, 'replay-bundle.json');
	await mkdir(dirname(bundlePath), { recursive: true });
	await writeFile(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf-8');
	return bundlePath;
}

function isReplayBundle(value: unknown): value is HarnessReplayBundle {
	return (
		typeof value === 'object' &&
		value !== null &&
		'run' in value &&
		'artifacts' in value &&
		'assertions' in value
	);
}

function resolveScenarioMode(
	scenario: HarnessScenarioSpec,
	browserEngine: HarnessBrowserEngine
) {
	const preferred =
		browserEngine === 'agent-browser'
			? 'visual-computer-use'
			: 'deterministic-browser';
	return scenario.allowedModes.includes(preferred)
		? preferred
		: scenario.allowedModes[0];
}

function resolveSuiteMode(input: {
	browserEngine: HarnessBrowserEngine;
	scenarioRegistry: HarnessScenarioRegistry;
	suiteKey: string;
	suiteRegistry: HarnessSuiteRegistry;
	version?: string;
}) {
	const suite = input.suiteRegistry.get(input.suiteKey, input.version);
	if (!suite) return undefined;
	const preferred =
		input.browserEngine === 'agent-browser'
			? 'visual-computer-use'
			: 'deterministic-browser';
	const scenarios = suite.scenarios.map((entry) =>
		input.scenarioRegistry.get(entry.scenario.key, entry.scenario.version)
	);
	return scenarios.length > 0 &&
		scenarios.every((scenario) => scenario?.allowedModes.includes(preferred))
		? preferred
		: undefined;
}

function isLocalAutoApprovalTarget(
	target: Parameters<HarnessApprovalGateway['approve']>[0]['target'],
	configuredAllowlist: string[] | undefined
) {
	if (
		target.kind !== 'preview' &&
		target.kind !== 'task' &&
		target.kind !== 'sandbox'
	) {
		return false;
	}
	const host = target.baseUrl ? hostnameFor(target.baseUrl) : undefined;
	if (!host) return Boolean(configuredAllowlist?.length);
	if (
		isLoopbackHost(host) ||
		host.endsWith('.local') ||
		host.endsWith('.test')
	) {
		return true;
	}
	return Boolean(configuredAllowlist?.includes(host));
}

function hostnameFor(url: string) {
	try {
		return new URL(url).hostname;
	} catch {
		return undefined;
	}
}

function isLoopbackHost(host: string) {
	return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function withHarnessMetadata(
	context: Record<string, unknown> | undefined,
	authProfile: string | undefined
) {
	return {
		...(context ?? {}),
		metadata: {
			...((context?.['metadata'] as Record<string, unknown> | undefined) ?? {}),
			...(authProfile ? { authProfile } : {}),
		},
	};
}
