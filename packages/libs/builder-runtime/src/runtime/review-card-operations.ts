import type {
	BuilderApprovalTicket,
	BuilderChannelMessage,
	BuilderChannelType,
	BuilderMobileReviewCard,
	BuilderSourceRecord,
} from '@contractspec/lib.builder-spec';
import {
	createBuilderMobileReviewActions,
	createBuilderMobileReviewCard,
} from '@contractspec/lib.mobile-control';
import type { RuntimeTarget } from '@contractspec/lib.provider-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import type { BuilderRuntimeDependencies } from './types';

type ReviewableChannelType = Extract<
	BuilderChannelType,
	'telegram' | 'whatsapp'
>;

interface BuilderReviewThread {
	conversationId: string;
	externalConversationId: string;
	externalChannelId?: string;
	participantBindingId?: string;
	receivedAt: string;
}

function isReviewableChannelType(
	channelType: BuilderChannelType
): channelType is ReviewableChannelType {
	return channelType === 'telegram' || channelType === 'whatsapp';
}

function withReviewLink(
	deps: BuilderRuntimeDependencies,
	card: BuilderMobileReviewCard
): BuilderMobileReviewCard {
	const reviewUrl = deps.options.createReviewUrl?.({
		workspaceId: card.workspaceId,
		cardId: card.id,
		channelType: card.channelType,
		subjectType: card.subjectType,
		subjectId: card.subjectId,
	});
	if (!reviewUrl) {
		return card;
	}
	return {
		...card,
		actions: card.actions.map((action) =>
			action.id === 'open_details'
				? {
						...action,
						deepLinkHref: action.deepLinkHref ?? reviewUrl,
					}
				: action
		),
	};
}

function createReviewCardDispatchText(card: BuilderMobileReviewCard): string {
	const detailsHref = card.actions.find(
		(action) => action.id === 'open_details'
	)?.deepLinkHref;
	const lines = [
		`Builder review: ${card.summary}`,
		`Risk: ${card.riskLevel}`,
		`Type: ${card.subjectType}`,
		card.provider?.id ? `Provider: ${card.provider.id}` : null,
		card.affectedAreas.length > 0
			? `Affected: ${card.affectedAreas.join(', ')}`
			: null,
		`Evidence: ${card.evidence.harnessSummary}`,
		detailsHref ? `Open details: ${detailsHref}` : null,
	];
	return lines.filter((line): line is string => Boolean(line)).join('\n');
}

async function findLatestReviewThread(
	deps: BuilderRuntimeDependencies,
	workspaceId: string,
	channelType: ReviewableChannelType
): Promise<BuilderReviewThread | null> {
	const conversations = await deps.store.listConversations(workspaceId);
	let selected: BuilderReviewThread | null = null;
	for (const conversation of conversations) {
		if (
			conversation.primaryChannelType !== channelType &&
			!conversation.boundChannelIds.includes(channelType)
		) {
			continue;
		}
		const messages = await deps.store.listChannelMessages(conversation.id);
		const latestMessage = [...messages]
			.reverse()
			.find(
				(message) =>
					message.channelType === channelType &&
					Boolean(message.externalConversationId)
			);
		if (!latestMessage) {
			continue;
		}
		if (
			!selected ||
			latestMessage.receivedAt.localeCompare(selected.receivedAt) > 0
		) {
			selected = {
				conversationId: conversation.id,
				externalConversationId: latestMessage.externalConversationId,
				externalChannelId: latestMessage.externalChannelId,
				participantBindingId: latestMessage.participantBindingId,
				receivedAt: latestMessage.receivedAt,
			};
		}
	}
	return selected;
}

async function persistOutboundReviewMessage(input: {
	deps: BuilderRuntimeDependencies;
	card: BuilderMobileReviewCard;
	thread: BuilderReviewThread;
	text: string;
	dispatchId?: string;
}) {
	const nowIso = isoNow(input.deps.now);
	const messageId = createBuilderId('message');
	await input.deps.store.saveChannelMessage({
		id: messageId,
		workspaceId: input.card.workspaceId,
		conversationId: input.thread.conversationId,
		channelType: input.card.channelType,
		direction: 'outbound',
		eventType: 'builder.mobileReviewCard.dispatch',
		externalEventId: input.dispatchId,
		externalConversationId: input.thread.externalConversationId,
		externalChannelId: input.thread.externalChannelId,
		externalMessageId: input.dispatchId ?? messageId,
		participantBindingId: input.thread.participantBindingId,
		messageKind: 'review_card',
		contentRef: input.text,
		directiveCandidates: [],
		outboundTag: input.dispatchId,
		receivedAt: nowIso,
	} satisfies BuilderChannelMessage);
	const conversation = await input.deps.store.getConversation(
		input.thread.conversationId
	);
	if (conversation) {
		await input.deps.store.saveConversation({
			...conversation,
			lastActivityAt: nowIso,
		});
	}
}

async function dispatchReviewCardToChannel(
	deps: BuilderRuntimeDependencies,
	card: BuilderMobileReviewCard
) {
	if (
		!deps.options.outboundBridge ||
		!isReviewableChannelType(card.channelType)
	) {
		return;
	}
	const thread = await findLatestReviewThread(
		deps,
		card.workspaceId,
		card.channelType
	);
	if (!thread) {
		return;
	}
	const text = createReviewCardDispatchText(card);
	const dispatch = await deps.options.outboundBridge.send({
		workspaceId: card.workspaceId,
		channelType: card.channelType,
		text,
		externalThreadId: thread.externalConversationId,
		externalChannelId: thread.externalChannelId,
	});
	await persistOutboundReviewMessage({
		deps,
		card,
		thread,
		text,
		dispatchId: dispatch.dispatchId,
	});
}

export async function persistBuilderReviewCard(
	deps: BuilderRuntimeDependencies,
	card: BuilderMobileReviewCard
) {
	const nextCard = withReviewLink(deps, card);
	const saved = await deps.store.saveMobileReviewCard(nextCard);
	await dispatchReviewCardToChannel(deps, saved);
	return saved;
}

export async function resolveBuilderReviewCard(
	deps: BuilderRuntimeDependencies,
	input: {
		cardId: string;
		status: 'approved' | 'rejected' | 'acknowledged' | 'resolved';
	}
) {
	const card = await deps.store.getMobileReviewCard(input.cardId);
	if (!card) {
		return null;
	}
	return deps.store.saveMobileReviewCard({
		...card,
		status: input.status,
		updatedAt: isoNow(deps.now),
	});
}

function requestedViaToChannelType(
	requestedVia: BuilderApprovalTicket['requestedVia']
): BuilderChannelType {
	if (requestedVia === 'telegram') return 'telegram';
	if (requestedVia === 'whatsapp') return 'whatsapp';
	return 'mobile_web';
}

export async function createApprovalTicketReviewCard(
	deps: BuilderRuntimeDependencies,
	ticket: BuilderApprovalTicket
) {
	const nowIso = isoNow(deps.now);
	return persistBuilderReviewCard(
		deps,
		createBuilderMobileReviewCard({
			id: `mobile_review_${ticket.id}`,
			workspaceId: ticket.workspaceId,
			channelType: requestedViaToChannelType(ticket.requestedVia),
			subjectType: 'approval_ticket',
			subjectId: ticket.id,
			summary: ticket.reason,
			riskLevel: ticket.riskLevel,
			harnessSummary: `Approval strength required: ${ticket.requiredStrength}.`,
			actions: createBuilderMobileReviewActions({
				includeApproveReject: true,
			}),
			createdAt: nowIso,
		})
	);
}

export async function createDirectiveConfirmationReviewCard(input: {
	deps: BuilderRuntimeDependencies;
	workspaceId: string;
	channelType: BuilderChannelType;
	subjectId: string;
	summary: string;
	affectedAreas?: string[];
	sourceRefs?: string[];
}) {
	const nowIso = isoNow(input.deps.now);
	return persistBuilderReviewCard(
		input.deps,
		createBuilderMobileReviewCard({
			id: createBuilderId('mobile_review'),
			workspaceId: input.workspaceId,
			channelType: input.channelType,
			subjectType: 'patch_proposal',
			subjectId: input.subjectId,
			summary: input.summary,
			riskLevel: 'medium',
			affectedAreas: input.affectedAreas,
			sourceRefs: input.sourceRefs,
			harnessSummary: 'Builder applied the confirmed change safely.',
			actions: createBuilderMobileReviewActions({
				includeApproveReject: false,
			}),
			createdAt: nowIso,
		})
	);
}

export async function createRuntimeIncidentReviewCard(input: {
	deps: BuilderRuntimeDependencies;
	target: RuntimeTarget;
	channelType?: BuilderChannelType;
	commandKey: string;
}) {
	const nowIso = isoNow(input.deps.now);
	const summary =
		input.commandKey === 'builder.runtimeTarget.quarantine'
			? `${input.target.displayName} was quarantined.`
			: `${input.target.displayName} requires runtime attention.`;
	return persistBuilderReviewCard(
		input.deps,
		createBuilderMobileReviewCard({
			id: createBuilderId('mobile_review'),
			workspaceId: input.target.workspaceId,
			channelType: input.channelType ?? 'mobile_web',
			subjectType: 'runtime_incident',
			subjectId: input.target.id,
			summary,
			riskLevel:
				input.commandKey === 'builder.runtimeTarget.quarantine'
					? 'critical'
					: 'high',
			affectedAreas: [input.target.runtimeMode, input.target.displayName],
			harnessSummary:
				input.target.lastHealthSummary ??
				input.target.blockedReasons?.[0] ??
				'Runtime target health changed.',
			actions: createBuilderMobileReviewActions({
				includeApproveReject: false,
				includeAcknowledge: true,
			}),
			createdAt: nowIso,
		})
	);
}

export function createProviderReviewSourceRefs(
	sources: BuilderSourceRecord[]
): string[] {
	return sources.map((source) => source.id);
}
