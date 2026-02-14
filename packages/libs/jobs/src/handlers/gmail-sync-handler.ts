import type { JobHandler } from '@contractspec/lib.contracts/jobs/queue';
import type { GmailIngestionAdapter } from '@contractspec/lib.knowledge/ingestion/gmail-adapter';
import type { EmailThreadListQuery } from '@contractspec/lib.contracts-integrations';

export type GmailSyncJobPayload = EmailThreadListQuery;

export function createGmailSyncHandler(
  adapter: GmailIngestionAdapter
): JobHandler<GmailSyncJobPayload> {
  return async (job) => {
    await adapter.syncThreads(job.payload);
  };
}
