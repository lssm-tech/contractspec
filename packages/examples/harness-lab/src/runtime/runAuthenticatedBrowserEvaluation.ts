import { HarnessLabAuthenticatedBrowserScenario } from '../scenarios';
import { startHarnessLabBrowserFixture } from './browserFixtureServer';
import {
	createHarnessLabEvaluationTools,
	type HarnessLabEvaluationTools,
} from './createHarnessLabEvaluationTools';

export interface RunHarnessLabAuthenticatedBrowserEvaluationOptions {
	authStatePath: string;
	previewBaseUrl?: string;
	tools?: HarnessLabEvaluationTools;
}

export async function runHarnessLabAuthenticatedBrowserEvaluation(
	options: RunHarnessLabAuthenticatedBrowserEvaluationOptions
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
				authProfiles: {
					operator: {
						key: 'operator',
						kind: 'storage-state',
						ref: options.authStatePath,
					},
				},
			});
		try {
			const evaluation = await tools.evaluationRunner.runScenarioEvaluation({
				scenario: HarnessLabAuthenticatedBrowserScenario,
				mode: 'deterministic-browser',
				context: {
					metadata: {
						lane: 'authenticated-browser-evaluation',
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
