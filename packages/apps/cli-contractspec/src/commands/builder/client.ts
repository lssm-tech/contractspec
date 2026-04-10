export interface BuilderApiOperationInput {
	workspaceId?: string;
	entityId?: string;
	conversationId?: string;
	payload?: Record<string, unknown>;
}

function resolveBuilderApiBaseUrl() {
	const apiBaseUrl = process.env.CONTRACTSPEC_API_BASE_URL;
	if (!apiBaseUrl) {
		throw new Error(
			'CONTRACTSPEC_API_BASE_URL is required for builder CLI commands.'
		);
	}
	return apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
}

function resolveBuilderApiToken() {
	const token = process.env.CONTROL_PLANE_API_TOKEN;
	if (!token) {
		throw new Error(
			'CONTROL_PLANE_API_TOKEN is required for builder CLI commands.'
		);
	}
	return token;
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
	const target = new URL(
		`internal/builder/commands/${encodeURIComponent(commandKey)}`,
		resolveBuilderApiBaseUrl()
	);
	const response = await fetch(target, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${resolveBuilderApiToken()}`,
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
	const target = new URL(
		`internal/builder/queries/${encodeURIComponent(queryKey)}`,
		resolveBuilderApiBaseUrl()
	);
	if (input.workspaceId)
		target.searchParams.set('workspaceId', input.workspaceId);
	if (input.entityId) target.searchParams.set('entityId', input.entityId);
	if (input.conversationId) {
		target.searchParams.set('conversationId', input.conversationId);
	}
	const response = await fetch(target, {
		headers: {
			authorization: `Bearer ${resolveBuilderApiToken()}`,
		},
	});
	return parseBuilderApiResponse<T>(response);
}
