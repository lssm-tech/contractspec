import { Rdbv1 } from '@scaleway/sdk';
import type { ScalewayClient } from '../clients/scaleway-client';
import type { ResourceNames } from '../config/resources';
import { databaseConfig, databases } from '../config/resources';
import { createResourceTags } from '../utils/tags';
import type { Environment } from '../config/index';

export interface DatabaseResources {
  instanceId: string;
  databaseNames: string[];
}

export class DatabaseStack {
  private apiRdb: Rdbv1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string,
    private privateNetworkId: string,
    private securityGroupId: string
  ) {
    this.apiRdb = new Rdbv1.API(client);
  }

  async plan(): Promise<{
    instance: { action: 'create' | 'update' | 'no-op'; current?: unknown };
    databases: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
  }> {
    const instance = await this.findInstance();
    const dbChecks = await Promise.all(
      databases.map(async (dbName) => {
        const existing = instance
          ? await this.findDatabase(instance.id, dbName)
          : null;
        return {
          name: dbName,
          action: (existing ? 'no-op' : 'create') as
            | 'create'
            | 'update'
            | 'no-op',
          current: existing,
        };
      })
    );

    return {
      instance: {
        action: instance ? 'no-op' : 'create',
        current: instance,
      },
      databases: dbChecks,
    };
  }

  async apply(): Promise<DatabaseResources> {
    const tags = createResourceTags(this.env, this.org);
    const instance = await this.ensureInstance(tags);

    const databaseNames: string[] = [];
    for (const dbName of databases) {
      await this.ensureDatabase(instance.id, dbName);
      databaseNames.push(dbName);
    }

    return {
      instanceId: instance.id,
      databaseNames,
    };
  }

  private async findInstance() {
    try {
      const response = await this.apiRdb.listInstances({
        name: this.resourceNames.postgresInstance,
      });
      return response.instances?.[0];
    } catch {
      return null;
    }
  }

  private async findDatabase(instanceId: string, dbName: string) {
    try {
      const response = await this.apiRdb.listDatabases({
        skipSizeRetrieval: true,
        instanceId,
        name: dbName,
      });
      return response.databases?.[0];
    } catch {
      return null;
    }
  }

  private async ensureInstance(tags: Record<string, string>) {
    const existing = await this.findInstance();
    if (existing) {
      return existing;
    }

    const instance = await this.apiRdb.createInstance({
      name: this.resourceNames.postgresInstance,
      engine: 'PostgreSQL-15',
      nodeType: databaseConfig.tier,
      isHaCluster: false,
      userName: 'lssm',
      password: this.generatePassword(),
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
      disableBackup: false,
      volumeSize: 20000000000, // 20GB in bytes
      backupSameRegion: true,
      // Note: Backup schedule is configured via separate API calls after instance creation
    });

    // Attach to private network via endpoint
    // Note: Private network attachment for RDB is done via endpoints
    // This is a simplified version - in production, you'd create an endpoint
    // with privateNetworkId specified

    return instance;
  }

  private async ensureDatabase(instanceId: string, dbName: string) {
    const existing = await this.findDatabase(instanceId, dbName);
    if (existing) {
      return existing;
    }

    const database = await this.apiRdb.createDatabase({
      instanceId,
      name: dbName,
    });

    return database;
  }

  private generatePassword(): string {
    // Generate a secure random password
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
