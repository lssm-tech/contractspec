// worker-main.ts
import { registerAllJobs, ScalewaySqsJobQueue } from '@lssm/lib.contracts/jobs';

async function main() {
  const queueUrl = process.env.SCALEWAY_SQS_QUEUE_URL;

  if (!queueUrl) {
    console.error('SCALEWAY_SQS_QUEUE_URL is not set');
    process.exit(1);
  }

  const queue = new ScalewaySqsJobQueue({ queueUrl });

  registerAllJobs(queue);

  console.log('[worker] Starting main SQS worker');
  queue.start();

  const shutdown = async (signal: string) => {
    console.log(`[worker] Caught ${signal}, stopping worker...`);
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
  console.error('[worker] Fatal startup error', err);
  process.exit(1);
});
