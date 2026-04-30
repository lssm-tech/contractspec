export interface KnowledgeApprovalRef {
	id: string;
	approvedBy?: string;
	approvedAt?: string | Date;
	expiresAt?: string | Date;
	evidenceRef?: string;
}

export interface KnowledgeAuditEvidence {
	evidenceRef: string;
	recordedAt?: string | Date;
	traceId?: string;
	actorId?: string;
}

export interface KnowledgeOutboundSendGate {
	status: 'approved' | 'blocked' | 'not_required';
	reason?: string;
	evidenceRef?: string;
}

export interface KnowledgeMutationGovernance {
	dryRun?: boolean;
	approvalRefs?: KnowledgeApprovalRef[];
	idempotencyKey?: string;
	auditEvidence?: KnowledgeAuditEvidence;
	outboundSendGate?: KnowledgeOutboundSendGate;
}

export interface KnowledgeMutationRequest {
	operation: string;
	sourceId?: string;
	requiresApproval?: boolean;
	outboundSend?: boolean;
	governance?: KnowledgeMutationGovernance;
}

export interface KnowledgeMutationPlan {
	allowed: boolean;
	dryRun: boolean;
	reasons: string[];
	requiredEvidence: string[];
}

export interface KnowledgeMutationAuditEnvelope {
	operation: string;
	sourceId?: string;
	status: 'dry_run' | 'executed' | 'blocked';
	allowed: boolean;
	dryRun: boolean;
	reasons: string[];
	requiredEvidence: string[];
	idempotencyKey?: string;
	auditEvidence?: KnowledgeAuditEvidence;
	approvalRefs?: KnowledgeApprovalRef[];
	outboundSendGate?: KnowledgeOutboundSendGate;
	decidedAt: string;
}

export interface KnowledgeMutationExecutionOptions {
	audit?: (envelope: KnowledgeMutationAuditEnvelope) => Promise<void> | void;
	now?: () => Date;
}

export interface KnowledgeMutationResult<T = unknown> {
	status: 'dry_run' | 'executed' | 'blocked';
	plan: KnowledgeMutationPlan;
	idempotencyKey?: string;
	auditEvidence?: KnowledgeAuditEvidence;
	auditEnvelope: KnowledgeMutationAuditEnvelope;
	result?: T;
}

export class KnowledgeMutationGovernanceError extends Error {
	constructor(public readonly plan: KnowledgeMutationPlan) {
		super(plan.reasons.join('; '));
		this.name = 'KnowledgeMutationGovernanceError';
	}
}

export function evaluateKnowledgeMutationGovernance(
	request: KnowledgeMutationRequest
): KnowledgeMutationPlan {
	const governance = request.governance;
	const requiredEvidence: string[] = [];
	const reasons: string[] = [];
	const dryRun = governance?.dryRun === true;

	if (dryRun) {
		return {
			allowed: true,
			dryRun,
			reasons,
			requiredEvidence,
		};
	}

	if (!governance?.idempotencyKey) {
		pushRequiredEvidence(requiredEvidence, 'idempotencyKey');
		reasons.push('Mutation requires an idempotency key.');
	}

	if (!governance?.auditEvidence?.evidenceRef) {
		pushRequiredEvidence(requiredEvidence, 'auditEvidence');
		reasons.push('Mutation requires audit evidence.');
	}

	if (
		request.requiresApproval === true &&
		(governance?.approvalRefs?.length ?? 0) === 0
	) {
		pushRequiredEvidence(requiredEvidence, 'approvalRefs');
		reasons.push('Mutation requires at least one approval reference.');
	}

	if (request.outboundSend === true) {
		if (governance?.outboundSendGate?.status !== 'approved') {
			pushRequiredEvidence(requiredEvidence, 'outboundSendGate');
			reasons.push('Outbound send requires an approved outbound-send gate.');
		}
		if ((governance?.approvalRefs?.length ?? 0) === 0) {
			pushRequiredEvidence(requiredEvidence, 'approvalRefs');
			reasons.push('Outbound send requires at least one approval reference.');
		}
	}

	return {
		allowed: reasons.length === 0,
		dryRun,
		reasons,
		requiredEvidence,
	};
}

export async function executeGovernedKnowledgeMutation<T>(
	request: KnowledgeMutationRequest,
	execute: () => Promise<T>,
	options: KnowledgeMutationExecutionOptions = {}
): Promise<KnowledgeMutationResult<T>> {
	const plan = evaluateKnowledgeMutationGovernance(request);
	const governance = request.governance;

	if (plan.dryRun) {
		const auditEnvelope = createAuditEnvelope(
			request,
			'dry_run',
			plan,
			options
		);
		await options.audit?.(auditEnvelope);
		return {
			status: 'dry_run',
			plan,
			idempotencyKey: governance?.idempotencyKey,
			auditEvidence: governance?.auditEvidence,
			auditEnvelope,
		};
	}

	if (!plan.allowed) {
		const auditEnvelope = createAuditEnvelope(
			request,
			'blocked',
			plan,
			options
		);
		await options.audit?.(auditEnvelope);
		return {
			status: 'blocked',
			plan,
			idempotencyKey: governance?.idempotencyKey,
			auditEvidence: governance?.auditEvidence,
			auditEnvelope,
		};
	}

	const result = await execute();
	const auditEnvelope = createAuditEnvelope(request, 'executed', plan, options);
	await options.audit?.(auditEnvelope);
	return {
		status: 'executed',
		plan,
		idempotencyKey: governance?.idempotencyKey,
		auditEvidence: governance?.auditEvidence,
		auditEnvelope,
		result,
	};
}

function pushRequiredEvidence(items: string[], item: string): void {
	if (!items.includes(item)) {
		items.push(item);
	}
}

function createAuditEnvelope(
	request: KnowledgeMutationRequest,
	status: KnowledgeMutationAuditEnvelope['status'],
	plan: KnowledgeMutationPlan,
	options: KnowledgeMutationExecutionOptions
): KnowledgeMutationAuditEnvelope {
	return {
		operation: request.operation,
		sourceId: request.sourceId,
		status,
		allowed: plan.allowed,
		dryRun: plan.dryRun,
		reasons: plan.reasons,
		requiredEvidence: plan.requiredEvidence,
		idempotencyKey: request.governance?.idempotencyKey,
		auditEvidence: request.governance?.auditEvidence,
		approvalRefs: request.governance?.approvalRefs,
		outboundSendGate: request.governance?.outboundSendGate,
		decidedAt: (options.now?.() ?? new Date()).toISOString(),
	};
}
