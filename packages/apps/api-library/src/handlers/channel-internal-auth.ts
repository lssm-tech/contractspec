import type { ChannelExecutionActor } from '@contractspec/integration.runtime/channel';

const CONTROL_PLANE_TOKEN_ENV_KEYS = ['CONTROL_PLANE_API_TOKEN'] as const;
const DISPATCH_TOKEN_ENV_KEYS = [
	'CHANNEL_DISPATCH_TOKEN',
	'CRON_SECRET',
] as const;

export interface InternalControlPlaneActor extends ChannelExecutionActor {}

export function isInternalControlPlaneAuthorized(request: Request): boolean {
	const configuredTokens = readConfiguredTokens(CONTROL_PLANE_TOKEN_ENV_KEYS);
	return (
		configuredTokens.length > 0 &&
		matchesConfiguredToken(request, configuredTokens)
	);
}

export function isDispatchRequestAuthorized(request: Request): boolean {
	const configuredTokens = readConfiguredTokens(DISPATCH_TOKEN_ENV_KEYS);
	return (
		configuredTokens.length > 0 &&
		matchesConfiguredToken(request, configuredTokens)
	);
}

export function resolveInternalControlPlaneActor(
	request: Request
): InternalControlPlaneActor | null {
	if (!isInternalControlPlaneAuthorized(request)) {
		return null;
	}
	return {
		type: parseActorType(process.env.CONTROL_PLANE_API_ACTOR_TYPE ?? 'service'),
		id:
			process.env.CONTROL_PLANE_API_ACTOR_ID ?? 'app.api-library.control-plane',
		tenantId: process.env.CONTROL_PLANE_API_TENANT_ID ?? undefined,
		sessionId: process.env.CONTROL_PLANE_API_SESSION_ID ?? undefined,
		capabilitySource:
			process.env.CONTROL_PLANE_API_CAPABILITY_SOURCE ??
			'app.api-library.control-plane',
		capabilityGrants: parseCapabilityGrants(
			process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS
		),
	};
}

function readConfiguredTokens(keys: readonly string[]): string[] {
	return keys
		.map((key) => process.env[key])
		.filter((token): token is string => Boolean(token && token.length > 0));
}

function matchesConfiguredToken(
	request: Request,
	configuredTokens: string[]
): boolean {
	const headerToken = request.headers.get('x-channel-dispatch-token');
	const bearerToken = parseBearerToken(request.headers.get('authorization'));
	return configuredTokens.some(
		(token) => token === headerToken || token === bearerToken
	);
}

function parseCapabilityGrants(value: string | undefined): string[] {
	return (
		value
			?.split(',')
			.map((grant) => grant.trim())
			.filter(Boolean) ?? []
	);
}

function parseActorType(value: string | null): ChannelExecutionActor['type'] {
	return value === 'human' ||
		value === 'service' ||
		value === 'agent' ||
		value === 'tool'
		? value
		: 'service';
}

function parseBearerToken(value: string | null): string | null {
	if (!value) return null;
	const match = value.match(/^Bearer\s+(.+)$/i);
	return match?.[1] ?? null;
}
