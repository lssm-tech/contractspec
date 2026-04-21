import {
	type ContractResult,
	normalizeContractError,
} from '@contractspec/lib.contracts-spec/results';

export interface ContractResultResponseOptions {
	envelope?: boolean;
	prettyJson?: number | false;
	headers?: HeadersInit;
}

export interface NextResponseFactory {
	json(
		body: unknown,
		init?: { status?: number; headers?: HeadersInit }
	): Response;
}

export function contractResultToResponse(
	result: ContractResult<unknown, string, string>,
	options: ContractResultResponseOptions = {}
): Response {
	if (!result.ok) {
		return jsonResponse(result.problem, {
			status: result.status,
			prettyJson: options.prettyJson,
			headers: {
				'content-type': 'application/problem+json; charset=utf-8',
				...(options.headers as Record<string, string> | undefined),
			},
		});
	}

	const headers = {
		...(options.headers as Record<string, string> | undefined),
		...(result.headers ?? {}),
	};
	if (result.status === 204) {
		return new Response(null, { status: 204, headers });
	}

	return jsonResponse(options.envelope ? result : result.data, {
		status: result.status,
		prettyJson: options.prettyJson,
		headers,
	});
}

export function contractErrorToResponse(
	error: unknown,
	options: ContractResultResponseOptions = {}
): Response {
	return contractResultToResponse(normalizeContractError(error), options);
}

export function contractResultToNextResponse(
	result: ContractResult<unknown, string, string>,
	nextResponse: NextResponseFactory,
	options: ContractResultResponseOptions = {}
): Response {
	const headers = options.headers;
	if (!result.ok) {
		return nextResponse.json(result.problem, {
			status: result.status,
			headers: {
				'content-type': 'application/problem+json; charset=utf-8',
				...(headers as Record<string, string> | undefined),
			},
		});
	}
	return nextResponse.json(options.envelope ? result : result.data, {
		status: result.status,
		headers: {
			...(headers as Record<string, string> | undefined),
			...(result.headers ?? {}),
		},
	});
}

function jsonResponse(
	body: unknown,
	options: {
		status: number;
		prettyJson?: number | false;
		headers?: HeadersInit;
	}
): Response {
	const text = options.prettyJson
		? JSON.stringify(body, null, options.prettyJson)
		: JSON.stringify(body);
	return new Response(text, {
		status: options.status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...(options.headers as Record<string, string> | undefined),
		},
	});
}
