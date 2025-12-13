import { registerAllJobs, ScalewaySqsJobQueue } from '@lssm/lib.jobs';
import { Logger, LogLevel } from '@lssm/lib.logger';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableTracing: true,
  enableTiming: true,
  enableContext: true,
  enableColors: process.env.NODE_ENV !== 'production',
});

async function main() {
  const queueUrl = process.env.SCALEWAY_SQS_QUEUE_URL;

  if (!queueUrl) {
    logger.error('worker.missing_env', { key: 'SCALEWAY_SQS_QUEUE_URL' });
    process.exit(1);
  }

  const queue = new ScalewaySqsJobQueue({ queueUrl, logger });

  registerAllJobs(queue);

  logger.info('worker.starting', { queue: 'scaleway-sqs' });
  queue.start();

  const shutdown = async (signal: string) => {
    logger.info('worker.stopping', { signal });
    await queue.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

main().catch((err) => {
  logger.error('worker.fatal_startup_error', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
