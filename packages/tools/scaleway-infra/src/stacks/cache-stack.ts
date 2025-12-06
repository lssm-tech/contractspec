import { Redisv1 } from '@scaleway/sdk-redis';
import type { ScalewayClient } from '../clients/scaleway-client';
import type { ResourceNames } from '../config/resources';
import { redisConfig } from '../config/resources';
import { createResourceTags } from '../utils/tags';
import type { Environment } from '../config/index';

export interface CacheResources {
  instanceId: string;
}

export class CacheStack {
  private apiRedis: Redisv1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string,
    private privateNetworkId: string,
    private securityGroupId: string
  ) {
    this.apiRedis = new Redisv1.API(client);
  }

  async plan(): Promise<{
    instance: { action: 'create' | 'update' | 'no-op'; current?: unknown };
  }> {
    const instance = await this.findInstance();
    return {
      instance: {
        action: instance ? 'no-op' : 'create',
        current: instance,
      },
    };
  }

  async apply(): Promise<CacheResources> {
    const tags = createResourceTags(this.env, this.org);
    const instance = await this.ensureInstance(tags);

    return {
      instanceId: instance.id,
    };
  }

  private async findInstance() {
    try {
      const response = await this.apiRedis.listClusters({
        name: this.resourceNames.redisInstance,
      });
      return response.clusters?.[0];
    } catch {
      return null;
    }
  }

  private async ensureInstance(tags: Record<string, string>) {
    const existing = await this.findInstance();
    if (existing) {
      return existing;
    }

    const instance = await this.apiRedis.createCluster({
      name: this.resourceNames.redisInstance,
      version: '7.0',
      nodeType: redisConfig.nodeType,
      userName: 'default',
      password: this.generatePassword(),
      clusterSize: 1,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
      tlsEnabled: true,
      // Note: Private network attachment for Redis is done via endpoints
      // This is a simplified version - in production, you'd create an endpoint
      // with privateNetworkId specified
    });

    return instance;
  }

  private generatePassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
