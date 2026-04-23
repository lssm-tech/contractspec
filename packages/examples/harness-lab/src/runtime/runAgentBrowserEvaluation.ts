import { HarnessLabAgentBrowserScenario } from '../scenarios';
import { startHarnessLabBrowserFixture } from './browserFixtureServer';
import {
	createHarnessLabEvaluationTools,
	type HarnessLabEvaluationTools,
} from './createHarnessLabEvaluationTools';

export interface RunHarnessLabAgentBrowserEvaluationOptions {
	previewBaseUrl?: string;
	tools?: HarnessLabEvaluationTools;
}

export async function runHarnessLabAgentBrowserEvaluation(
	options: RunHarnessLabAgentBrowserEvaluationOptions = {}
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
				scenario: HarnessLabAgentBrowserScenario,
				mode: 'visual-computer-use',
				context: {
					metadata: {
						lane: 'agent-browser-evaluation',
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
