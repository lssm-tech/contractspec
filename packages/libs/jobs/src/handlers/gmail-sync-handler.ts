import type { JobHandler } from '@lssm/lib.contracts/jobs/queue';
import type { GmailIngestionAdapter } from '@lssm/lib.knowledge/ingestion/gmail-adapter';
import type { EmailThreadListQuery } from '@lssm/lib.contracts/integrations/providers/email';

export type GmailSyncJobPayload = EmailThreadListQuery;

export function createGmailSyncHandler(
  adapter: GmailIngestionAdapter
): JobHandler<GmailSyncJobPayload> {
  return async (job) => {
    await adapter.syncThreads(job.payload);
  };
}
