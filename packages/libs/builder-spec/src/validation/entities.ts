import type {
	BuilderBlueprint,
	BuilderChannelMessage,
	BuilderDirectiveCandidate,
	BuilderParticipantBinding,
	BuilderReadinessReport,
	BuilderSourceRecord,
	BuilderTranscriptSegment,
	BuilderWorkspace,
	BuilderWorkspaceSnapshot,
} from '../types';
import { type BuilderValidationIssue, pushBuilderIssue } from './issues';

export function validateBuilderWorkspace(
	workspace: BuilderWorkspace
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (!workspace.id.trim()) {
		pushBuilderIssue(issues, 'id', 'Workspace id is required.');
	}
	if (!workspace.tenantId.trim()) {
		pushBuilderIssue(issues, 'tenantId', 'Tenant id is required.');
	}
	if (!workspace.name.trim()) {
		pushBuilderIssue(issues, 'name', 'Workspace name is required.');
	}
	if (!workspace.defaultLocale.trim()) {
		pushBuilderIssue(issues, 'defaultLocale', 'Default locale is required.');
	}
	if (workspace.ownerIds.length === 0) {
		pushBuilderIssue(issues, 'ownerIds', 'At least one owner is required.');
	}
	if (!workspace.defaultRuntimeMode) {
		pushBuilderIssue(
			issues,
			'defaultRuntimeMode',
			'Default runtime mode is required.'
		);
	}
	return issues;
}

export function validateBuilderTranscriptSegment(
	segment: BuilderTranscriptSegment
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (segment.endMs < segment.startMs) {
		pushBuilderIssue(
			issues,
			'endMs',
			'Transcript segment end must be after start.'
		);
	}
	if (segment.confidence < 0 || segment.confidence > 1) {
		pushBuilderIssue(
			issues,
			'confidence',
			'Transcript confidence must be between 0 and 1.'
		);
	}
	if (!segment.text.trim()) {
		pushBuilderIssue(issues, 'text', 'Transcript text is required.');
	}
	return issues;
}

export function validateBuilderParticipantBinding(
	binding: BuilderParticipantBinding
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (!binding.participantId.trim()) {
		pushBuilderIssue(
			issues,
			'participantId',
			'Participant binding participantId is required.'
		);
	}
	if (!binding.externalIdentityRef.trim()) {
		pushBuilderIssue(
			issues,
			'externalIdentityRef',
			'Participant binding external identity is required.'
		);
	}
	if (binding.allowedActions.length === 0) {
		pushBuilderIssue(
			issues,
			'allowedActions',
			'Participant binding must allow at least one action.'
		);
	}
	return issues;
}

export function validateBuilderSourceRecord(
	source: BuilderSourceRecord
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (!source.title.trim()) {
		pushBuilderIssue(issues, 'title', 'Builder source title is required.');
	}
	if (!source.provenance.hash.trim()) {
		pushBuilderIssue(
			issues,
			'provenance.hash',
			'Builder source provenance hash is required.'
		);
	}
	if (source.provenance.confidence < 0 || source.provenance.confidence > 1) {
		pushBuilderIssue(
			issues,
			'provenance.confidence',
			'Builder source confidence must be between 0 and 1.'
		);
	}
	return issues;
}

export function validateBuilderChannelMessage(
	message: BuilderChannelMessage
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (!message.externalConversationId.trim()) {
		pushBuilderIssue(
			issues,
			'externalConversationId',
			'External conversation id is required.'
		);
	}
	if (!message.externalMessageId.trim()) {
		pushBuilderIssue(
			issues,
			'externalMessageId',
			'External message id is required.'
		);
	}
	if (
		message.trustProfile?.transcriptConfidence != null &&
		(message.trustProfile.transcriptConfidence < 0 ||
			message.trustProfile.transcriptConfidence > 1)
	) {
		pushBuilderIssue(
			issues,
			'trustProfile.transcriptConfidence',
			'Transcript confidence must be between 0 and 1.'
		);
	}
	return issues;
}

export function validateBuilderDirectiveCandidate(
	directive: BuilderDirectiveCandidate
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (directive.sourceIds.length === 0) {
		pushBuilderIssue(
			issues,
			'sourceIds',
			'Directive candidate must reference at least one source.'
		);
	}
	if (!directive.statement.trim()) {
		pushBuilderIssue(issues, 'statement', 'Directive statement is required.');
	}
	if (directive.confidence < 0 || directive.confidence > 1) {
		pushBuilderIssue(
			issues,
			'confidence',
			'Directive confidence must be between 0 and 1.'
		);
	}
	return issues;
}

export function validateBuilderBlueprint(
	blueprint: BuilderBlueprint
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (!blueprint.appBrief.trim()) {
		pushBuilderIssue(issues, 'appBrief', 'Blueprint app brief is required.');
	}
	if (blueprint.coverageReport.fields.length === 0) {
		pushBuilderIssue(
			issues,
			'coverageReport.fields',
			'Blueprint coverage must include at least one field.'
		);
	}
	if (blueprint.runtimeProfiles.length === 0) {
		pushBuilderIssue(
			issues,
			'runtimeProfiles',
			'Blueprint runtime profiles must include at least one profile.'
		);
	}
	return issues;
}

export function validateBuilderReadinessReport(
	report: BuilderReadinessReport
): BuilderValidationIssue[] {
	const issues: BuilderValidationIssue[] = [];
	if (report.score < 0 || report.score > 100) {
		pushBuilderIssue(issues, 'score', 'Readiness score must be 0-100.');
	}
	if (
		new Set(report.supportedRuntimeModes).size !==
		report.supportedRuntimeModes.length
	) {
		pushBuilderIssue(
			issues,
			'supportedRuntimeModes',
			'Readiness report supported runtime modes must be unique.'
		);
	}
	if (!report.recommendedNextAction.trim()) {
		pushBuilderIssue(
			issues,
			'recommendedNextAction',
			'Recommended next action is required.'
		);
	}
	if (!report.evidenceBundleRef) {
		pushBuilderIssue(
			issues,
			'evidenceBundleRef',
			'Readiness report evidence bundle reference is required.'
		);
	}
	return issues;
}

export function validateBuilderWorkspaceSnapshot(
	snapshot: BuilderWorkspaceSnapshot
): BuilderValidationIssue[] {
	const issues = validateBuilderWorkspace(snapshot.workspace);
	if (snapshot.stableMemory.lockedFieldPaths.some((path) => !path.trim())) {
		pushBuilderIssue(
			issues,
			'stableMemory.lockedFieldPaths',
			'Locked field paths must be non-empty.'
		);
	}
	return issues;
}
