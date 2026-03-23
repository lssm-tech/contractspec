import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
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
import { startHarnessLabBrowserFixture } from './runtime/browserFixtureServer';
import { createHarnessLabEvaluationTools } from './runtime/createHarnessLabEvaluationTools';

const browserIt = hasPlaywrightChromium() ? it : it.skip;

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
			const result = await runHarnessLabBrowserEvaluation();
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
		}
	);

	browserIt(
		'runs the dual-mode suite through HarnessEvaluationRunner',
		async () => {
			const fixture = await startHarnessLabBrowserFixture();

			try {
				const tools = createHarnessLabEvaluationTools({
					previewBaseUrl: fixture.baseUrl,
				});
				const result = await tools.evaluationRunner.runSuiteEvaluation({
					suiteKey: HarnessLabDualModeSuite.meta.key,
					version: HarnessLabDualModeSuite.meta.version,
					context: {
						metadata: {
							lane: 'dual-mode-suite',
						},
					},
				});

				expect(result.evaluations).toHaveLength(2);
				expect(
					result.evaluations.every((item) => item.status === 'passed')
				).toBe(true);
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
			} finally {
				await fixture.close();
			}
		}
	);
});

function hasPlaywrightChromium(): boolean {
	try {
		return existsSync(chromium.executablePath());
	} catch {
		return false;
	}
}
