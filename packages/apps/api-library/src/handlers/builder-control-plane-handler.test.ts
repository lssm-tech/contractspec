import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { createCodexProviderPayload } from '@contractspec/integration.provider.codex';
import { createManagedRuntimeTargetPayload } from '@contractspec/integration.runtime.managed';
import { Elysia } from 'elysia';
import { builderControlPlaneHandler } from './builder-control-plane-handler';
import {
	getBuilderRuntimeStoreForTests,
	resetBuilderRuntimeResourcesForTests,
} from './builder-runtime-resources';

const app = new Elysia().use(builderControlPlaneHandler);

const TEST_ENV_KEYS = [
	'BUILDER_RUNTIME_STORAGE',
	'CONTROL_PLANE_API_TOKEN',
	'CONTROL_PLANE_API_CAPABILITY_GRANTS',
] as const;

beforeEach(() => {
	resetBuilderRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
	process.env.BUILDER_RUNTIME_STORAGE = 'memory';
	process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';
	process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS =
		'builder.chat.web,builder.plan.compile,builder.export.prepare';
});

afterEach(() => {
	resetBuilderRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
});

describe('builder control-plane handler', () => {
	it('bootstraps a managed Builder workspace through the generic Builder API', async () => {
		const response = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.bootstrap',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_bootstrap',
						payload: {
							preset: 'managed_mvp',
						},
					}),
				}
			)
		);

		expect(response.status).toBe(200);
		const json = (await response.json()) as {
			ok: boolean;
			result: {
				workspaceId: string;
				runtimeTargetIds: string[];
				providerIds: string[];
			};
		};
		expect(json.ok).toBe(true);
		expect(json.result.workspaceId).toBe('builder_ws_bootstrap');
		expect(json.result.runtimeTargetIds).toEqual(['rt_managed_default']);
		expect(json.result.providerIds).toEqual(
			expect.arrayContaining([
				'provider.gemini',
				'provider.codex',
				'provider.stt.default',
			])
		);

		const snapshotResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/queries/builder.workspace.snapshot?workspaceId=builder_ws_bootstrap',
				{
					headers: {
						authorization: 'Bearer builder-token',
					},
				}
			)
		);
		const snapshotJson = (await snapshotResponse.json()) as {
			ok: boolean;
			result: {
				runtimeTargets: Array<{ runtimeMode: string }>;
				externalProviders: Array<{ providerKind: string }>;
				routingPolicy: { defaultProviderProfileId?: string } | null;
			};
		};
		expect(snapshotJson.ok).toBe(true);
		expect(snapshotJson.result.runtimeTargets[0]?.runtimeMode).toBe('managed');
		expect(
			snapshotJson.result.externalProviders.some(
				(provider) => provider.providerKind === 'conversational'
			)
		).toBe(true);
		expect(snapshotJson.result.routingPolicy?.defaultProviderProfileId).toBe(
			'provider.gemini'
		);
	});

	it('rejects builder bootstrap requests without auth or builder capability grants', async () => {
		const unauthorized = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.bootstrap',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_bootstrap',
						payload: {
							preset: 'managed_mvp',
						},
					}),
				}
			)
		);
		expect(unauthorized.status).toBe(401);

		process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS = 'channel.dispatch';
		const forbidden = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.bootstrap',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_bootstrap',
						payload: {
							preset: 'managed_mvp',
						},
					}),
				}
			)
		);
		expect(forbidden.status).toBe(403);
	});

	it('creates and fetches Builder workspaces through generic command/query routes', async () => {
		const createResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_1',
						payload: {
							tenantId: 'tenant_1',
							name: 'Ops Builder',
						},
					}),
				}
			)
		);

		expect(createResponse.status).toBe(200);
		const createJson = (await createResponse.json()) as {
			ok: boolean;
			result: { id: string };
		};
		expect(createJson.ok).toBe(true);
		expect(createJson.result.id).toBe('builder_ws_1');

		const getResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/queries/builder.workspace.get?workspaceId=builder_ws_1',
				{
					headers: {
						authorization: 'Bearer builder-token',
					},
				}
			)
		);

		expect(getResponse.status).toBe(200);
		const getJson = (await getResponse.json()) as {
			ok: boolean;
			result: { id: string; name: string };
		};
		expect(getJson.ok).toBe(true);
		expect(getJson.result.id).toBe('builder_ws_1');
		expect(getJson.result.name).toBe('Ops Builder');

		const store = getBuilderRuntimeStoreForTests();
		expect(store).not.toBeNull();
		expect(await store?.getWorkspace('builder_ws_1')).not.toBeNull();
	});

	it('registers runtime and provider compatibility wrappers through the generic Builder API', async () => {
		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_compat',
						payload: {
							tenantId: 'tenant_1',
							name: 'Compatibility Workspace',
						},
					}),
				}
			)
		);

		const runtimeResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.runtimeTarget.register',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_compat',
						entityId: 'rt_managed_1',
						payload: createManagedRuntimeTargetPayload(),
					}),
				}
			)
		);
		expect(runtimeResponse.status).toBe(200);

		const providerResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.provider.register',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_compat',
						entityId: 'provider.codex',
						payload: createCodexProviderPayload(),
					}),
				}
			)
		);
		expect(providerResponse.status).toBe(200);

		const runtimeListResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/queries/builder.runtimeTarget.list?workspaceId=builder_ws_compat',
				{
					headers: {
						authorization: 'Bearer builder-token',
					},
				}
			)
		);
		const providerListResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/queries/builder.provider.list?workspaceId=builder_ws_compat',
				{
					headers: {
						authorization: 'Bearer builder-token',
					},
				}
			)
		);
		const runtimeJson = (await runtimeListResponse.json()) as {
			ok: boolean;
			result: Array<{ runtimeMode: string; type: string }>;
		};
		const providerJson = (await providerListResponse.json()) as {
			ok: boolean;
			result: Array<{ id: string; integrationPackage: string }>;
		};
		expect(runtimeJson.result[0]?.runtimeMode).toBe('managed');
		expect(runtimeJson.result[0]?.type).toBe('managed_workspace');
		expect(providerJson.result[0]?.integrationPackage).toBe(
			'@contractspec/integration.provider.codex'
		);
	});

	it('registers a local daemon runtime target through the generic Builder API', async () => {
		await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.workspace.create',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_local',
						payload: {
							tenantId: 'tenant_1',
							name: 'Local Workspace',
						},
					}),
				}
			)
		);

		const response = await app.handle(
			new Request(
				'http://localhost/internal/builder/commands/builder.runtimeTarget.registerLocalDaemon',
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer builder-token',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						workspaceId: 'builder_ws_local',
						entityId: 'rt_local_daemon',
						payload: {
							grantedTo: 'operator_1',
							availableProviders: ['provider.codex'],
						},
					}),
				}
			)
		);
		expect(response.status).toBe(200);

		const runtimeListResponse = await app.handle(
			new Request(
				'http://localhost/internal/builder/queries/builder.runtimeTarget.list?workspaceId=builder_ws_local',
				{
					headers: {
						authorization: 'Bearer builder-token',
					},
				}
			)
		);
		const runtimeJson = (await runtimeListResponse.json()) as {
			ok: boolean;
			result: Array<{
				runtimeMode: string;
				type: string;
				lease?: { grantedTo: string };
			}>;
		};
		expect(runtimeJson.ok).toBe(true);
		expect(runtimeJson.result[0]?.runtimeMode).toBe('local');
		expect(runtimeJson.result[0]?.type).toBe('local_daemon');
		expect(runtimeJson.result[0]?.lease?.grantedTo).toBe('operator_1');
	});
});
