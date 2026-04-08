import type { BuilderChannelMessage } from '@contractspec/lib.builder-spec';
import type { HarnessCapturedArtifact } from '@contractspec/lib.harness';
import type {
	ExternalExecutionProvider,
	RuntimeMode,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';

export function createSuiteArtifact(
	key: string,
	summary: string
): HarnessCapturedArtifact {
	return {
		kind: 'step-summary',
		uri: `builder://readiness/${key}`,
		summary,
		body: {
			suite: key,
			summary,
		},
	};
}

export function createIssue(
	code: string,
	message: string,
	runtimeModes?: RuntimeMode[]
) {
	return {
		code,
		message,
		runtimeModes,
	};
}

export function hasRuntimeMode(
	mode: RuntimeMode,
	runtimeTargets: RuntimeTarget[],
	providers: ExternalExecutionProvider[]
) {
	if (mode === 'managed') {
		return providers.some(
			(provider) =>
				provider.status !== 'disabled' &&
				provider.availability !== 'offline' &&
				provider.supportedRuntimeModes.includes('managed')
		);
	}
	return runtimeTargets.some(
		(target) =>
			target.runtimeMode === mode &&
			target.registrationState === 'registered' &&
			target.capabilityProfile.supportsExport
	);
}

export function buildSupportedRuntimeModes(input: {
	hasManaged: boolean;
	hasLocal: boolean;
	hasHybrid: boolean;
}) {
	return (
		[
			input.hasManaged ? 'managed' : null,
			input.hasLocal ? 'local' : null,
			input.hasHybrid ? 'hybrid' : null,
		] as const
	).filter((mode): mode is RuntimeMode => mode !== null);
}

export function collectReplayIssues(messages: BuilderChannelMessage[]) {
	const exactDeliveryMap = new Map<string, BuilderChannelMessage[]>();
	const messageHistoryMap = new Map<string, BuilderChannelMessage[]>();

	for (const message of messages) {
		const revision = String(message.messageRevision ?? 0);
		const lifecycleState = message.deletedAt
			? 'deleted'
			: message.editedAt
				? 'edited'
				: 'active';
		const replayKey = [
			message.channelType,
			message.externalConversationId,
			message.externalMessageId,
			revision,
			lifecycleState,
		].join(':');
		const historyKey = [
			message.channelType,
			message.externalConversationId,
			message.externalMessageId,
		].join(':');
		exactDeliveryMap.set(replayKey, [
			...(exactDeliveryMap.get(replayKey) ?? []),
			message,
		]);
		messageHistoryMap.set(historyKey, [
			...(messageHistoryMap.get(historyKey) ?? []),
			message,
		]);
	}

	const duplicateDeliveries = [...exactDeliveryMap.values()].filter(
		(group) => group.length > 1
	);
	const unlinkedMessageRevisions = [...messageHistoryMap.values()].filter(
		(group) =>
			group.length > 1 &&
			group.some(
				(message) =>
					(message.messageRevision ?? 0) > 0 ||
					Boolean(message.editedAt) ||
					Boolean(message.deletedAt)
			) &&
			group.some(
				(message) =>
					!message.supersedesMessageId &&
					((message.messageRevision ?? 0) > 0 ||
						Boolean(message.editedAt) ||
						Boolean(message.deletedAt))
			)
	);

	return {
		duplicateDeliveries,
		unlinkedMessageRevisions,
	};
}
