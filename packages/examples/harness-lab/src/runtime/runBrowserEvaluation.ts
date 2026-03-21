import { HarnessLabBrowserScenario } from '../scenarios';
import { startHarnessLabBrowserFixture } from './browserFixtureServer';
import { createHarnessLabEvaluationTools } from './createHarnessLabEvaluationTools';

export async function runHarnessLabBrowserEvaluation() {
	const fixture = await startHarnessLabBrowserFixture();

	try {
		const tools = createHarnessLabEvaluationTools({
			previewBaseUrl: fixture.baseUrl,
		});
		const evaluation = await tools.evaluationRunner.runScenarioEvaluation({
			scenario: HarnessLabBrowserScenario,
			mode: 'deterministic-browser',
			context: {
				metadata: {
					lane: 'browser-evaluation',
				},
			},
		});

		return {
			evaluation,
			replayBundle: tools.getReplayBundle(),
			replayUri: tools.getReplayUri(),
		};
	} finally {
		await fixture.close();
	}
}
