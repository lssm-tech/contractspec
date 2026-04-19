import { loadConfig } from '../../utils/config';

export interface BuilderApiOperationInput {
	workspaceId?: string;
	entityId?: string;
	conversationId?: string;
	payload?: Record<string, unknown>;
}

const DEFAULT_BUILDER_API_BASE_URL = 'https://api.contractspec.io';
const DEFAULT_BUILDER_TOKEN_ENV_VAR = 'CONTROL_PLANE_API_TOKEN';

async function resolveBuilderClientConfig() {
	const config = await loadConfig();
	const configuredApiBaseUrl = config.builder?.api?.baseUrl?.trim();
	const configuredTokenEnvVar =
		config.builder?.api?.controlPlaneTokenEnvVar?.trim();
	const apiBaseUrl =
		process.env.CONTRACTSPEC_API_BASE_URL?.trim() ||
		configuredApiBaseUrl ||
		DEFAULT_BUILDER_API_BASE_URL;
	const tokenEnvVar = configuredTokenEnvVar || DEFAULT_BUILDER_TOKEN_ENV_VAR;
	const token = process.env[tokenEnvVar];
	if (!token) {
		throw new Error(`Set ${tokenEnvVar} to use Builder CLI commands.`);
	}
	return {
		apiBaseUrl: apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`,
		token,
	};
}

async function parseBuilderApiResponse<T>(response: Response) {
	const payload = (await response.json().catch(() => ({}))) as {
		ok?: boolean;
		result?: T;
		error?: string;
		message?: string;
	};
	if (!response.ok || payload.ok === false) {
		throw new Error(
			payload.message ??
				payload.error ??
				`Builder API request failed with ${response.status}.`
		);
	}
	return payload.result as T;
}

export async function executeBuilderApiCommand<T>(
	commandKey: string,
	input: BuilderApiOperationInput
) {
	const { apiBaseUrl, token } = await resolveBuilderClientConfig();
	const target = new URL(
		`internal/builder/commands/${encodeURIComponent(commandKey)}`,
		apiBaseUrl
	);
	const response = await fetch(target, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${token}`,
			'content-type': 'application/json',
		},
		body: JSON.stringify(input),
	});
	return parseBuilderApiResponse<T>(response);
}

export async function executeBuilderApiQuery<T>(
	queryKey: string,
	input: BuilderApiOperationInput
) {
	const { apiBaseUrl, token } = await resolveBuilderClientConfig();
	const target = new URL(
		`internal/builder/queries/${encodeURIComponent(queryKey)}`,
		apiBaseUrl
	);
	if (input.workspaceId)
		target.searchParams.set('workspaceId', input.workspaceId);
	if (input.entityId) target.searchParams.set('entityId', input.entityId);
	if (input.conversationId) {
		target.searchParams.set('conversationId', input.conversationId);
	}
	const response = await fetch(target, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});
	return parseBuilderApiResponse<T>(response);
}
