import type {
	BuilderMobileReviewCard,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import type { RuntimeMode } from '@contractspec/lib.provider-spec';

export async function fetchBuilderSnapshot(workspaceId: string) {
	const response = await fetch(
		`/api/operate/builder/queries/builder.workspace.snapshot?workspaceId=${encodeURIComponent(workspaceId)}`,
		{
			cache: 'no-store',
		}
	);
	if (!response.ok) {
		throw new Error('Failed to fetch Builder workspace snapshot.');
	}
	const payload = (await response.json()) as {
		ok: boolean;
		result: BuilderWorkspaceSnapshot;
	};
	if (!payload.ok) {
		throw new Error('Builder workspace snapshot query returned an error.');
	}
	return payload.result;
}

export async function executeBuilderCommand(input: {
	commandKey: string;
	workspaceId: string;
	entityId?: string;
	payload?: Record<string, unknown>;
}) {
	const response = await fetch(
		`/api/operate/builder/commands/${input.commandKey}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				workspaceId: input.workspaceId,
				entityId: input.entityId,
				payload: input.payload,
			}),
		}
	);
	if (!response.ok) {
		throw new Error(`Failed to execute Builder command ${input.commandKey}.`);
	}
	const payload = (await response.json()) as {
		ok: boolean;
		error?: string;
	};
	if (!payload.ok) {
		throw new Error(
			payload.error ?? `Builder command ${input.commandKey} returned an error.`
		);
	}
}

export async function patchBuilderBrief(workspaceId: string, value: string) {
	await executeBuilderCommand({
		commandKey: 'builder.blueprint.patch',
		workspaceId,
		payload: {
			fieldPath: 'brief',
			appBrief: value,
			value,
		},
	});
}

export async function bootstrapManagedBuilderWorkspace(workspaceId: string) {
	await executeBuilderCommand({
		commandKey: 'builder.workspace.bootstrap',
		workspaceId,
		payload: {
			preset: 'managed_mvp',
			includeLocalHelperProvider: true,
		},
	});
}

export function createPromptEnvelope(workspaceId: string, promptDraft: string) {
	const id = `builder_web_${Date.now().toString(36)}_${Math.random()
		.toString(36)
		.slice(2, 10)}`;
	const conversationId = `builder_web_${workspaceId}`;
	return {
		workspaceId,
		conversationId,
		channelType: 'web_chat' as const,
		eventType: 'web_chat.message',
		externalEventId: id,
		externalConversationId: conversationId,
		externalMessageId: id,
		externalIdentityRef: 'operate_web',
		externalUserId: 'operate_web',
		messageKind: 'text' as const,
		text: promptDraft,
	};
}

export function buildBuilderMobileReviewPath(
	workspaceId: string,
	cardId: string
) {
	return `/operate/builder/workspaces/${encodeURIComponent(workspaceId)}/mobile-review/${encodeURIComponent(cardId)}`;
}

export function findBuilderMobileReviewCardBySubject(input: {
	snapshot: BuilderWorkspaceSnapshot;
	subjectId: string;
}): BuilderMobileReviewCard | null {
	return (
		input.snapshot.mobileReviewCards.find(
			(card) => card.subjectId === input.subjectId
		) ?? null
	);
}

export function findBuilderMobileReviewCard(input: {
	snapshot: BuilderWorkspaceSnapshot;
	cardId: string;
}): BuilderMobileReviewCard | null {
	return (
		input.snapshot.mobileReviewCards.find((card) => card.id === input.cardId) ??
		null
	);
}

export function resolveBuilderExportRuntimeMode(
	snapshot: BuilderWorkspaceSnapshot
): RuntimeMode {
	return (
		snapshot.exportBundle?.runtimeMode ??
		snapshot.preview?.runtimeMode ??
		snapshot.workspace.defaultRuntimeMode
	);
}
