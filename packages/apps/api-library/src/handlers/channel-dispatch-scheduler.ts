import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import { resolveMessagingSender } from './channel-sender-resolver';

let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let dispatchInFlight = false;

export function startChannelDispatchScheduler(): void {
  const intervalMs = Number.parseInt(
    process.env.CHANNEL_DISPATCH_INTERVAL_MS ?? '0',
    10
  );
  if (!Number.isFinite(intervalMs) || intervalMs <= 0 || schedulerTimer) {
    return;
  }

  const runDispatch = async () => {
    if (dispatchInFlight) {
      return;
    }
    dispatchInFlight = true;
    try {
      const runtime = await getChannelRuntimeResources();
      const summary = await runtime.dispatcher.dispatchBatch(
        resolveMessagingSender
      );
      if (summary.claimed > 0) {
        appLogger.info('channel.dispatch.scheduler.batch', {
          claimed: summary.claimed,
          sent: summary.sent,
          retried: summary.retried,
          deadLettered: summary.deadLettered,
        });
      }
    } catch (error) {
      appLogger.error('channel.dispatch.scheduler.failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      dispatchInFlight = false;
    }
  };

  schedulerTimer = setInterval(() => {
    void runDispatch();
  }, intervalMs);

  if (process.env.CHANNEL_DISPATCH_RUN_ON_START === '1') {
    void runDispatch();
  }

  appLogger.info('channel.dispatch.scheduler.started', {
    intervalMs,
  });
}
