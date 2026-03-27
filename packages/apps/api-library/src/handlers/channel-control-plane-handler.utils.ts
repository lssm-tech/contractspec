import type { ChannelInboundEvent } from '@contractspec/integration.runtime/channel';
import { createHmac, randomUUID } from 'crypto';

import { resolveInternalControlPlaneActor } from './channel-internal-auth';

export interface ActorAuthorizationResult {
	error?: 'forbidden' | 'unauthorized';
	actor?: Exclude<ReturnType<typeof resolveInternalControlPlaneActor>, null>;
}

export function authorizeActor(
	request: Request,
	set: { status?: number | string },
	routeCapabilityGrants: string[]
): ActorAuthorizationResult {
	const actor = resolveInternalControlPlaneActor(request);
	if (!actor) {
		set.status = 401;
		return { error: 'unauthorized' };
	}
	if (
		!routeCapabilityGrants.some((grant) =>
			actor.capabilityGrants.includes(grant)
		)
	) {
		set.status = 403;
		return { error: 'forbidden' };
	}
	return { actor };
}

export function deny(
	error: 'forbidden' | 'unauthorized'
): Record<string, unknown> {
	return { ok: false, error };
}

export function toControlPlaneErrorResponse(
	error: unknown,
	set: { status?: number | string }
): Record<string, unknown> {
	const message = error instanceof Error ? error.message : String(error);
	if (message.includes('not installed')) {
		set.status = 409;
		return { ok: false, error: 'conflict', message };
	}
	if (
		message.includes('was not found') ||
		message.includes('does not exist') ||
		message.includes('no longer exists')
	) {
		set.status = 404;
		return { ok: false, error: 'not_found', message };
	}
	if (
		message.includes('not pending approval') ||
		message.includes('no longer pending approval')
	) {
		set.status = 409;
		return { ok: false, error: 'conflict', message };
	}
	if (message.includes('Missing capability grant')) {
		set.status = 403;
		return { ok: false, error: 'forbidden', message };
	}
	set.status = 500;
	return { ok: false, error: 'internal_error', message };
}

export async function safeParseJson(
	request: Request
): Promise<Record<string, unknown>> {
	try {
		const body = await request.json();
		return isRecord(body) ? body : {};
	} catch {
		return {};
	}
}

export function toPolicyExplainEvent(
	body: Record<string, unknown>
): ChannelInboundEvent {
	const thread = isRecord(body.thread) ? body.thread : {};
	const messageText = readString(body.messageText);
	return {
		workspaceId: readString(body.workspaceId) ?? 'workspace-control-plane',
		providerKey: readString(body.providerKey) ?? 'messaging.slack',
		externalEventId:
			readString(body.externalEventId) ?? `policy-${randomUUID()}`,
		eventType: readString(body.eventType) ?? 'controlPlane.policy.explain',
		occurredAt: readDate(body.occurredAt) ?? new Date(),
		signatureValid: true,
		traceId: readString(body.traceId),
		thread: {
			externalThreadId: readString(thread.externalThreadId) ?? 'policy-explain',
			externalChannelId: readString(thread.externalChannelId),
			externalUserId: readString(thread.externalUserId),
		},
		message: messageText ? { text: messageText } : undefined,
		metadata: readStringRecord(body.metadata),
	};
}

export function readSkillRequest(body: Record<string, unknown>) {
	const manifest = body.manifest;
	if (!isRecord(manifest)) {
		throw new Error('manifest is required');
	}
	const manifestSkill = isRecord(manifest.skill) ? manifest.skill : {};
	const skillKey =
		readString(body.skillKey) ?? readString(manifestSkill.key) ?? undefined;
	const version =
		readString(body.version) ?? readString(manifestSkill.version) ?? undefined;
	const artifactDigest = readString(body.artifactDigest);
	if (!skillKey || !version || !artifactDigest) {
		throw new Error('skillKey, version, and artifactDigest are required');
	}
	return {
		skillKey,
		version,
		artifactDigest,
		manifest: manifest as never,
	};
}

export function readVerifiedOperatorIdentity(
	request: Request,
	body?: Record<string, unknown>
): { operatorId: string; sessionId?: string } | null {
	const secret = process.env.CONTROL_PLANE_OPERATOR_IDENTITY_SECRET;
	if (!secret) {
		return null;
	}
	const operatorId =
		readString(request.headers.get('x-control-plane-operator-id')) ??
		readString(body?.operatorId);
	const sessionId =
		readString(request.headers.get('x-control-plane-operator-session-id')) ??
		readString(body?.sessionId);
	const signature =
		readString(request.headers.get('x-control-plane-operator-signature')) ??
		readString(body?.operatorSignature);
	const timestamp =
		readString(request.headers.get('x-control-plane-operator-timestamp')) ??
		readString(body?.operatorTimestamp);
	if (!operatorId || !signature || !timestamp) {
		return null;
	}
	const issuedAt = Number.parseInt(timestamp, 10);
	const maxAgeMs = Number.parseInt(
		process.env.CONTROL_PLANE_OPERATOR_IDENTITY_MAX_AGE_MS ?? '300000',
		10
	);
	if (
		!Number.isFinite(issuedAt) ||
		Math.abs(Date.now() - issuedAt) > Math.max(1000, maxAgeMs)
	) {
		return null;
	}
	const expectedSignature = createHmac('sha256', secret)
		.update(`${operatorId}:${sessionId ?? ''}:${timestamp}`)
		.digest('hex');
	if (signature !== expectedSignature) {
		return null;
	}
	return { operatorId, sessionId };
}

export function readString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function readPositiveInt(value: unknown): number | undefined {
	const parsed = Number.parseInt(String(value ?? ''), 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function readBoolean(value: unknown): boolean | undefined {
	if (typeof value === 'boolean') return value;
	if (value === 'true') return true;
	if (value === 'false') return false;
	return undefined;
}

export function readDate(value: unknown): Date | undefined {
	if (typeof value !== 'string' || value.length === 0) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function readStringRecord(value: unknown): Record<string, string> | undefined {
	if (!isRecord(value)) return undefined;
	const entries = Object.entries(value).filter(
		(entry): entry is [string, string] => typeof entry[1] === 'string'
	);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
