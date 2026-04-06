import type {
	AuthorityContextRefs,
	ClarificationArtifact,
	ExecutionScopeClass,
} from '../../types';
import { createId } from '../../utils/id';
import { assertValidClarificationArtifact } from '../../validation/clarification-artifact';

export interface ClarifyInput {
	request: string;
	objective?: string;
	constraints?: string[];
	assumptions?: string[];
	authorityContext?: AuthorityContextRefs;
}

export function createClarifyLane() {
	return {
		run(input: ClarifyInput): ClarificationArtifact {
			const ambiguityScore = calculateAmbiguityScore(input);
			return assertValidClarificationArtifact({
				meta: {
					id: createId('clarify'),
					createdAt: new Date().toISOString(),
					sourceRequest: input.request,
					scopeClass: classifyScope(input.request),
					ambiguityScore,
					recommendedNextLane: 'plan.consensus',
				},
				objective: input.objective ?? summarizeObjective(input.request),
				constraints: input.constraints ?? [],
				assumptions: input.assumptions ?? [],
				openQuestions: buildOpenQuestions(input),
				conflictSignals: detectConflictSignals(input.request),
				authorityContext: input.authorityContext ?? {
					policyRefs: [],
					ruleContextRefs: [],
				},
			});
		},
	};
}

function calculateAmbiguityScore(input: ClarifyInput): number {
	const signals = [
		input.request.includes('?'),
		!input.objective,
		detectConflictSignals(input.request).length > 0,
		buildOpenQuestions(input).length > 0,
	];
	return signals.filter(Boolean).length / signals.length;
}

function buildOpenQuestions(input: ClarifyInput): string[] {
	const questions: string[] = [];
	if (!input.objective) {
		questions.push('What is the concrete objective and success condition?');
	}
	if ((input.constraints ?? []).length === 0) {
		questions.push(
			'Which constraints or compatibility surfaces are non-negotiable?'
		);
	}
	if (input.request.includes('maybe') || input.request.includes('probably')) {
		questions.push(
			'Which tentative assumptions should be confirmed before planning?'
		);
	}
	return questions;
}

function detectConflictSignals(request: string): string[] {
	return ['but', 'except', 'unless']
		.filter((token) => request.toLowerCase().includes(` ${token} `))
		.map((token) => `Detected branching language around "${token}".`);
}

function summarizeObjective(request: string): string {
	return request.trim().replace(/\s+/g, ' ').slice(0, 180);
}

function classifyScope(request: string): ExecutionScopeClass {
	const lowered = request.toLowerCase();
	if (lowered.includes('migration') || lowered.includes('security')) {
		return 'high-risk';
	}
	if (lowered.includes('team') || lowered.includes('parallel')) {
		return 'large';
	}
	if (request.length > 180) {
		return 'medium';
	}
	return 'small';
}
