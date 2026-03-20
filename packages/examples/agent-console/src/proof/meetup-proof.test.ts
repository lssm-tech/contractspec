import { describe, expect, it } from 'bun:test';
import { summarizeHarnessReplayBundle } from '@contractspec/lib.harness';
import { runAgentConsoleMeetupProof } from './meetup-proof';
import { AGENT_CONSOLE_MEETUP_PROOF_SCENARIO } from './meetup-proof.scenario';

describe('agent-console meetup proof', () => {
	it('runs the canonical walkthrough and generates a replay bundle', async () => {
		const result = await runAgentConsoleMeetupProof();
		const summary = summarizeHarnessReplayBundle(result.replayBundle);

		expect(result.evaluation.status).toBe('passed');
		expect(
			result.evaluation.assertions.every((item) => item.status === 'passed')
		).toBe(true);
		expect(result.evaluation.run.scenarioKey).toBe(
			AGENT_CONSOLE_MEETUP_PROOF_SCENARIO.meta.key
		);
		expect(result.replayUri).toBe('memory://agent-console-meetup-proof');
		expect(summary.status).toBe('completed');
		expect(summary.stepCount).toBe(
			AGENT_CONSOLE_MEETUP_PROOF_SCENARIO.steps.length
		);
		expect(summary.artifactCount).toBe(
			AGENT_CONSOLE_MEETUP_PROOF_SCENARIO.steps.length
		);
		expect(summary.failedAssertions).toBe(0);
	});
});
