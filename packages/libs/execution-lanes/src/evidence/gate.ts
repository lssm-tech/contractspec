import type {
	ApprovalRecord,
	EvidenceBundleRef,
	EvidenceGateResult,
	VerificationPolicy,
} from '../types';
import { normalizeExecutionLaneEvidenceClass } from '../types';

export function createEvidenceGate() {
	return {
		evaluate(input: {
			policy: VerificationPolicy;
			evidence: EvidenceBundleRef[];
			approvals: ApprovalRecord[];
			blockingRisks?: string[];
			now?: () => Date;
		}): EvidenceGateResult {
			const now = input.now?.() ?? new Date();
			const evidenceClasses = new Set(
				input.evidence.flatMap((bundle) =>
					bundle.classes.map((entry) =>
						normalizeExecutionLaneEvidenceClass(String(entry))
					)
				)
			);
			const missingEvidence = input.policy.requiredEvidence
				.map((item) => normalizeExecutionLaneEvidenceClass(String(item)))
				.filter((item) => !evidenceClasses.has(item))
				.map((item) => String(item));
			const missingApprovals = input.policy.minimumApprovals
				.filter((requirement) => {
					return !input.approvals.some(
						(approval) =>
							approval.role === requirement.role &&
							approval.verdict === requirement.verdict &&
							approval.state === 'approved'
					);
				})
				.map((requirement) => `${requirement.role}:${requirement.verdict}`);
			const staleEvidence =
				input.policy.maxEvidenceAgeMinutes === undefined
					? []
					: input.evidence
							.filter((bundle) => {
								if (
									bundle.freshUntil &&
									new Date(bundle.freshUntil).getTime() < now.getTime()
								) {
									return true;
								}
								const ageMs =
									now.getTime() - new Date(bundle.createdAt).getTime();
								return ageMs > input.policy.maxEvidenceAgeMinutes! * 60_000;
							})
							.map((bundle) => bundle.id);
			const blockingRisks = input.blockingRisks ?? [];
			const conditionallyPassed =
				input.policy.allowConditionalCompletion &&
				missingEvidence.length > 0 &&
				missingApprovals.length === 0 &&
				staleEvidence.length === 0 &&
				blockingRisks.length === 0;
			const passed =
				(input.policy.failOnMissingEvidence
					? missingEvidence.length === 0
					: true) &&
				missingApprovals.length === 0 &&
				staleEvidence.length === 0 &&
				blockingRisks.length === 0;

			return {
				passed,
				conditionallyPassed,
				missingEvidence,
				missingApprovals,
				staleEvidence,
				blockingRisks,
			};
		},
	};
}
