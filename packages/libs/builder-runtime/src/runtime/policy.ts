import type {
	ApprovalStrength,
	BuilderChannelMessage,
	BuilderParticipantBinding,
} from '@contractspec/lib.builder-spec';
import { inferDirectiveRiskLevel } from '../ingestion/directives';

export interface BuilderStructuredOperation {
	fieldPath: string;
	mode?: 'replace' | 'append' | 'remove';
	value?: unknown;
	approvalTicketId?: string;
	confirmationStep?: number;
}

function approvalRank(strength: ApprovalStrength): number {
	switch (strength) {
		case 'admin_signed':
			return 4;
		case 'studio_signed':
			return 3;
		case 'bound_channel_ack':
			return 2;
		case 'weak_channel_ack':
			return 1;
		default:
			return 0;
	}
}

export function inferBuilderRiskFromText(
	text: string,
	fieldPath = 'brief'
): 'low' | 'medium' | 'high' {
	return inferDirectiveRiskLevel({
		text,
		targetArea:
			fieldPath === 'policies'
				? 'policy'
				: fieldPath === 'integrations'
					? 'integration'
					: fieldPath === 'surfaces'
						? 'surface'
						: fieldPath === 'workflows'
							? 'workflow'
							: fieldPath === 'export'
								? 'export'
								: 'brief',
		directiveType: 'requirement',
	});
}

export function canApplyBuilderChannelOperation(input: {
	riskLevel: 'low' | 'medium' | 'high';
	binding?: BuilderParticipantBinding | null;
	message: Pick<BuilderChannelMessage, 'channelType' | 'messageKind'>;
	confirmationStep?: number;
}): boolean {
	if (!input.binding || input.binding.revokedAt) {
		return false;
	}
	if (input.riskLevel === 'low') {
		return true;
	}
	if (input.riskLevel === 'medium') {
		return (
			approvalRank(input.binding.approvalStrength) >=
				approvalRank('bound_channel_ack') &&
			(input.message.messageKind === 'button' ||
				input.message.messageKind === 'list_selection')
		);
	}
	return (
		approvalRank(input.binding.approvalStrength) >=
			approvalRank('admin_signed') &&
		(input.binding.workspaceRole === 'owner' ||
			input.binding.workspaceRole === 'admin') &&
		(input.message.messageKind === 'button' ||
			input.message.messageKind === 'list_selection') &&
		(input.confirmationStep ?? 0) >= 2
	);
}

export function extractStructuredOperation(
	value: unknown
): BuilderStructuredOperation | null {
	if (!value || typeof value !== 'object') return null;
	const record = value as Record<string, unknown>;
	if (typeof record.fieldPath !== 'string' || record.fieldPath.length === 0) {
		return null;
	}
	return {
		fieldPath: record.fieldPath,
		mode:
			record.mode === 'append' || record.mode === 'remove'
				? record.mode
				: 'replace',
		value: record.value,
		approvalTicketId:
			typeof record.approvalTicketId === 'string'
				? record.approvalTicketId
				: undefined,
		confirmationStep:
			typeof record.confirmationStep === 'number'
				? record.confirmationStep
				: undefined,
	};
}
