import type {
	ChannelActorType,
	ChannelApprovalStatus,
	ListDecisionsInput,
	ListPendingApprovalsInput,
} from '@contractspec/integration.runtime/channel';

export function toApprovalListInput(
	options: Record<string, unknown>
): ListPendingApprovalsInput {
	return {
		workspaceId: asString(options.workspaceId),
		providerKey: asString(options.providerKey),
		limit: asNumber(options.limit),
	};
}

export function toDecisionListInput(
	options: Record<string, unknown>
): ListDecisionsInput {
	return {
		workspaceId: asString(options.workspaceId),
		providerKey: asString(options.providerKey),
		traceId: asString(options.traceId),
		receiptId: asString(options.receiptId),
		externalEventId: asString(options.externalEventId),
		approvalStatus: asString(
			options.approvalStatus
		) as ListDecisionsInput['approvalStatus'],
		actorId: asString(options.actorId),
		sessionId: asString(options.sessionId),
		workflowId: asString(options.workflowId),
		createdAfter: asDate(options.createdAfter),
		createdBefore: asDate(options.createdBefore),
		limit: asNumber(options.limit),
	};
}

export function parseCapabilityGrants(
	value: string | undefined,
	defaults: string[]
): string[] {
	return [
		...new Set([
			...(value
				?.split(',')
				.map((item) => item.trim())
				.filter(Boolean) ?? []),
			...defaults,
		]),
	];
}

export function parseIntOption(value: string): number {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		throw new Error(`Invalid integer value: ${value}`);
	}
	return parsed;
}

export function parseActorType(value: string): ChannelActorType {
	if (
		value === 'human' ||
		value === 'service' ||
		value === 'agent' ||
		value === 'tool'
	) {
		return value;
	}
	throw new Error(`Invalid actor type: ${value}`);
}

export function parseApprovalStatus(
	value: string
): Extract<
	ChannelApprovalStatus,
	'not_required' | 'pending' | 'approved' | 'rejected' | 'expired'
> {
	if (
		value === 'not_required' ||
		value === 'pending' ||
		value === 'approved' ||
		value === 'rejected' ||
		value === 'expired'
	) {
		return value;
	}
	throw new Error(`Invalid approval status: ${value}`);
}

function asString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

function asDate(value: unknown): Date | undefined {
	if (typeof value !== 'string') {
		return undefined;
	}
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid ISO date value: ${value}`);
	}
	return parsed;
}
