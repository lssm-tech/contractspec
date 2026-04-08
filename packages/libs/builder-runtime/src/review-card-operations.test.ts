import { describe, expect, it, mock } from 'bun:test';
import type { BuilderBlueprint } from '@contractspec/lib.builder-spec';
import { BuilderRuntimeService } from './runtime';
import { InMemoryBuilderStore } from './stores';

const FIXED_NOW = '2026-04-08T09:00:00.000Z';

async function createWorkspace(
	service: BuilderRuntimeService,
	workspaceId = 'ws_review'
) {
	await service.executeCommand('builder.workspace.create', {
		workspaceId,
		payload: {
			tenantId: 'tenant_1',
			name: 'Review Workspace',
			ownerIds: ['owner_1'],
		},
	});
	return workspaceId;
}

function createBlueprint(workspaceId: string): BuilderBlueprint {
	return {
		id: 'bp_1',
		workspaceId,
		appBrief: 'Ops review app',
		personas: [],
		domainObjects: [],
		workflows: [],
		surfaces: [],
		integrations: [],
		policies: ['approval required'],
		runtimeProfiles: [],
		channelSurfaces: [],
		featureParity: [],
		assumptions: [],
		openQuestions: [],
		coverageReport: {
			explicitCount: 1,
			inferredCount: 0,
			conflictedCount: 0,
			missingCount: 0,
			fields: [],
		},
		version: 1,
		lockedFieldPaths: [],
		createdAt: FIXED_NOW,
		updatedAt: FIXED_NOW,
	};
}

async function seedTelegramThread(
	service: BuilderRuntimeService,
	workspaceId: string,
	conversationId = 'conversation_1'
) {
	await service.executeCommand('builder.conversation.start', {
		workspaceId,
		entityId: conversationId,
		payload: {
			mode: 'mixed',
			boundChannelIds: ['telegram'],
		},
	});
	await service.executeCommand('builder.channel.receiveInbound', {
		workspaceId,
		conversationId,
		payload: {
			workspaceId,
			conversationId,
			channelType: 'telegram',
			externalConversationId: 'thread_telegram_1',
			externalChannelId: 'chat_1',
			externalMessageId: 'message_1',
			messageKind: 'text',
			text: 'Open the review thread.',
		},
	});
	return conversationId;
}

describe('builder review-card operations', () => {
	it('dispatches mobile review cards into the latest matching thread and records outbound visibility', async () => {
		const send = mock(async () => ({
			status: 'queued' as const,
			dispatchId: 'dispatch_1',
		}));
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
			outboundBridge: { send },
			createReviewUrl: ({ workspaceId, cardId }) =>
				`https://studio.contractspec.test/operate/builder/workspaces/${workspaceId}/mobile-review/${cardId}`,
		});
		const workspaceId = await createWorkspace(service);
		const conversationId = await seedTelegramThread(service, workspaceId);

		await service.executeCommand('builder.mobileReviewCard.create', {
			workspaceId,
			entityId: 'card_1',
			payload: {
				channelType: 'telegram',
				subjectType: 'patch_proposal',
				subjectId: 'proposal_1',
				summary: 'Review the provider patch.',
				riskLevel: 'high',
				affectedAreas: ['policies'],
			},
		});

		const cards = await store.listMobileReviewCards(workspaceId);
		const messages = await store.listChannelMessages(conversationId);
		const dispatchCall = send.mock.calls.at(0) as
			| [{ externalThreadId: string }]
			| undefined;

		expect(send).toHaveBeenCalledTimes(1);
		expect(dispatchCall?.[0].externalThreadId).toBe('thread_telegram_1');
		expect(
			cards[0]?.actions.find((action) => action.id === 'open_details')
				?.deepLinkHref
		).toContain('/mobile-review/card_1');
		expect(
			messages.some(
				(message) =>
					message.direction === 'outbound' &&
					message.messageKind === 'review_card' &&
					message.contentRef.includes('Review the provider patch.')
			)
		).toBe(true);
	});

	it('creates approval review cards for channel approval requests', async () => {
		const send = mock(async () => ({
			status: 'queued' as const,
			dispatchId: 'dispatch_approval_1',
		}));
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
			outboundBridge: { send },
		});
		const workspaceId = await createWorkspace(service);
		await seedTelegramThread(service, workspaceId);

		await service.executeCommand('builder.approval.request', {
			workspaceId,
			payload: {
				reason: 'Approval required before export.',
				riskLevel: 'high',
				requestedVia: 'telegram',
				requiredStrength: 'admin_signed',
			},
		});

		const cards = await store.listMobileReviewCards(workspaceId);

		expect(send).toHaveBeenCalledTimes(1);
		expect(cards[0]?.subjectType).toBe('approval_ticket');
		expect(cards[0]?.summary).toBe('Approval required before export.');
	});

	it('creates directive confirmation cards after safe structured channel changes', async () => {
		const send = mock(async () => ({
			status: 'queued' as const,
			dispatchId: 'dispatch_confirmation_1',
		}));
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
			outboundBridge: { send },
		});
		const workspaceId = await createWorkspace(service);
		await store.saveBlueprint(createBlueprint(workspaceId));

		await service.executeCommand('builder.participantBinding.bind', {
			workspaceId,
			entityId: 'binding_1',
			payload: {
				participantId: 'editor_1',
				workspaceRole: 'editor',
				channelType: 'telegram',
				externalIdentityRef: 'telegram:editor_1',
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				approvalStrength: 'bound_channel_ack',
				allowedActions: ['builder.blueprint.patch'],
			},
		});
		await service.executeCommand('builder.conversation.start', {
			workspaceId,
			entityId: 'conversation_1',
			payload: {
				mode: 'mixed',
				boundChannelIds: ['telegram'],
			},
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_telegram_1',
				externalChannelId: 'chat_1',
				externalMessageId: 'message_1',
				participantBindingId: 'binding_1',
				messageKind: 'button',
				text: 'Add policy',
				metadata: {
					operation: {
						fieldPath: 'policies',
						mode: 'append',
						value: 'manager approval required',
						confirmationStep: 1,
					},
				},
			},
		});

		const cards = await store.listMobileReviewCards(workspaceId);
		const blueprint = await store.getBlueprint(workspaceId);

		expect(send).toHaveBeenCalledTimes(1);
		expect(blueprint?.policies).toContain('manager approval required');
		expect(
			cards.some((card) => card.summary.includes('Applied policies update'))
		).toBe(true);
	});

	it('creates runtime incident cards when runtime targets are quarantined', async () => {
		const send = mock(async () => ({
			status: 'queued' as const,
			dispatchId: 'dispatch_runtime_1',
		}));
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
			outboundBridge: { send },
		});
		const workspaceId = await createWorkspace(service);
		await seedTelegramThread(service, workspaceId);

		await service.executeCommand('builder.runtimeTarget.register', {
			workspaceId,
			entityId: 'rt_1',
			payload: {
				displayName: 'Hybrid Bridge',
				runtimeMode: 'hybrid',
				type: 'hybrid_bridge',
			},
		});
		await service.executeCommand('builder.runtimeTarget.quarantine', {
			workspaceId,
			entityId: 'rt_1',
			payload: {
				channelType: 'telegram',
				reason: 'Suspicious relay activity.',
			},
		});

		const cards = await store.listMobileReviewCards(workspaceId);

		expect(send).toHaveBeenCalledTimes(1);
		expect(cards[0]?.subjectType).toBe('runtime_incident');
		expect(cards[0]?.summary).toContain('quarantined');
	});
});
