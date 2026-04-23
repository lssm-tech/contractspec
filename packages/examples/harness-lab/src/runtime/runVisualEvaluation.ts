import { HarnessLabVisualScenario } from '../scenarios';
import { startHarnessLabBrowserFixture } from './browserFixtureServer';
import {
	createHarnessLabEvaluationTools,
	type HarnessLabEvaluationTools,
} from './createHarnessLabEvaluationTools';

export interface RunHarnessLabVisualEvaluationOptions {
	previewBaseUrl?: string;
	tools?: HarnessLabEvaluationTools;
}

export async function runHarnessLabVisualEvaluation(
	options: RunHarnessLabVisualEvaluationOptions = {}
) {
	const fixture =
		options.previewBaseUrl != null || options.tools != null
			? null
			: await startHarnessLabBrowserFixture();

	try {
		const ownsTools = !options.tools;
		const tools =
			options.tools ??
			createHarnessLabEvaluationTools({
				previewBaseUrl: options.previewBaseUrl ?? fixture?.baseUrl,
			});
		try {
			const evaluation = await tools.evaluationRunner.runScenarioEvaluation({
				scenario: HarnessLabVisualScenario,
				mode: 'deterministic-browser',
				context: {
					metadata: {
						lane: 'visual-evaluation',
					},
				},
			});

			return {
				evaluation,
				replayBundle: tools.getReplayBundle(),
				replayUri: tools.getReplayUri(),
			};
		} finally {
			if (ownsTools) {
				await tools.dispose();
			}
		}
	} finally {
		if (fixture) {
			await fixture.close();
		}
	}
}
