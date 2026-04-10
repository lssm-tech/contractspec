import type { BuilderWorkspace } from '@contractspec/lib.builder-spec';
import type { ExternalExecutionContextBundle } from '@contractspec/lib.provider-spec';
import { createDeterministicHash, readStringArray } from './shared';

export function createBuilderExecutionContextBundle(input: {
	id: string;
	workspace: BuilderWorkspace;
	blueprintId: string;
	blueprintBrief: string;
	blueprintPolicies: string[];
	payload?: Record<string, unknown>;
	createdAt: string;
}) {
	const payload = input.payload ?? {};
	const sourceRefs =
		readStringArray(payload.sourceRefs).length > 0
			? readStringArray(payload.sourceRefs)
			: readStringArray(payload.sourceIds);
	const bundle = {
		id: input.id,
		workspaceId: input.workspace.id,
		taskType:
			(payload.taskType as ExternalExecutionContextBundle['taskType']) ??
			'clarify',
		problemStatement: String(payload.problemStatement ?? input.blueprintBrief),
		blueprintRef: input.blueprintId,
		sourceRefs,
		policyRefs: input.blueprintPolicies.map((policy) => `policy:${policy}`),
		allowedWriteScopes: readStringArray(payload.allowedWriteScopes),
		runtimeTargetRef:
			typeof payload.runtimeTargetRef === 'string'
				? payload.runtimeTargetRef
				: typeof payload.runtimeTargetId === 'string'
					? payload.runtimeTargetId
					: undefined,
		acceptanceCriteria:
			readStringArray(payload.acceptanceCriteria).length > 0
				? readStringArray(payload.acceptanceCriteria)
				: ['Return structured output with explicit evidence references.'],
		requiredOutputFormat:
			typeof payload.requiredOutputFormat === 'string'
				? payload.requiredOutputFormat
				: 'json',
		requiredReceiptFields:
			readStringArray(payload.requiredReceiptFields).length > 0
				? readStringArray(payload.requiredReceiptFields)
				: [
						'providerId',
						'modelId',
						'taskType',
						'runtimeMode',
						'contextHash',
						'outputArtifactHashes',
						'startedAt',
						'completedAt',
						'verificationRefs',
					],
		hash: '',
		createdAt: input.createdAt,
	} satisfies ExternalExecutionContextBundle;
	return {
		...bundle,
		hash: createDeterministicHash(JSON.stringify(bundle)),
	} satisfies ExternalExecutionContextBundle;
}
