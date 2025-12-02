import { Client, createClient } from '@scaleway/sdk';
import type { ScalewayCredentials } from '../config/index.js';

export interface ScalewayClientConfig {
  accessKey: string;
  secretKey: string;
  defaultProjectId: string;
  defaultRegion: string;
  defaultZone: string;
}

export function createScalewayClient(
  credentials: ScalewayCredentials,
  region: string,
  zone: string
): Client {
  return createClient({
    accessKey: credentials.accessKey,
    secretKey: credentials.secretKey,
    defaultProjectId: credentials.projectId,
    defaultRegion: region,
    defaultZone: zone,
  });
}

export type ScalewayClient = Client;
