import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { summarizeHarnessReplayBundle } from '@contractspec/lib.harness';
import { chromium } from 'playwright';
import {
	HARNESS_LAB_AUTH_TEXT,
	HARNESS_LAB_BROWSER_RESULT_TEXT,
	HarnessLabAgentBrowserScenario,
	HarnessLabAuthenticatedBrowserScenario,
	HarnessLabBrowserScenario,
	HarnessLabDualModeSuite,
	HarnessLabSandboxScenario,
	HarnessLabVisualScenario,
} from './index';
import {
	runHarnessLabAgentBrowserEvaluation,
	runHarnessLabAuthenticatedBrowserEvaluation,
	runHarnessLabBrowserEvaluation,
	runHarnessLabSandboxEvaluation,
	runHarnessLabVisualEvaluation,
} from './runtime';
import {
	type HarnessLabBrowserFixtureServer,
	startHarnessLabBrowserFixture,
} from './runtime/browserFixtureServer';
import {
	createHarnessLabEvaluationTools,
	type HarnessLabEvaluationTools,
} from './runtime/createHarnessLabEvaluationTools';

const BROWSER_TEST_TIMEOUT_MS = 15_000;
const CAN_RUN_BROWSER_TESTS = await canRunPlaywrightChromium();
const CAN_RUN_AGENT_BROWSER_TESTS = await canRunAgentBrowser();
const browserIt = CAN_RUN_BROWSER_TESTS ? it : it.skip;
const agentBrowserIt =
	CAN_RUN_BROWSER_TESTS && CAN_RUN_AGENT_BROWSER_TESTS ? it : it.skip;

let browserFixture: HarnessLabBrowserFixtureServer | null = null;
let browserTools: HarnessLabEvaluationTools | null = null;
let authStatePath: string | null = null;
let tempDir: string | null = null;
const GENERATED_EVIDENCE_DIR = join(import.meta.dir, '..', '.contractspec');

beforeAll(async () => {
	if (!CAN_RUN_BROWSER_TESTS) {
		return;
	}

	browserFixture = await startHarnessLabBrowserFixture();
	tempDir = await mkdtemp(join(tmpdir(), 'harness-lab-auth-'));
	authStatePath = join(tempDir, 'operator.storage-state.json');
	await writeFile(
		authStatePath,
		JSON.stringify({
			cookies: [],
			origins: [
				{
					origin: browserFixture.baseUrl,
					localStorage: [{ name: 'harnessAuth', value: 'operator' }],
				},
			],
		}),
		'utf8'
	);
	browserTools = createHarnessLabEvaluationTools({
		previewBaseUrl: browserFixture.baseUrl,
		authProfiles: {
			operator: {
				key: 'operator',
				kind: 'storage-state',
				ref: authStatePath,
			},
		},
	});
});

afterAll(async () => {
	if (browserTools) {
		await browserTools.dispose();
		browserTools = null;
	}
	if (!browserFixture) {
		return;
	}

	await browserFixture.close();
	browserFixture = null;
	if (tempDir) {
		await rm(tempDir, { recursive: true, force: true });
		tempDir = null;
		authStatePath = null;
	}
	await rm(GENERATED_EVIDENCE_DIR, { recursive: true, force: true });
});

describe('@contractspec/example.harness-lab runtime', () => {
	it('runs the sandbox evaluation and produces a replay bundle', async () => {
		const result = await runHarnessLabSandboxEvaluation();
		const summary = summarizeHarnessReplayBundle(result.replayBundle);

		expect(result.evaluation.status).toBe('passed');
		expect(
			result.evaluation.assertions.every((item) => item.status === 'passed')
		).toBe(true);
		expect(result.evaluation.run.scenarioKey).toBe(
			HarnessLabSandboxScenario.meta.key
		);
		expect(summary.status).toBe('completed');
		expect(summary.stepCount).toBe(HarnessLabSandboxScenario.steps.length);
		expect(summary.artifactCount).toBe(HarnessLabSandboxScenario.steps.length);
		expect(summary.failedAssertions).toBe(0);
	});

	browserIt(
		'runs the browser evaluation with real screenshot and DOM evidence',
		async () => {
			if (!browserTools) {
				throw new Error('Harness lab browser tools were not initialized.');
			}

			const result = await runHarnessLabBrowserEvaluation({
				tools: browserTools,
			});
			const summary = summarizeHarnessReplayBundle(result.replayBundle);
			const screenshots = result.evaluation.artifacts.filter(
				(artifact) => artifact.kind === 'screenshot'
			);
			const domSnapshots = result.evaluation.artifacts.filter(
				(artifact) => artifact.kind === 'dom-snapshot'
			);

			expect(result.evaluation.status).toBe('passed');
			expect(
				result.evaluation.assertions.every((item) => item.status === 'passed')
			).toBe(true);
			expect(screenshots).toHaveLength(HarnessLabBrowserScenario.steps.length);
			expect(domSnapshots).toHaveLength(HarnessLabBrowserScenario.steps.length);
			expect(String(domSnapshots.at(-1)?.body ?? '')).toContain(
				HARNESS_LAB_BROWSER_RESULT_TEXT
			);
			expect(summary.stepCount).toBe(HarnessLabBrowserScenario.steps.length);
			expect(summary.artifactCount).toBe(
				HarnessLabBrowserScenario.steps.length * 2
			);
			expect(summary.failedAssertions).toBe(0);
		},
		{ timeout: BROWSER_TEST_TIMEOUT_MS }
	);

	browserIt(
		'runs the dual-mode suite through HarnessEvaluationRunner',
		async () => {
			if (!browserTools) {
				throw new Error('Harness lab browser tools were not initialized.');
			}

			const result = await browserTools.evaluationRunner.runSuiteEvaluation({
				suiteKey: HarnessLabDualModeSuite.meta.key,
				version: HarnessLabDualModeSuite.meta.version,
				context: {
					metadata: {
						lane: 'dual-mode-suite',
					},
				},
			});

			expect(result.evaluations).toHaveLength(2);
			expect(result.evaluations.every((item) => item.status === 'passed')).toBe(
				true
			);
			expect(result.summary.suiteKey).toBe(HarnessLabDualModeSuite.meta.key);
			expect(result.summary.totalScenarios).toBe(2);
			expect(result.summary.passedScenarios).toBe(2);
			expect(result.summary.failedScenarios).toBe(0);
			expect(result.summary.blockedScenarios).toBe(0);
			expect(result.summary.evidenceCount).toBe(
				HarnessLabSandboxScenario.steps.length +
					HarnessLabBrowserScenario.steps.length * 2
			);
			expect(result.summary.passRate).toBe(1);
		},
		{ timeout: BROWSER_TEST_TIMEOUT_MS }
	);

	browserIt(
		'runs an authenticated browser evaluation with storage-state auth refs',
		async () => {
			if (!browserTools || !authStatePath) {
				throw new Error('Harness lab auth tools were not initialized.');
			}

			const result = await runHarnessLabAuthenticatedBrowserEvaluation({
				authStatePath,
				tools: browserTools,
			});
			const domSnapshots = result.evaluation.artifacts.filter(
				(artifact) => artifact.kind === 'dom-snapshot'
			);

			expect(result.evaluation.status).toBe('passed');
			expect(result.evaluation.run.scenarioKey).toBe(
				HarnessLabAuthenticatedBrowserScenario.meta.key
			);
			expect(String(domSnapshots.at(-1)?.body ?? '')).toContain(
				HARNESS_LAB_AUTH_TEXT
			);
		},
		{ timeout: BROWSER_TEST_TIMEOUT_MS }
	);

	browserIt(
		'runs a visual baseline evaluation and records diff evidence',
		async () => {
			if (!browserTools) {
				throw new Error('Harness lab browser tools were not initialized.');
			}

			const result = await runHarnessLabVisualEvaluation({
				tools: browserTools,
			});
			const visualDiffs = result.evaluation.artifacts.filter(
				(artifact) => artifact.kind === 'visual-diff'
			);

			expect(result.evaluation.status).toBe('passed');
			expect(result.evaluation.run.scenarioKey).toBe(
				HarnessLabVisualScenario.meta.key
			);
			expect(visualDiffs).toHaveLength(1);
			expect(visualDiffs[0]?.metadata?.status).toBe('passed');
		},
		{ timeout: BROWSER_TEST_TIMEOUT_MS }
	);

	agentBrowserIt(
		'runs the optional agent-browser evaluation when the CLI is available',
		async () => {
			if (!browserTools) {
				throw new Error('Harness lab browser tools were not initialized.');
			}

			const result = await runHarnessLabAgentBrowserEvaluation({
				tools: browserTools,
			});

			expect(result.evaluation.status).toBe('passed');
			expect(result.evaluation.run.scenarioKey).toBe(
				HarnessLabAgentBrowserScenario.meta.key
			);
		},
		{ timeout: BROWSER_TEST_TIMEOUT_MS }
	);
});

async function canRunPlaywrightChromium(): Promise<boolean> {
	try {
		const browser = await chromium.launch({
			args: ['--disable-crashpad', '--disable-features=UseSkiaRenderer'],
		});
		await browser.close();
		return true;
	} catch {
		return false;
	}
}

async function canRunAgentBrowser(): Promise<boolean> {
	try {
		const proc = Bun.spawn(['agent-browser', '--version'], {
			stdout: 'ignore',
			stderr: 'ignore',
		});
		return (await proc.exited) === 0;
	} catch {
		return false;
	}
}
