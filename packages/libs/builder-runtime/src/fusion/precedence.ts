import type {
	BuilderDirectiveCandidate,
	BuilderSourceApprovalState,
	BuilderSourceType,
	BuilderTrustProfile,
} from '@contractspec/lib.builder-spec';

const SOURCE_TYPE_PRECEDENCE: Record<BuilderSourceType, number> = {
	web_chat_message: 50,
	audio_upload: 35,
	transcript_segment: 20,
	file: 30,
	zip_entry: 28,
	studio_snapshot: 90,
	telegram_message: 40,
	telegram_callback: 45,
	whatsapp_message: 38,
	whatsapp_interaction: 44,
	provider_output: 22,
	preview_evidence: 18,
};

const APPROVAL_PRECEDENCE: Record<BuilderSourceApprovalState, number> = {
	draft: 0,
	approved: 15,
	rejected: -20,
	superseded: -10,
};

export function scoreBuilderEvidence(input: {
	sourceType: BuilderSourceType;
	approvalState: BuilderSourceApprovalState;
	lockedField?: boolean;
	directive?: Pick<BuilderDirectiveCandidate, 'confidence' | 'status'>;
	trustProfile?: BuilderTrustProfile;
	sourceConfidence?: number;
}) {
	return (
		(SOURCE_TYPE_PRECEDENCE[input.sourceType] ?? 0) +
		(APPROVAL_PRECEDENCE[input.approvalState] ?? 0) +
		(input.lockedField ? 100 : 0) +
		(input.directive ? input.directive.confidence * 10 : 0) +
		(input.directive?.status === 'accepted' ? 10 : 0) +
		((input.sourceConfidence ?? 0) * 10 + scoreTrustProfile(input.trustProfile))
	);
}

function scoreTrustProfile(trustProfile?: BuilderTrustProfile) {
	if (!trustProfile) return 0;
	const identity =
		trustProfile.identityAssurance === 'high'
			? 8
			: trustProfile.identityAssurance === 'medium'
				? 4
				: 0;
	const binding =
		trustProfile.channelBindingStrength === 'high'
			? 6
			: trustProfile.channelBindingStrength === 'medium'
				? 3
				: 0;
	const authenticity =
		trustProfile.messageAuthenticity === 'high'
			? 6
			: trustProfile.messageAuthenticity === 'medium'
				? 3
				: 0;
	const transcriptPenalty = trustProfile.transcriptConfidence
		? trustProfile.transcriptConfidence * 5
		: 0;
	return identity + binding + authenticity + transcriptPenalty;
}
