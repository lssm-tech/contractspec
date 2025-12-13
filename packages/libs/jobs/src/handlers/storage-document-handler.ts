import type { ObjectStorageProvider } from '@lssm/lib.contracts/integrations/providers/storage';
import type { StorageIngestionAdapter } from '@lssm/lib.knowledge/ingestion/storage-adapter';
import type { JobHandler } from '@lssm/lib.contracts/jobs/queue';

export interface StorageDocumentJobPayload {
  bucket: string;
  key: string;
}

export function createStorageDocumentHandler(
  storage: ObjectStorageProvider,
  adapter: StorageIngestionAdapter
): JobHandler<StorageDocumentJobPayload> {
  return async (job) => {
    const object = await storage.getObject({
      bucket: job.payload.bucket,
      key: job.payload.key,
    });
    if (!object) {
      throw new Error(
        `Object ${job.payload.bucket}/${job.payload.key} not found`
      );
    }
    await adapter.ingestObject(object);
  };
}
