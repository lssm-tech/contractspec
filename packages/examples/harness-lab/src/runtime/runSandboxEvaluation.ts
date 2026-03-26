import { HarnessLabSandboxScenario } from '../scenarios';
import { createHarnessLabEvaluationTools } from './createHarnessLabEvaluationTools';

export async function runHarnessLabSandboxEvaluation() {
	const tools = createHarnessLabEvaluationTools();
	try {
		const evaluation = await tools.evaluationRunner.runScenarioEvaluation({
			scenario: HarnessLabSandboxScenario,
			mode: 'code-execution',
			context: {
				metadata: {
					lane: 'sandbox-evaluation',
				},
			},
		});

		return {
			evaluation,
			replayBundle: tools.getReplayBundle(),
			replayUri: tools.getReplayUri(),
		};
	} finally {
		await tools.dispose();
	}
}
