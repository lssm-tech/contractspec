import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { createHmac, generateKeyPairSync } from 'node:crypto';
import { InMemoryChannelRuntimeStore } from '@contractspec/integration.runtime/channel';
import {
	type ControlPlaneSkillManifest,
	signControlPlaneSkillManifest,
} from '@contractspec/lib.contracts-spec/control-plane/skills';
import { Elysia } from 'elysia';

import { channelControlPlaneHandler } from './channel-control-plane-handler';
import {
	getChannelRuntimeResources,
	getChannelRuntimeStoreForTests,
	resetChannelRuntimeResourcesForTests,
} from './channel-runtime-resources';

const app = new Elysia().use(channelControlPlaneHandler);

const TEST_ENV_KEYS = [
	'CHANNEL_RUNTIME_STORAGE',
	'CHANNEL_RUNTIME_ASYNC_PROCESSING',
	'CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS',
	'CHANNEL_DISPATCH_TOKEN',
	'CONTROL_PLANE_API_TOKEN',
	'CONTROL_PLANE_API_CAPABILITY_GRANTS',
	'CONTROL_PLANE_OPERATOR_IDENTITY_SECRET',
	'CONTROL_PLANE_SKILL_TRUST_POLICY_JSON',
	'CONTROL_PLANE_SKILL_CONTRACTS_SPEC_VERSION',
	'CONTROL_PLANE_SKILL_CONTROL_PLANE_VERSION',
] as const;

beforeEach(() => {
	resetChannelRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
	process.env.CHANNEL_RUNTIME_STORAGE = 'memory';
	process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING = '0';
	process.env.CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS =
		'control-plane.approval.request';
	process.env.CHANNEL_DISPATCH_TOKEN = 'dispatch-token';
	process.env.CONTROL_PLANE_API_TOKEN = 'control-plane-token';
	process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS =
		'control-plane.audit,control-plane.approval,control-plane.skill-registry';
	process.env.CONTROL_PLANE_OPERATOR_IDENTITY_SECRET = 'operator-secret';
});

afterEach(() => {
	resetChannelRuntimeResourcesForTests();
	for (const key of TEST_ENV_KEYS) {
		Reflect.deleteProperty(process.env, key);
	}
});

describe('channel control-plane handler', () => {
	it('rejects dispatch-only credentials for control-plane routes', async () => {
		Reflect.deleteProperty(process.env, 'CONTROL_PLANE_API_TOKEN');
		const response = await app.handle(
			new Request('http://localhost/internal/control-plane/approvals', {
				headers: {
					authorization: 'Bearer dispatch-token',
				},
			})
		);

		expect(response.status).toBe(401);
		expect(await response.json()).toEqual({ ok: false, error: 'unauthorized' });
	});

	it('explains contract-backed policy decisions', async () => {
		const response = await app.handle(
			new Request('http://localhost/internal/control-plane/policy/explain', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: 'Bearer control-plane-token',
				},
				body: JSON.stringify({
					messageText: 'Urgent legal escalation needed.',
				}),
			})
		);

		expect(response.status).toBe(200);
		const json = (await response.json()) as {
			ok: boolean;
			explanation: {
				decision: { verdict: string; policyRef?: { version: string } };
			};
		};
		expect(json.ok).toBe(true);
		expect(json.explanation.decision.verdict).toBe('assist');
		expect(json.explanation.decision.policyRef?.version).toBe('2.0.0');
	});

	it('lists and approves pending decisions through the operator API', async () => {
		const runtime = await getChannelRuntimeResources();
		await runtime.service.ingest({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-approval',
			eventType: 'slack.message',
			occurredAt: new Date('2026-03-22T10:00:00.000Z'),
			signatureValid: true,
			thread: { externalThreadId: 'thread-1' },
			message: { text: 'Please refund this invoice.' },
		});

		const store =
			getChannelRuntimeStoreForTests() as InMemoryChannelRuntimeStore;
		const decisionId = Array.from(store.decisions.keys())[0]!;

		const listResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/approvals', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(listResponse.status).toBe(200);
		const listJson = (await listResponse.json()) as {
			ok: boolean;
			items: Array<{ id: string }>;
		};
		expect(listJson.ok).toBe(true);
		expect(listJson.items.map((item) => item.id)).toEqual([decisionId]);

		const approveResponse = await app.handle(
			new Request(
				`http://localhost/internal/control-plane/approvals/${decisionId}/approve`,
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer control-plane-token',
						...buildOperatorHeaders('operator-1'),
					},
				}
			)
		);
		expect(approveResponse.status).toBe(200);
		const approveJson = (await approveResponse.json()) as {
			ok: boolean;
			decision: { approvalStatus: string };
		};
		expect(approveJson.ok).toBe(true);
		expect(approveJson.decision.approvalStatus).toBe('approved');

		const traceResponse = await app.handle(
			new Request(
				`http://localhost/internal/control-plane/traces/${decisionId}`,
				{
					headers: {
						authorization: 'Bearer control-plane-token',
					},
				}
			)
		);
		expect(traceResponse.status).toBe(200);
		const traceJson = (await traceResponse.json()) as {
			ok: boolean;
			trace: { events: unknown[]; decision: { approvalStatus: string } };
		};
		expect(traceJson.ok).toBe(true);
		expect(traceJson.trace.events.length).toBeGreaterThan(0);
		expect(traceJson.trace.decision.approvalStatus).toBe('approved');
	});

	it('verifies, installs, lists, and disables signed skills', async () => {
		const { privateKey } = generateKeyPairSync('ed25519');
		const manifest: ControlPlaneSkillManifest = {
			schemaVersion: '1.0.0',
			skill: {
				key: 'control-plane.slack-approval',
				version: '1.0.0',
				entryPoint: 'dist/index.js',
				description: 'Routes approvals into Slack workflows.',
			},
			publisher: {
				id: 'contractspec',
				provenance: 'github:contractspec/skills/slack-approval',
			},
			artifact: {
				digest: 'sha256:skill-bundle',
				files: [{ path: 'dist/index.js', digest: 'sha256:file-1', size: 1200 }],
			},
			compatibility: {
				contractsSpec: { minVersion: '4.0.0', maxVersion: '5.0.0' },
				controlPlaneFeature: { minVersion: '1.0.0', maxVersion: '1.1.0' },
				requiredCapabilities: [
					{ key: 'control-plane.skill-registry', version: '1.0.0' },
				],
			},
		};
		const signed = signControlPlaneSkillManifest(manifest, privateKey, {
			keyId: 'publisher-main',
		});
		process.env.CONTROL_PLANE_SKILL_CONTRACTS_SPEC_VERSION = '4.1.3';
		process.env.CONTROL_PLANE_SKILL_TRUST_POLICY_JSON = JSON.stringify({
			trustedPublishers: [
				{
					id: 'contractspec',
					keyIds: ['publisher-main'],
					publicKeys: [signed.signature!.publicKey],
					provenancePrefixes: ['github:contractspec/skills/'],
				},
			],
		});
		resetChannelRuntimeResourcesForTests();

		const verifyResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/skills/verify', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: 'Bearer control-plane-token',
				},
				body: JSON.stringify({
					skillKey: signed.skill.key,
					version: signed.skill.version,
					artifactDigest: signed.artifact.digest,
					manifest: signed,
				}),
			})
		);
		expect(verifyResponse.status).toBe(200);
		const verifyJson = (await verifyResponse.json()) as {
			ok: boolean;
			verification: { report: { verified: boolean } };
		};
		expect(verifyJson.ok).toBe(true);
		expect(verifyJson.verification.report.verified).toBe(true);

		const installResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/skills/install', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: 'Bearer control-plane-token',
					...buildOperatorHeaders('operator-1'),
				},
				body: JSON.stringify({
					skillKey: signed.skill.key,
					version: signed.skill.version,
					artifactDigest: signed.artifact.digest,
					manifest: signed,
				}),
			})
		);
		expect(installResponse.status).toBe(200);
		const installJson = (await installResponse.json()) as {
			ok: boolean;
			installation: { id: string; status: string };
		};
		expect(installJson.ok).toBe(true);
		expect(installJson.installation.status).toBe('installed');

		const listResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/skills', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(listResponse.status).toBe(200);
		const listJson = (await listResponse.json()) as {
			ok: boolean;
			items: Array<{ id: string }>;
			total: number;
		};
		expect(listJson.ok).toBe(true);
		expect(listJson.total).toBe(1);

		const disableResponse = await app.handle(
			new Request(
				`http://localhost/internal/control-plane/skills/${installJson.installation.id}/disable`,
				{
					method: 'POST',
					headers: {
						authorization: 'Bearer control-plane-token',
						...buildOperatorHeaders('operator-1'),
					},
				}
			)
		);
		expect(disableResponse.status).toBe(200);
		const disableJson = (await disableResponse.json()) as {
			ok: boolean;
			installation: { status: string };
		};
		expect(disableJson.ok).toBe(true);
		expect(disableJson.installation.status).toBe('disabled');
	});
});

function buildOperatorHeaders(
	operatorId: string,
	sessionId = 'session-1'
): Record<string, string> {
	const timestamp = String(Date.now());
	const signature = createHmac(
		'sha256',
		process.env.CONTROL_PLANE_OPERATOR_IDENTITY_SECRET ?? ''
	)
		.update(`${operatorId}:${sessionId}:${timestamp}`)
		.digest('hex');
	return {
		'x-control-plane-operator-id': operatorId,
		'x-control-plane-operator-session-id': sessionId,
		'x-control-plane-operator-timestamp': timestamp,
		'x-control-plane-operator-signature': signature,
	};
}
