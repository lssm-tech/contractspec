// Note: Object Storage is not available in Scaleway JS SDK
// This is a placeholder implementation
// In production, use S3-compatible API directly or wait for SDK support
import type { ScalewayClient } from '../clients/scaleway-client';
import type { ResourceNames } from '../config/resources';
import type { Environment } from '../config/index';

export interface StorageResources {
  bucketNames: string[];
}

export class StorageStack {
  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string
  ) {}

  async plan(): Promise<{
    buckets: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
  }> {
    // Placeholder: Object Storage not available in SDK
    const buckets = this.resourceNames.buckets.map((bucketName) => ({
      name: bucketName,
      action: 'no-op' as const,
      current: undefined,
    }));

    return { buckets };
  }

  async apply(): Promise<StorageResources> {
    // Placeholder: Object Storage not available in SDK
    // In production, use S3-compatible API directly
    console.warn(
      'Object Storage buckets are not managed via Scaleway JS SDK. Use S3-compatible API directly.'
    );

    return {
      bucketNames: this.resourceNames.buckets,
    };
  }
}
