import type { EmailThreadListQuery } from '../../integrations/providers/email';
import type { GmailIngestionAdapter } from '../../knowledge/ingestion/gmail-adapter';
import type { JobHandler } from '../queue';

export type GmailSyncJobPayload = EmailThreadListQuery;

export function createGmailSyncHandler(
	adapter: GmailIngestionAdapter
): JobHandler<GmailSyncJobPayload> {
	return async (job) => {
		await adapter.syncThreads(job.payload);
	};
}
