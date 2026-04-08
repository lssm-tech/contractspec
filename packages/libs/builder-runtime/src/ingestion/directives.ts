import type {
	BuilderDirectiveCandidate,
	BuilderDirectiveType,
	BuilderTargetArea,
	BuilderTrustProfile,
} from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';

function normalizeSentence(sentence: string): string {
	return sentence.trim().replace(/\s+/g, ' ');
}

function inferDirectiveType(text: string): BuilderDirectiveType {
	const normalized = text.toLowerCase();
	if (normalized.includes('?')) return 'question';
	if (normalized.includes('approve') || normalized.includes('ship it')) {
		return 'approval';
	}
	if (
		normalized.includes('must') ||
		normalized.includes('should not') ||
		normalized.includes('cannot')
	) {
		return 'constraint';
	}
	if (
		normalized.includes('actually') ||
		normalized.includes('instead') ||
		normalized.includes('change')
	) {
		return 'correction';
	}
	if (normalized.includes('remove') || normalized.includes('undo')) {
		return 'retraction';
	}
	if (normalized.includes('note') || normalized.includes('fyi')) {
		return 'note';
	}
	return 'requirement';
}

function inferTargetArea(text: string): BuilderTargetArea {
	const normalized = text.toLowerCase();
	if (normalized.includes('policy') || normalized.includes('approval'))
		return 'policy';
	if (normalized.includes('integration') || normalized.includes('connector')) {
		return 'integration';
	}
	if (
		normalized.includes('screen') ||
		normalized.includes('page') ||
		normalized.includes('ui')
	) {
		return 'surface';
	}
	if (normalized.includes('workflow') || normalized.includes('step'))
		return 'workflow';
	if (normalized.includes('export') || normalized.includes('publish'))
		return 'export';
	return 'brief';
}

export function inferDirectiveRiskLevel(input: {
	text: string;
	targetArea: BuilderTargetArea;
	directiveType: BuilderDirectiveType;
}): 'low' | 'medium' | 'high' {
	const normalized = input.text.toLowerCase();
	if (
		/remove auth|connect prod|connect production|connect live|export|publish|weaken approval|disable auth/i.test(
			normalized
		) ||
		input.targetArea === 'export'
	) {
		return 'high';
	}
	if (
		input.targetArea === 'integration' ||
		input.targetArea === 'policy' ||
		input.directiveType === 'approval' ||
		/role|permission|workflow|connector|approval/i.test(normalized)
	) {
		return 'medium';
	}
	return 'low';
}

export function compileDirectiveCandidates(input: {
	workspaceId: string;
	sourceIds: string[];
	text: string;
	confidence: number;
	proposedByMessageId?: string;
	trustProfile?: BuilderTrustProfile;
}): BuilderDirectiveCandidate[] {
	return input.text
		.split(/[\n.!]+/g)
		.map(normalizeSentence)
		.filter((sentence) => sentence.length > 0)
		.map((sentence, index) => {
			const directiveType = inferDirectiveType(sentence);
			const targetArea = inferTargetArea(sentence);
			const riskLevel = inferDirectiveRiskLevel({
				text: sentence,
				targetArea,
				directiveType,
			});
			return {
				id: createBuilderId(`directive_${index}`),
				workspaceId: input.workspaceId,
				sourceIds: input.sourceIds,
				directiveType,
				statement: sentence,
				targetArea,
				confidence: input.confidence,
				requiresReview: input.confidence < 0.8 || riskLevel !== 'low',
				status: 'open',
				proposedByMessageId: input.proposedByMessageId,
				riskLevel,
				trustProfile: input.trustProfile,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
		});
}
