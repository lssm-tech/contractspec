/**
 * Factory for creating transport clients from integration transport configs.
 */

import type {
	IntegrationTransportConfig,
	IntegrationTransportType,
	RestTransportConfig,
} from '@contractspec/lib.contracts-integrations/integrations/transport';
import { findTransportConfig } from '@contractspec/lib.contracts-integrations/integrations/transport';

export interface TransportClient {
	readonly type: IntegrationTransportType;
	request<T>(
		method: string,
		path: string,
		options?: TransportRequestOptions
	): Promise<TransportResponse<T>>;
}

export interface TransportRequestOptions {
	body?: unknown;
	headers?: Record<string, string>;
	queryParams?: Record<string, string>;
	timeoutMs?: number;
	signal?: AbortSignal;
}

export interface TransportResponse<T> {
	data: T;
	status: number;
	headers: Record<string, string>;
	rateLimitRemaining?: number;
	rateLimitReset?: number;
}

export class RestTransportClient implements TransportClient {
	readonly type = 'rest' as const;

	constructor(
		private readonly config: RestTransportConfig,
		private readonly authHeaders: Record<string, string> = {},
		private readonly fetchFn: typeof globalThis.fetch = globalThis.fetch
	) {}

	async request<T>(
		method: string,
		path: string,
		options?: TransportRequestOptions
	): Promise<TransportResponse<T>> {
		const url = new URL(path, this.config.baseUrl ?? 'https://localhost');

		if (options?.queryParams) {
			for (const [key, value] of Object.entries(options.queryParams)) {
				url.searchParams.set(key, value);
			}
		}

		const headers: Record<string, string> = {
			...this.config.defaultHeaders,
			...this.authHeaders,
			...options?.headers,
		};

		if (options?.body && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		const response = await this.fetchFn(url.toString(), {
			method,
			headers,
			body: options?.body ? JSON.stringify(options.body) : undefined,
			signal: options?.signal,
		});

		const responseHeaders: Record<string, string> = {};
		response.headers.forEach((value, key) => {
			responseHeaders[key] = value;
		});

		const data = (await response.json().catch(() => null)) as T;

		let rateLimitRemaining: number | undefined;
		let rateLimitReset: number | undefined;

		if (this.config.rateLimitHeaders) {
			const remaining = responseHeaders[this.config.rateLimitHeaders.remaining];
			const reset = responseHeaders[this.config.rateLimitHeaders.reset];
			if (remaining) rateLimitRemaining = Number(remaining);
			if (reset) rateLimitReset = Number(reset);
		}

		return {
			data,
			status: response.status,
			headers: responseHeaders,
			rateLimitRemaining,
			rateLimitReset,
		};
	}
}

export function createTransportClient(
	transports: IntegrationTransportConfig[],
	targetType: IntegrationTransportType,
	authHeaders: Record<string, string> = {},
	fetchFn?: typeof globalThis.fetch
): TransportClient | undefined {
	const config = findTransportConfig(transports, targetType);
	if (!config) return undefined;

	switch (config.type) {
		case 'rest':
			return new RestTransportClient(config, authHeaders, fetchFn);
		case 'mcp':
		case 'webhook':
		case 'sdk':
			return undefined;
		default:
			return undefined;
	}
}
