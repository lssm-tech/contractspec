import type { EmailThreadListQuery } from '@contractspec/lib.contracts-integrations';
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
