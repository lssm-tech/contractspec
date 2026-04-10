import { describe, expect, it } from 'bun:test';
import { createEvidenceGate } from './gate';

describe('createEvidenceGate', () => {
	it('fails when required evidence is missing', () => {
		const gate = createEvidenceGate();
		const result = gate.evaluate({
			policy: {
				key: 'policy',
				requiredEvidence: ['tests'],
				minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
				failOnMissingEvidence: true,
				allowConditionalCompletion: false,
			},
			evidence: [],
			approvals: [],
		});

		expect(result.passed).toBe(false);
		expect(result.missingEvidence).toEqual(['tests']);
	});

	it('supports relaxed and conditional evidence policies', () => {
		const gate = createEvidenceGate();
		const result = gate.evaluate({
			policy: {
				key: 'conditional',
				requiredEvidence: ['tests'],
				minimumApprovals: [],
				failOnMissingEvidence: false,
				allowConditionalCompletion: true,
			},
			evidence: [],
			approvals: [],
		});

		expect(result.passed).toBe(true);
		expect(result.conditionallyPassed).toBe(true);
		expect(result.missingEvidence).toEqual(['tests']);
	});
});
