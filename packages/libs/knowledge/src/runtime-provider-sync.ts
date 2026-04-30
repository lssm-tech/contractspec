import type {
	EmailInboundProvider,
	EmailThreadListQuery,
	GoogleDriveListFilesQuery,
	GoogleDriveProvider,
	GoogleDriveWatchInput,
	GoogleDriveWatchResult,
	ProviderDeltaSyncState,
} from '@contractspec/lib.contracts-integrations';
import { isProviderDeltaTombstoned } from '@contractspec/lib.contracts-integrations';
import type { DriveIngestionAdapter, DriveIngestionResult } from './ingestion';
import type { GmailIngestionAdapter } from './ingestion/gmail-adapter';

export interface KnowledgeProviderDeltaCheckpointKey {
	providerKey: string;
	sourceId: string;
}

export interface KnowledgeProviderDeltaCheckpoint
	extends KnowledgeProviderDeltaCheckpointKey {
	delta: ProviderDeltaSyncState;
	recordedAt?: string | Date;
	evidenceRef?: string;
}

export interface KnowledgeProviderDeltaCheckpointStore {
	load(
		key: KnowledgeProviderDeltaCheckpointKey
	): Promise<ProviderDeltaSyncState | undefined>;
	save(checkpoint: KnowledgeProviderDeltaCheckpoint): Promise<void>;
}

export interface KnowledgeProviderSyncOptions {
	sourceId?: string;
	delta?: ProviderDeltaSyncState;
	checkpointStore?: KnowledgeProviderDeltaCheckpointStore;
	evidenceRef?: string;
}

interface SyncContext {
	checkpointStore?: KnowledgeProviderDeltaCheckpointStore;
}

export async function syncGmailProvider({
	provider,
	query,
	options,
	context,
	adapter,
}: {
	provider: EmailInboundProvider;
	query?: EmailThreadListQuery;
	options: KnowledgeProviderSyncOptions;
	context: SyncContext;
	adapter: GmailIngestionAdapter;
}): Promise<{ threadsIndexed: number; delta?: ProviderDeltaSyncState }> {
	const effectiveQuery = await withCheckpointDelta(
		'email.gmail',
		query,
		options,
		context
	);
	const threads = await provider.listThreads(effectiveQuery);
	let threadsIndexed = 0;

	for (const thread of threads) {
		if (isProviderDeltaTombstoned(thread.delta)) {
			continue;
		}
		await adapter.ingestThread(thread);
		threadsIndexed += 1;
	}

	const delta = mergeProviderDelta(
		effectiveQuery?.delta,
		...threads.map((thread) => thread.delta)
	);
	await saveCheckpoint('email.gmail', options, context, delta);
	return { threadsIndexed, delta };
}

export async function syncDriveProvider({
	query,
	options,
	context,
	adapter,
}: {
	query?: GoogleDriveListFilesQuery;
	options: KnowledgeProviderSyncOptions;
	context: SyncContext;
	adapter: DriveIngestionAdapter;
}): Promise<DriveIngestionResult> {
	const effectiveQuery = await withCheckpointDelta(
		'storage.google-drive',
		query,
		options,
		context
	);
	const result = await adapter.syncFiles(effectiveQuery);
	await saveCheckpoint('storage.google-drive', options, context, result.delta);
	return result;
}

export async function watchDriveProvider({
	provider,
	input,
	options,
	context,
}: {
	provider: GoogleDriveProvider;
	input: GoogleDriveWatchInput;
	options: KnowledgeProviderSyncOptions;
	context: SyncContext;
}): Promise<GoogleDriveWatchResult> {
	if (!provider.watchChanges) {
		throw new Error(
			'KnowledgeRuntime.watchDriveChanges() requires a GoogleDriveProvider with watchChanges().'
		);
	}
	const effectiveInput = await withCheckpointDelta(
		'storage.google-drive',
		input,
		options,
		context
	);
	const result = await provider.watchChanges(effectiveInput ?? input);
	await saveCheckpoint('storage.google-drive', options, context, result.delta);
	return result;
}

async function withCheckpointDelta<
	T extends { delta?: ProviderDeltaSyncState },
>(
	providerKey: string,
	input: T | undefined,
	options: KnowledgeProviderSyncOptions,
	context: SyncContext
): Promise<T | undefined> {
	const store = options.checkpointStore ?? context.checkpointStore;
	const stored =
		store && options.sourceId
			? await store.load({ providerKey, sourceId: options.sourceId })
			: undefined;
	const delta = mergeProviderDelta(stored, input?.delta, options.delta);
	return delta ? { ...(input ?? ({} as T)), delta } : input;
}

async function saveCheckpoint(
	providerKey: string,
	options: KnowledgeProviderSyncOptions,
	context: SyncContext,
	delta: ProviderDeltaSyncState | undefined
): Promise<void> {
	const store = options.checkpointStore ?? context.checkpointStore;
	if (!store || !options.sourceId || !delta) {
		return;
	}
	await store.save({
		providerKey,
		sourceId: options.sourceId,
		delta,
		recordedAt: new Date(),
		evidenceRef: options.evidenceRef,
	});
}

function mergeProviderDelta(
	...deltas: (ProviderDeltaSyncState | undefined)[]
): ProviderDeltaSyncState | undefined {
	const present = deltas.filter(Boolean) as ProviderDeltaSyncState[];
	if (present.length === 0) {
		return undefined;
	}
	return present.reduce<ProviderDeltaSyncState>((merged, delta) => {
		const next: ProviderDeltaSyncState = {
			...merged,
			...delta,
			tombstone: delta.tombstone ?? merged.tombstone,
		};
		next.lease = mergeRequired(merged.lease, delta.lease);
		next.cursor = mergeOptional(merged.cursor, delta.cursor);
		next.webhookChannel = mergeRequired(
			merged.webhookChannel,
			delta.webhookChannel
		);
		next.replayCheckpoint = mergeRequired(
			merged.replayCheckpoint,
			delta.replayCheckpoint
		);
		return next;
	}, {});
}

function mergeRequired<T>(current: T | undefined, next: T | undefined) {
	if (next) {
		return current ? { ...current, ...next } : next;
	}
	return current;
}

function mergeOptional<T>(current: T | undefined, next: T | undefined) {
	return current || next ? { ...current, ...next } : undefined;
}
