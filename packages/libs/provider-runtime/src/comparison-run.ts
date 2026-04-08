import type { ExecutionComparisonRun } from '@contractspec/lib.provider-spec';
import { isRecord, readStringArray } from './shared';

export function createBuilderComparisonRunRecord(input: {
	workspaceId: string;
	id: string;
	payload?: Record<string, unknown>;
	nowIso: string;
}) {
	const payload = input.payload ?? {};
	return {
		id: input.id,
		workspaceId: input.workspaceId,
		taskType:
			(payload.taskType as ExecutionComparisonRun['taskType']) ??
			'propose_patch',
		riskLevel:
			(payload.riskLevel as ExecutionComparisonRun['riskLevel']) ?? 'medium',
		mode: (payload.mode as ExecutionComparisonRun['mode']) ?? 'dual_provider',
		providerIds: readStringArray(payload.providerIds),
		receiptIds: readStringArray(payload.receiptIds),
		verdict: isRecord(payload.verdict)
			? {
					recommendedProviderId:
						typeof payload.verdict.recommendedProviderId === 'string'
							? payload.verdict.recommendedProviderId
							: undefined,
					summary: String(payload.verdict.summary ?? 'Comparison completed.'),
					evidenceRefs: readStringArray(payload.verdict.evidenceRefs),
					confidence:
						typeof payload.verdict.confidence === 'number'
							? payload.verdict.confidence
							: 0.75,
				}
			: undefined,
		status: (payload.status as ExecutionComparisonRun['status']) ?? 'completed',
		createdAt: input.nowIso,
		updatedAt: input.nowIso,
	} satisfies ExecutionComparisonRun;
}
