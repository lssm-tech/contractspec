import {
  ChannelOutboxDispatcher,
  ChannelRuntimeService,
  InMemoryChannelRuntimeStore,
  PostgresChannelRuntimeStore,
  type ChannelRuntimeStore,
  type ChannelTelemetryEmitter,
  type ChannelTelemetryEvent,
} from '@contractspec/integration.runtime/channel';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { createPostgresChannelRuntimeStore } from './channel-runtime-store-factory';
import { clearWorkspaceMapCacheForTests } from './channel-workspace-resolver';
import { resetSenderResolverForTests } from './channel-sender-resolver';

interface RuntimeResources {
  store: ChannelRuntimeStore;
  service: ChannelRuntimeService;
  dispatcher: ChannelOutboxDispatcher;
  initializePromise: Promise<void>;
}

let runtimeResources: RuntimeResources | null = null;

const telemetryEmitter: ChannelTelemetryEmitter = {
  record(event: ChannelTelemetryEvent) {
    const level =
      event.status === 'failed' || event.status === 'dead_letter'
        ? 'warn'
        : 'info';
    appLogger[level]('channel.runtime.telemetry', {
      stage: event.stage,
      status: event.status,
      workspaceId: event.workspaceId,
      providerKey: event.providerKey,
      receiptId: event.receiptId,
      actionId: event.actionId,
      traceId: event.traceId,
      latencyMs: event.latencyMs,
      attempt: event.attempt,
      ...event.metadata,
    });
  },
};

export async function getChannelRuntimeResources(): Promise<RuntimeResources> {
  if (runtimeResources) {
    await runtimeResources.initializePromise;
    return runtimeResources;
  }

  const storageMode = process.env.CHANNEL_RUNTIME_STORAGE ?? 'postgres';
  const databaseUrl =
    process.env.CHANNEL_RUNTIME_DATABASE_URL ?? process.env.DATABASE_URL;
  if (storageMode !== 'memory' && !databaseUrl) {
    throw new Error(
      'CHANNEL_RUNTIME_DATABASE_URL (or DATABASE_URL) must be set for channel runtime.'
    );
  }
  const store =
    storageMode === 'memory'
      ? new InMemoryChannelRuntimeStore()
      : createPostgresChannelRuntimeStore(databaseUrl as string);
  const asyncProcessing = process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING !== '0';
  const service = new ChannelRuntimeService(store, {
    asyncProcessing,
    telemetry: telemetryEmitter,
  });
  const dispatcher = new ChannelOutboxDispatcher(store, {
    telemetry: telemetryEmitter,
    batchSize: Number.parseInt(
      process.env.CHANNEL_DISPATCH_BATCH_SIZE ?? '20',
      10
    ),
    maxRetries: Number.parseInt(
      process.env.CHANNEL_DISPATCH_MAX_RETRIES ?? '3',
      10
    ),
    baseBackoffMs: Number.parseInt(
      process.env.CHANNEL_DISPATCH_BASE_BACKOFF_MS ?? '1000',
      10
    ),
  });
  const initializePromise =
    store instanceof PostgresChannelRuntimeStore
      ? store.initializeSchema()
      : Promise.resolve();

  runtimeResources = {
    store,
    service,
    dispatcher,
    initializePromise,
  };

  await initializePromise;
  return runtimeResources;
}

export function resetChannelRuntimeResourcesForTests(): void {
  runtimeResources = null;
  resetSenderResolverForTests();
  clearWorkspaceMapCacheForTests();
}

export function getChannelRuntimeStoreForTests(): ChannelRuntimeStore | null {
  return runtimeResources?.store ?? null;
}
