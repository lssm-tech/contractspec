import { afterEach, describe, expect, it } from 'bun:test';
import { GET, POST } from './route';

const TEST_ENV_KEYS = [
	'CONTRACTSPEC_API_BASE_URL',
	'NEXT_PUBLIC_CONTRACTSPEC_API_BASE_URL',
	'CONTROL_PLANE_API_TOKEN',
] as const;

const originalFetch = globalThis.fetch;

function requireCapturedRequest(
	request: globalThis.Request | null
): globalThis.Request {
	if (!request) {
		throw new Error('Expected proxied request to be captured.');
	}
	return request;
}

afterEach(() => {
	globalThis.fetch = originalFetch;
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
});

describe('builder operate proxy route', () => {
	it('returns 503 when the builder proxy is not configured', async () => {
		const response = await GET(
			new Request(
				'http://localhost/api/operate/builder/queries/builder.workspace.snapshot'
			),
			{
				params: Promise.resolve({
					path: ['queries', 'builder.workspace.snapshot'],
				}),
			}
		);

		expect(response.status).toBe(503);
		expect(await response.json()).toEqual({
			ok: false,
			error: 'builder_proxy_not_configured',
		});
	});

	it('proxies Builder GET requests with the control-plane token', async () => {
		process.env.CONTRACTSPEC_API_BASE_URL = 'https://api.contractspec.test';
		process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';

		let capturedRequest: globalThis.Request | null = null;
		globalThis.fetch = (async (input, init) => {
			capturedRequest = new Request(input, init);
			return new Response(
				JSON.stringify({ ok: true, result: { id: 'ws_1' } }),
				{
					status: 200,
					headers: {
						'content-type': 'application/json',
					},
				}
			);
		}) as typeof fetch;

		const response = await GET(
			new Request(
				'http://localhost/api/operate/builder/queries/builder.workspace.snapshot?workspaceId=ws_1'
			),
			{
				params: Promise.resolve({
					path: ['queries', 'builder.workspace.snapshot'],
				}),
			}
		);

		expect(response.status).toBe(200);
		const proxiedRequest = requireCapturedRequest(capturedRequest);
		expect(proxiedRequest.url).toBe(
			'https://api.contractspec.test/internal/builder/queries/builder.workspace.snapshot?workspaceId=ws_1'
		);
		expect(proxiedRequest.headers.get('authorization')).toBe(
			'Bearer builder-token'
		);
		expect(await response.json()).toEqual({
			ok: true,
			result: { id: 'ws_1' },
		});
	});

	it('proxies Builder POST requests with the original request body', async () => {
		process.env.CONTRACTSPEC_API_BASE_URL = 'https://api.contractspec.test';
		process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';

		let capturedRequest: globalThis.Request | null = null;
		globalThis.fetch = (async (input, init) => {
			capturedRequest = new Request(input, init);
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			});
		}) as typeof fetch;

		const requestBody = JSON.stringify({
			workspaceId: 'ws_1',
			payload: {
				fieldPath: 'brief',
				value: 'Update the brief',
			},
		});

		const response = await POST(
			new Request(
				'http://localhost/api/operate/builder/commands/builder.blueprint.patch',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
					},
					body: requestBody,
				}
			),
			{
				params: Promise.resolve({
					path: ['commands', 'builder.blueprint.patch'],
				}),
			}
		);

		expect(response.status).toBe(200);
		const proxiedRequest = requireCapturedRequest(capturedRequest);
		expect(proxiedRequest.method).toBe('POST');
		expect(await proxiedRequest.text()).toBe(requestBody);
		expect(await response.json()).toEqual({ ok: true });
	});
});
