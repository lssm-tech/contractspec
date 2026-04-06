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

	it('lists and retrieves execution-lane runs through the operator API', async () => {
		const runtime = await getChannelRuntimeResources();
		await runtime.executionLaneStore.createRun({
			runId: 'lane-run-1',
			lane: 'team.coordinated',
			objective: 'Ship the console',
			sourceRequest: 'build',
			scopeClass: 'large',
			status: 'running',
			currentPhase: 'dispatch',
			ownerRole: 'planner',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'team',
			blockingRisks: [],
			pendingApprovalRoles: ['verifier'],
			evidenceBundleIds: [],
			createdAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
			updatedAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
		});
		await runtime.executionLaneStore.saveTeam({
			runId: 'lane-run-1',
			spec: {
				id: 'lane-run-1',
				objective: 'Ship the console',
				workers: [],
				backlog: [],
				coordination: {
					mailbox: true,
					taskLeasing: true,
					heartbeats: true,
					rebalancing: true,
				},
				verificationLane: { required: true, ownerRole: 'verifier' },
				shutdownPolicy: {
					requireTerminalTasks: true,
					requireEvidenceGate: true,
				},
			},
			status: 'running',
			tasks: [],
			workers: [],
			mailbox: [],
			heartbeatLog: [],
			cleanup: {
				status: 'not_requested',
				failures: [],
			},
			evidenceBundleIds: [],
			createdAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
			updatedAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
		});

		const listResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/lanes', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(listResponse.status).toBe(200);
		const listJson = (await listResponse.json()) as {
			ok: boolean;
			items: Array<{ runId: string }>;
		};
		expect(listJson.ok).toBe(true);
		expect(listJson.items[0]?.runId).toBe('lane-run-1');

		const getResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/lanes/lane-run-1', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(getResponse.status).toBe(200);
		const getJson = (await getResponse.json()) as {
			ok: boolean;
			run: { run: { runId: string } };
		};
		expect(getJson.ok).toBe(true);
		expect(getJson.run.run.runId).toBe('lane-run-1');
	});

	it('surfaces missing execution-lane artifacts through the operator API', async () => {
		const runtime = await getChannelRuntimeResources();
		await runtime.executionLaneStore.createRun({
			runId: 'lane-run-artifacts',
			lane: 'clarify',
			objective: 'Clarify the task',
			sourceRequest: 'clarify it',
			scopeClass: 'small',
			status: 'running',
			currentPhase: 'clarifying',
			ownerRole: 'planner',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'lane.clarify',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
			updatedAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
		});

		const listResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/lanes', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(listResponse.status).toBe(200);
		const listJson = (await listResponse.json()) as {
			ok: boolean;
			items: Array<{ runId: string; missingArtifacts: string[] }>;
		};
		expect(listJson.ok).toBe(true);
		expect(
			listJson.items.find((item) => item.runId === 'lane-run-artifacts')
				?.missingArtifacts
		).toEqual(['clarification_artifact']);
	});

	it('requests approval, opens replay, and aborts execution-lane runs through the operator API', async () => {
		process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS =
			'control-plane.audit,control-plane.execution.shutdown,control-plane.execution.approve';
		const runtime = await getChannelRuntimeResources();
		await runtime.executionLaneStore.createRun({
			runId: 'lane-run-2',
			lane: 'complete.persistent',
			objective: 'Finish the closer',
			sourceRequest: 'complete',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'working',
			ownerRole: 'executor',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'completion',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: ['evidence-2'],
			createdAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
			updatedAt: new Date('2026-04-06T10:00:00.000Z').toISOString(),
		});
		await runtime.executionLaneStore.saveEvidence({
			id: 'evidence-2',
			runId: 'lane-run-2',
			artifactIds: [],
			classes: ['verification_results'],
			createdAt: new Date('2026-04-06T10:01:00.000Z').toISOString(),
			replayBundleUri: 'replay://lane-run-2',
		});

		const approvalResponse = await app.handle(
			new Request(
				'http://localhost/internal/control-plane/lanes/lane-run-2/request-approval',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						authorization: 'Bearer control-plane-token',
						...buildOperatorHeaders('operator-1'),
					},
					body: JSON.stringify({ role: 'architect' }),
				}
			)
		);
		expect(approvalResponse.status).toBe(200);
		const approvalJson = (await approvalResponse.json()) as {
			ok: boolean;
			approval: { role: string };
		};
		expect(approvalJson.ok).toBe(true);
		expect(approvalJson.approval.role).toBe('architect');

		const replayResponse = await app.handle(
			new Request(
				'http://localhost/internal/control-plane/lanes/lane-run-2/replay',
				{
					headers: {
						authorization: 'Bearer control-plane-token',
					},
				}
			)
		);
		expect(replayResponse.status).toBe(200);
		const replayJson = (await replayResponse.json()) as {
			ok: boolean;
			replay: { primaryReplayBundleUri?: string };
		};
		expect(replayJson.ok).toBe(true);
		expect(replayJson.replay.primaryReplayBundleUri).toBe(
			'replay://lane-run-2'
		);

		const abortResponse = await app.handle(
			new Request(
				'http://localhost/internal/control-plane/lanes/lane-run-2/abort',
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						authorization: 'Bearer control-plane-token',
						...buildOperatorHeaders('operator-1'),
					},
					body: JSON.stringify({ reason: 'Operator requested stop.' }),
				}
			)
		);
		expect(abortResponse.status).toBe(200);
		const abortJson = (await abortResponse.json()) as {
			ok: boolean;
			run: { run: { status: string } };
		};
		expect(abortJson.ok).toBe(true);
		expect(abortJson.run.run.status).toBe('aborted');
	});

	it('stores, lists, retrieves, and surfaces Connect review queue items', async () => {
		const ingestResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/connect/reviews', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: 'Bearer control-plane-token',
				},
				body: JSON.stringify(createConnectReviewPayload()),
			})
		);
		expect(ingestResponse.status).toBe(200);
		const ingestJson = (await ingestResponse.json()) as {
			item: { id: string; laneRunId?: string; status: string };
			ok: boolean;
		};
		expect(ingestJson.ok).toBe(true);
		expect(ingestJson.item.id).toBe('review-queue-1');
		expect(ingestJson.item.laneRunId).toBeDefined();
		expect(ingestJson.item.status).toBe('pending');

		const listResponse = await app.handle(
			new Request(
				'http://localhost/internal/control-plane/connect/reviews?queue=connect-review',
				{
					headers: {
						authorization: 'Bearer control-plane-token',
					},
				}
			)
		);
		expect(listResponse.status).toBe(200);
		const listJson = (await listResponse.json()) as {
			items: Array<{ id: string; sourceDecisionId: string }>;
			ok: boolean;
		};
		expect(listJson.ok).toBe(true);
		expect(listJson.items).toHaveLength(1);
		expect(listJson.items[0]?.sourceDecisionId).toBe(
			'connect-queue-decision-1'
		);

		const getResponse = await app.handle(
			new Request(
				'http://localhost/internal/control-plane/connect/reviews/review-queue-1',
				{
					headers: {
						authorization: 'Bearer control-plane-token',
					},
				}
			)
		);
		expect(getResponse.status).toBe(200);
		const getJson = (await getResponse.json()) as {
			item: { canonPackRefs: string[]; queue: string };
			ok: boolean;
		};
		expect(getJson.ok).toBe(true);
		expect(getJson.item.queue).toBe('connect-review');
		expect(getJson.item.canonPackRefs).toEqual(['team/platform@1.2.0']);

		const dashboardResponse = await app.handle(
			new Request('http://localhost/internal/control-plane/dashboard', {
				headers: {
					authorization: 'Bearer control-plane-token',
				},
			})
		);
		expect(dashboardResponse.status).toBe(200);
		const dashboardJson = (await dashboardResponse.json()) as {
			dashboard: { connectReviewQueue: Array<{ id: string }> };
			ok: boolean;
		};
		expect(dashboardJson.ok).toBe(true);
		expect(dashboardJson.dashboard.connectReviewQueue[0]?.id).toBe(
			'review-queue-1'
		);
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

function createConnectReviewPayload() {
	return {
		contextPack: {
			acceptanceChecks: ['bun run typecheck'],
			actor: { id: 'cli:task-1', type: 'human', traceId: 'trace-queue-1' },
			affectedSurfaces: ['audit', 'runtime'],
			branch: 'main',
			configRefs: [{ kind: 'canon-pack', ref: 'team/platform@1.2.0' }],
			id: 'ctx-queue-1',
			impactedContracts: [],
			knowledge: [
				{
					category: 'canonical',
					source: 'connect.canonPacks',
					spaceKey: 'team/platform@1.2.0',
					trustLevel: 'high',
				},
			],
			policyBindings: [],
			repoId: 'workspace-queue-1',
			taskId: 'task-queue-1',
		},
		decisionEnvelope: {
			connectDecisionId: 'connect-queue-decision-1',
			createdAt: '2026-04-06T10:00:00.000Z',
			taskId: 'task-queue-1',
			verdict: 'require_review',
		},
		patchVerdict: {
			controlPlane: {
				approvalStatus: 'pending',
				traceId: 'trace-queue-1',
			},
			decisionId: 'connect-queue-decision-1',
			verdict: 'require_review',
		},
		planPacket: {
			actor: { id: 'cli:task-1', type: 'human' },
			branch: 'main',
			id: 'plan-queue-1',
			objective: 'Review Connect queue item',
			repoId: 'workspace-queue-1',
			requiredApprovals: [],
			riskScore: 0.5,
			steps: [{ id: 'step-1', summary: 'Inspect diff', paths: ['src/a.ts'] }],
			taskId: 'task-queue-1',
			verificationStatus: 'review',
		},
		queue: 'connect-review',
		reviewPacket: {
			controlPlane: {
				approvalStatus: 'pending',
				traceId: 'trace-queue-1',
			},
			evidence: [],
			id: 'review-queue-1',
			objective: 'Review Connect queue item',
			reason: 'Protected path requires review.',
			requiredApprovals: [
				{
					capability: 'control-plane.execution.approve',
					reason: 'review',
				},
			],
			sourceDecisionId: 'connect-queue-decision-1',
			studio: {
				enabled: true,
				mode: 'review-bridge',
				queue: 'connect-review',
			},
			summary: {
				affectedSurfaces: ['audit', 'runtime'],
				impactedContracts: [],
				paths: ['src/a.ts'],
				requiredChecks: ['path-boundary'],
			},
		},
	};
}
