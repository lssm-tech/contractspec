import { describe, expect, it } from 'bun:test';
import { validateClarificationArtifact } from '../../validation/clarification-artifact';
import { createClarifyLane } from './clarify';

describe('clarify lane', () => {
	it('classifies ambiguity, scope, conflicts, and the next lane directly', () => {
		const clarify = createClarifyLane();
		const artifact = clarify.run({
			request:
				'Security migration but maybe keep the legacy login path active?',
		});

		expect(artifact.meta.scopeClass).toBe('high-risk');
		expect(artifact.meta.ambiguityScore).toBe(1);
		expect(artifact.meta.recommendedNextLane).toBe('plan.consensus');
		expect(artifact.conflictSignals).toEqual([
			'Detected branching language around "but".',
		]);
		expect(artifact.openQuestions).toContain(
			'What is the concrete objective and success condition?'
		);
		expect(artifact.openQuestions).toContain(
			'Which constraints or compatibility surfaces are non-negotiable?'
		);
		expect(artifact.openQuestions).toContain(
			'Which tentative assumptions should be confirmed before planning?'
		);
		expect(validateClarificationArtifact(artifact)).toHaveLength(0);
	});
});
