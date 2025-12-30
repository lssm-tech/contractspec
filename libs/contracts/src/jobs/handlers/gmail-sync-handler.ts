import type { JobHandler } from '../queue';
import type { GmailIngestionAdapter } from '../../knowledge/ingestion/gmail-adapter';
import type { EmailThreadListQuery } from '../../integrations/providers/email';

export type GmailSyncJobPayload = EmailThreadListQuery;

export function createGmailSyncHandler(
  adapter: GmailIngestionAdapter
): JobHandler<GmailSyncJobPayload> {
  return async (job) => {
    await adapter.syncThreads(job.payload);
  };
}
