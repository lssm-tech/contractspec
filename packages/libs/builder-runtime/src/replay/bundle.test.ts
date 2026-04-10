import { describe, expect, it } from 'bun:test';
import { createBuilderReplayBundle } from './bundle';

describe('builder replay bundle', () => {
	it('produces deterministic source hashes from source metadata', () => {
		const bundle = createBuilderReplayBundle({
			workspaceId: 'ws_1',
			blueprint: {
				id: 'bp_1',
				workspaceId: 'ws_1',
				appBrief: 'Brief',
				personas: [],
				domainObjects: [],
				workflows: [],
				surfaces: [],
				integrations: [],
				policies: [],
				runtimeProfiles: [
					{
						id: 'runtime_managed',
						label: 'Managed',
						runtimeMode: 'managed',
						status: 'candidate',
					},
				],
				channelSurfaces: [],
				featureParity: [],
				assumptions: [],
				openQuestions: [],
				coverageReport: {
					explicitCount: 0,
					inferredCount: 0,
					conflictedCount: 0,
					missingCount: 0,
					fields: [],
				},
				version: 2,
				lockedFieldPaths: [],
				createdAt: '2026-04-06T00:00:00.000Z',
				updatedAt: '2026-04-06T00:00:00.000Z',
			},
			sources: [
				{
					id: 'src_1',
					workspaceId: 'ws_1',
					sourceType: 'web_chat_message',
					title: 'Brief',
					provenance: {
						sourceId: 'src_1',
						sourceType: 'web_chat_message',
						capturedAt: '2026-04-06T00:00:00.000Z',
						extractorType: 'test',
						confidence: 1,
						hash: 'hash_1',
						policyClassification: 'internal',
					},
					policyClassification: 'internal',
					approvalState: 'approved',
					hash: 'hash_1',
					createdAt: '2026-04-06T00:00:00.000Z',
					updatedAt: '2026-04-06T00:00:00.000Z',
				},
			],
			directives: [],
			messages: [],
		});

		expect(bundle.sourceSetHash.length).toBeGreaterThan(0);
		expect(bundle.blueprintVersion).toBe(2);
	});
});
