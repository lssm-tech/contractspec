import type {
	BuilderApprovalTicket,
	BuilderPlan,
} from '@contractspec/lib.builder-spec';
import { compileBuilderPlan } from '../planning';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import { createApprovalTicketReviewCard } from './review-card-operations';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function compilePlanOperation(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
	if (!workspace || !blueprint) return null;
	const [
		routingPolicy,
		providers,
		runtimeTargets,
		patchProposals,
		existing,
		sources,
	] = await Promise.all([
		deps.store.getRoutingPolicy(workspace.id),
		deps.store.listExternalProviders(workspace.id),
		deps.store.listRuntimeTargets(workspace.id),
		deps.store.listPatchProposals(workspace.id),
		deps.store.getPlan(workspace.id),
		deps.store.listSources(workspace.id),
	]);
	return deps.store.savePlan(
		compileBuilderPlan({
			workspace,
			blueprint,
			routingPolicy,
			providers,
			runtimeTargets,
			sourcePolicyClassifications: sources.map(
				(source) => source.policyClassification
			),
			patchProposalCount: patchProposals.length,
			existing,
		})
	);
}

export async function updatePlan(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const plan = await deps.store.getPlan(String(input.workspaceId));
	if (!plan) return null;
	const statusMap: Record<string, BuilderPlan['status']> = {
		'builder.plan.approve': 'approved',
		'builder.plan.execute': 'completed',
		'builder.plan.pause': 'paused',
		'builder.plan.resume': 'running',
		'builder.plan.cancel': 'cancelled',
	};
	return deps.store.savePlan({
		...plan,
		status: statusMap[commandKey] ?? plan.status,
		updatedAt: isoNow(deps.now),
	});
}

export async function updateApproval(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	if (commandKey === 'builder.approval.request') {
		const ticket = await deps.store.saveApprovalTicket({
			id: createBuilderId('approval'),
			workspaceId: String(input.workspaceId),
			conversationId: input.conversationId,
			reason: String(input.payload?.reason ?? 'Builder approval required.'),
			riskLevel:
				(input.payload?.riskLevel as BuilderApprovalTicket['riskLevel']) ??
				'medium',
			requestedVia:
				(input.payload
					?.requestedVia as BuilderApprovalTicket['requestedVia']) ?? 'web_ui',
			requiredStrength:
				(input.payload
					?.requiredStrength as BuilderApprovalTicket['requiredStrength']) ??
				'studio_signed',
			status: 'open',
			expiresAt: input.payload?.expiresAt as string | undefined,
			requiresTwoStepConfirmation:
				Boolean(input.payload?.requiresTwoStepConfirmation) || undefined,
		});
		await createApprovalTicketReviewCard(deps, ticket);
		return ticket;
	}
	const ticket = await deps.store.getApprovalTicket(String(input.entityId));
	if (!ticket) return null;
	return deps.store.saveApprovalTicket({
		...ticket,
		status:
			commandKey === 'builder.approval.capture'
				? ((input.payload?.status as BuilderApprovalTicket['status']) ??
					'approved')
				: 'expired',
		approvedBy: input.payload?.approvedBy as string | undefined,
		approvedAt:
			commandKey === 'builder.approval.capture'
				? isoNow(deps.now)
				: ticket.approvedAt,
		resolutionChannelType: input.payload
			?.resolutionChannelType as BuilderApprovalTicket['resolutionChannelType'],
		decisionReceiptId: input.payload?.decisionReceiptId as string | undefined,
	});
}
