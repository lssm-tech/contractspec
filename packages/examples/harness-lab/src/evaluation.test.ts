import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { summarizeHarnessReplayBundle } from '@contractspec/lib.harness';
import { chromium } from 'playwright';
import {
	HARNESS_LAB_BROWSER_RESULT_TEXT,
	HarnessLabBrowserScenario,
	HarnessLabDualModeSuite,
	HarnessLabSandboxScenario,
} from './index';
import {
	runHarnessLabBrowserEvaluation,
	runHarnessLabSandboxEvaluation,
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
const browserIt = CAN_RUN_BROWSER_TESTS ? it : it.skip;

let browserFixture: HarnessLabBrowserFixtureServer | null = null;
let browserTools: HarnessLabEvaluationTools | null = null;

beforeAll(async () => {
	if (!CAN_RUN_BROWSER_TESTS) {
		return;
	}

	browserFixture = await startHarnessLabBrowserFixture();
	browserTools = createHarnessLabEvaluationTools({
		previewBaseUrl: browserFixture.baseUrl,
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
