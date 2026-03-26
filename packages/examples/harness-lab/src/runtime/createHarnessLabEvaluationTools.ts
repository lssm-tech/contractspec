import {
	DefaultHarnessTargetResolver,
	InMemoryHarnessArtifactStore,
	PlaywrightBrowserHarnessAdapter,
	SandboxedCodeExecutionAdapter,
} from '@contractspec/integration.harness-runtime';
import {
	HarnessScenarioRegistry,
	HarnessSuiteRegistry,
} from '@contractspec/lib.contracts-spec';
import {
	HarnessEvaluationRunner,
	type HarnessReplayBundle,
	type HarnessReplaySink,
	HarnessRunner,
} from '@contractspec/lib.harness';
import {
	HarnessLabBrowserScenario,
	HarnessLabSandboxScenario,
} from '../scenarios';
import { HarnessLabDualModeSuite } from '../suite';

export interface HarnessLabEvaluationToolsOptions {
	previewBaseUrl?: string;
	sandboxBaseUrl?: string;
	replaySink?: HarnessReplaySink;
}

export interface HarnessLabEvaluationTools {
	artifactStore: InMemoryHarnessArtifactStore;
	evaluationRunner: HarnessEvaluationRunner;
	getReplayBundle(): HarnessReplayBundle;
	getReplayUri(): string | undefined;
	dispose(): Promise<void>;
}

export function createHarnessLabNow() {
	let tick = 0;
	const base = Date.parse('2026-03-20T10:00:00.000Z');
	return () => new Date(base + tick++ * 1_000);
}

export function createHarnessLabIdFactory(prefix: string) {
	let index = 0;
	return () => `${prefix}-${++index}`;
}

function isHarnessReplayBundle(value: unknown): value is HarnessReplayBundle {
	return (
		typeof value === 'object' &&
		value !== null &&
		'version' in value &&
		'run' in value &&
		'assertions' in value &&
		'artifacts' in value
	);
}

function createReplayCapture(delegate?: HarnessReplaySink) {
	let bundle: HarnessReplayBundle | null = null;
	let replayUri: string | undefined;

	const sink: HarnessReplaySink = {
		async save(candidate: unknown) {
			if (!isHarnessReplayBundle(candidate)) {
				throw new Error('Harness lab replay sink received an invalid bundle.');
			}

			bundle = candidate;
			replayUri =
				(await delegate?.save(candidate)) ??
				`memory://${candidate.run.scenarioKey ?? candidate.run.suiteKey ?? 'harness-lab'}`;
			return replayUri;
		},
	};

	return {
		sink,
		getBundle() {
			if (!bundle) {
				throw new Error('Harness lab evaluation did not emit a replay bundle.');
			}
			return bundle;
		},
		getReplayUri() {
			return replayUri;
		},
	};
}

export function createHarnessLabEvaluationTools(
	options: HarnessLabEvaluationToolsOptions = {}
): HarnessLabEvaluationTools {
	const now = createHarnessLabNow();
	const replayCapture = createReplayCapture(options.replaySink);
	const artifactStore = new InMemoryHarnessArtifactStore();
	const browserAdapter = new PlaywrightBrowserHarnessAdapter();
	const runner = new HarnessRunner({
		targetResolver: new DefaultHarnessTargetResolver({
			previewBaseUrl: options.previewBaseUrl,
			sandboxBaseUrl:
				options.sandboxBaseUrl ??
				'https://sandbox.contractspec.local/harness-lab',
		}),
		artifactStore,
		adapters: [
			new SandboxedCodeExecutionAdapter({ timeoutMs: 1_000 }),
			browserAdapter,
		],
		approvalGateway: {
			async approve() {
				return { approved: true, approverId: 'harness-lab' };
			},
		},
		now,
		idFactory: createHarnessLabIdFactory('harness-lab-run'),
		defaultMode: 'code-execution',
	});

	const evaluationRunner = new HarnessEvaluationRunner({
		runner,
		scenarioRegistry: new HarnessScenarioRegistry([
			HarnessLabSandboxScenario,
			HarnessLabBrowserScenario,
		]),
		suiteRegistry: new HarnessSuiteRegistry([HarnessLabDualModeSuite]),
		replaySink: replayCapture.sink,
		now,
		idFactory: createHarnessLabIdFactory('harness-lab-evaluation'),
	});

	return {
		artifactStore,
		evaluationRunner,
		getReplayBundle: replayCapture.getBundle,
		getReplayUri: replayCapture.getReplayUri,
		dispose: () => browserAdapter.dispose(),
	};
}
