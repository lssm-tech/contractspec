import { randomUUID } from 'crypto';
import { connectVerdictToPolicy } from './assessment';
import type { ConnectCommandState } from './command-policy';
import { buildConnectContextPack } from './context';
import {
	AGENT_APPROVALS_REF,
	CONTROL_PLANE_EXECUTION_APPROVE_REF,
	CONTROL_PLANE_POLICY_EXPLAIN_REF,
	CONTROL_PLANE_TRACE_GET_REF,
} from './contract-refs';
import { compileConnectPlanPacket } from './plan';
import { resolveWorkspace } from './shared';
import type {
	ConnectPatchVerdict,
	ConnectReviewPacket,
	ConnectRuntimeLink,
	ConnectVerdict,
	ConnectVerifyInput,
} from './types';

export function checkForPathBoundary(
	immutable?: string,
	protectedPath?: string,
	generatedPath?: string
) {
	const detail = immutable
		? `Immutable path: ${immutable}`
		: protectedPath
			? `Protected path: ${protectedPath}`
			: generatedPath
				? `Generated path: ${generatedPath}`
				: 'No protected path boundaries triggered.';
	return {
		id: 'path-boundary',
		status: immutable
			? 'fail'
			: protectedPath || generatedPath
				? 'warn'
				: 'pass',
		detail,
	} as const;
}

export function checkForCommandPolicy(
	commandState: ConnectCommandState,
	commandMatch?: string
) {
	const status =
		commandState === 'deny' || commandState === 'destructive'
			? 'fail'
			: commandState === 'review' || commandState === 'unknown'
				? 'warn'
				: 'pass';
	const detail = commandMatch
		? `Command policy: ${commandState} (${commandMatch})`
		: `Command policy: ${commandState}`;
	return { id: 'command-policy', status, detail } as const;
}

export function checkForImpact(
	breakingChange: boolean,
	contractDrift: boolean,
	unknownImpact: boolean
) {
	const status = breakingChange
		? 'fail'
		: contractDrift || unknownImpact
			? 'warn'
			: 'pass';
	const detail = breakingChange
		? 'Breaking change detected.'
		: contractDrift
			? 'Generated-path drift detected.'
			: unknownImpact
				? 'Impact could not be resolved.'
				: 'Impact resolved.';
	return { id: 'impact-analysis', status, detail } as const;
}

export function buildReviewPacket(
	workspace: ReturnType<typeof resolveWorkspace>,
	decisionId: string,
	contextPack: Awaited<ReturnType<typeof buildConnectContextPack>>,
	planPacket: Awaited<
		ReturnType<typeof compileConnectPlanPacket>
	>['planPacket'],
	touchedPaths: string[],
	input: {
		artifactRefs: {
			contextPack: string;
			planPacket: string;
			patchVerdict: string;
		};
		reason: string;
		runtimeLink?: ConnectRuntimeLink | null;
	}
): ConnectReviewPacket {
	const traceRef = input.runtimeLink?.decisionId
		? `controlPlane.trace.get?decisionId=${input.runtimeLink.decisionId}`
		: input.runtimeLink?.traceId
			? `controlPlane.trace.get?traceId=${input.runtimeLink.traceId}`
			: `controlPlane.trace.get?connectDecisionId=${decisionId}`;

	return {
		id: `review_${randomUUID()}`,
		sourceDecisionId: decisionId,
		objective: planPacket.objective,
		reason: input.reason,
		summary: {
			paths: touchedPaths,
			impactedContracts: contextPack.impactedContracts,
			affectedSurfaces: contextPack.affectedSurfaces,
			requiredChecks: planPacket.requiredChecks,
		},
		evidence: [
			{ type: 'context-pack', ref: input.artifactRefs.contextPack },
			{ type: 'plan-packet', ref: input.artifactRefs.planPacket },
			{ type: 'patch-verdict', ref: input.artifactRefs.patchVerdict },
			{
				type: 'control-plane-trace',
				ref: traceRef,
			},
		],
		requiredApprovals: [
			{
				capability: CONTROL_PLANE_EXECUTION_APPROVE_REF.key,
				reason: input.reason,
			},
		],
		controlPlane: {
			traceQuery: CONTROL_PLANE_TRACE_GET_REF,
			policyExplain: CONTROL_PLANE_POLICY_EXPLAIN_REF,
			approvalStatus: input.runtimeLink?.approvalStatus,
			decisionId: input.runtimeLink?.decisionId,
			traceId: input.runtimeLink?.traceId ?? contextPack.actor.traceId,
		},
		studio: workspace.config.connect?.studio?.enabled
			? {
					enabled: true,
					mode: workspace.config.connect.studio.mode,
					queue: workspace.config.connect.studio.queue,
				}
			: { enabled: false, mode: 'off' },
	};
}

export function buildPatchVerdict(
	decisionId: string,
	input: ConnectVerifyInput,
	contextPack: Awaited<ReturnType<typeof buildConnectContextPack>>,
	planPacket: Awaited<
		ReturnType<typeof compileConnectPlanPacket>
	>['planPacket'],
	impactedFiles: ConnectPatchVerdict['impacted'],
	checks: ConnectPatchVerdict['checks'],
	verdict: ConnectVerdict,
	reviewPacketRef?: string,
	runtimeLink?: ConnectRuntimeLink | null
): ConnectPatchVerdict {
	const policy = connectVerdictToPolicy(verdict);
	return {
		decisionId,
		summary: planPacket.objective,
		action:
			input.tool === 'acp.fs.access'
				? {
						actionType:
							input.operation === 'write' ? 'write_file' : 'edit_file',
						tool: input.tool,
						target: input.path,
					}
				: { actionType: 'run_command', tool: input.tool, cwd: input.cwd },
		impacted: impactedFiles,
		checks,
		verdict,
		controlPlane: {
			verdict: policy.controlPlaneVerdict,
			requiresApproval: policy.requiresApproval,
			approvalStatus: runtimeLink?.approvalStatus,
			decisionId: runtimeLink?.decisionId,
			traceId: runtimeLink?.traceId ?? contextPack.actor.traceId,
		},
		approvalOperationRefs:
			verdict === 'require_review'
				? [
						`${CONTROL_PLANE_EXECUTION_APPROVE_REF.key}@${CONTROL_PLANE_EXECUTION_APPROVE_REF.version}`,
						`${AGENT_APPROVALS_REF.key}@${AGENT_APPROVALS_REF.version}`,
					]
				: undefined,
		remediation: remediationFor(verdict),
		reviewPacketRef,
		replay: {
			traceQuery: CONTROL_PLANE_TRACE_GET_REF,
			policyExplain: CONTROL_PLANE_POLICY_EXPLAIN_REF,
		},
	};
}

function remediationFor(verdict: ConnectVerdict) {
	return verdict === 'rewrite'
		? ['Regenerate derived files instead of editing them directly.']
		: verdict === 'require_review'
			? ['Request human review for the flagged change set.']
			: verdict === 'deny'
				? ['Remove immutable or denied mutations before retrying.']
				: undefined;
}
