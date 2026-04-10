import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import {
	bootstrapManagedBuilderWorkspace,
	buildBuilderMobileReviewPath,
	createPromptEnvelope,
	executeBuilderCommand,
	fetchBuilderSnapshot,
	findBuilderMobileReviewCardBySubject,
	resolveBuilderExportRuntimeMode,
} from './builder-workbench-controller';
import { createEmptyBuilderSnapshot } from './builder-workspace-data';

const originalFetch = globalThis.fetch;

describe('builder workbench controller helpers', () => {
	beforeEach(() => {
		globalThis.fetch = mock(async () => {
			const snapshot = createEmptyBuilderSnapshot('ws_test');
			return new Response(
				JSON.stringify({
					ok: true,
					result: {
						...snapshot,
						mobileReviewCards: [
							{
								id: 'card_1',
								workspaceId: 'ws_test',
								channelType: 'mobile_web',
								subjectType: 'patch_proposal',
								subjectId: 'proposal_1',
								summary: 'Review provider patch',
								riskLevel: 'high',
								affectedAreas: ['policies'],
								evidence: {
									sourceRefs: [],
									harnessSummary: 'Harness pending.',
								},
								actions: [{ id: 'open_details', label: 'Open details' }],
								createdAt: '2026-04-08T09:00:00.000Z',
								updatedAt: '2026-04-08T09:00:00.000Z',
							},
						],
						preview: {
							id: 'preview_1',
							workspaceId: 'ws_test',
							generatedWorkspaceRef: 'builder://workspace/ws_test/generated',
							dataMode: 'mock',
							runtimeMode: 'hybrid',
							buildStatus: 'ready',
							readinessSummary: 'ready',
							comparisonRunIds: [],
							mobileReviewCardIds: ['card_1'],
							createdAt: '2026-04-08T09:00:00.000Z',
							updatedAt: '2026-04-08T09:00:00.000Z',
						},
					},
				}),
				{
					status: 200,
					headers: { 'content-type': 'application/json' },
				}
			);
		}) as unknown as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('builds prompt envelopes and mobile review paths', () => {
		const envelope = createPromptEnvelope('ws_test', 'Ship the export flow');

		expect(envelope.workspaceId).toBe('ws_test');
		expect(envelope.channelType).toBe('web_chat');
		expect(envelope.text).toBe('Ship the export flow');
		expect(buildBuilderMobileReviewPath('ws_test', 'card_1')).toBe(
			'/operate/builder/workspaces/ws_test/mobile-review/card_1'
		);
	});

	it('fetches snapshots and resolves the export runtime mode', async () => {
		const snapshot = await fetchBuilderSnapshot('ws_test');

		expect(snapshot.workspace.id).toBe('ws_test');
		expect(resolveBuilderExportRuntimeMode(snapshot)).toBe('hybrid');
		expect(
			findBuilderMobileReviewCardBySubject({
				snapshot,
				subjectId: 'proposal_1',
			})?.id
		).toBe('card_1');
	});

	it('sends Builder commands through the proxy route', async () => {
		const fetchMock = mock(async () => {
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await executeBuilderCommand({
			commandKey: 'builder.export.execute',
			workspaceId: 'ws_test',
			entityId: 'export_1',
			payload: {
				runtimeMode: 'managed',
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const requestUrl = (
			fetchMock.mock.calls.at(0) as [string] | undefined
		)?.[0];
		expect(requestUrl).toBe(
			'/api/operate/builder/commands/builder.export.execute'
		);
	});

	it('bootstraps the managed Builder workspace through the proxy route', async () => {
		const fetchMock = mock(async () => {
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await bootstrapManagedBuilderWorkspace('ws_test');

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const firstCall = fetchMock.mock.calls.at(0) as
			| [string, RequestInit]
			| undefined;
		expect(firstCall).toBeDefined();
		if (!firstCall) {
			return;
		}
		const [requestUrl, requestInit] = firstCall;
		expect(requestUrl).toBe(
			'/api/operate/builder/commands/builder.workspace.bootstrap'
		);
		expect(String(requestInit?.body)).toContain('"preset":"managed_mvp"');
		expect(String(requestInit?.body)).toContain(
			'"includeLocalHelperProvider":true'
		);
	});
});
