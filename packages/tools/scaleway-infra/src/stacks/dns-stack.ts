// import { Domain } from '@scaleway/sdk';
import { Domainv2beta1 } from '@scaleway/sdk-domain';
import type { ScalewayClient } from '../clients/scaleway-client';
import type { ResourceNames } from '../config/resources';
import { createResourceTags } from '../utils/tags';
import type { Environment } from '../config/index';

type DomainRecordType =
  | 'unknown'
  | 'A'
  | 'AAAA'
  | 'CNAME'
  | 'TXT'
  | 'SRV'
  | 'TLSA'
  | 'MX'
  | 'NS'
  | 'PTR'
  | 'CAA'
  | 'ALIAS'
  | 'LOC'
  | 'SSHFP'
  | 'HINFO'
  | 'RP'
  | 'URI'
  | 'DS'
  | 'NAPTR'
  | 'DNAME';

export interface DnsResources {
  zoneIds: string[];
  recordIds: string[];
}

export class DnsStack {
  private apiDns: Domainv2beta1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string,
    private loadBalancerIp?: string
  ) {
    this.apiDns = new Domainv2beta1.API(client);
  }

  async plan(): Promise<{
    zones: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
    records: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
  }> {
    const zones = await Promise.all(
      this.resourceNames.dnsZones.map(async (zoneName) => {
        const existing = await this.findZone(zoneName);
        return {
          name: zoneName,
          action: (existing ? 'no-op' : 'create') as
            | 'create'
            | 'update'
            | 'no-op',
          current: existing,
        };
      })
    );

    const records = await Promise.all(
      this.getRequiredRecords().map(async (record) => {
        const existing = await this.findRecord(
          record.zone,
          record.name,
          record.type
        );
        return {
          name: `${record.name}.${record.zone}`,
          action: (existing ? 'no-op' : 'create') as
            | 'create'
            | 'update'
            | 'no-op',
          current: existing,
        };
      })
    );

    return { zones, records };
  }

  async apply(): Promise<DnsResources> {
    const tags = createResourceTags(this.env, this.org);
    const zoneIds: string[] = [];
    const recordIds: string[] = [];

    for (const zoneName of this.resourceNames.dnsZones) {
      const zone = await this.ensureZone(zoneName, tags);
      zoneIds.push(zone.domain);
    }

    for (const record of this.getRequiredRecords()) {
      const zone = await this.findZone(record.zone);
      if (!zone) {
        throw new Error(`Zone ${record.zone} not found`);
      }
      const dnsRecord = await this.ensureRecord(zone.domain, record, tags);
      recordIds.push(dnsRecord.id);
    }

    return { zoneIds, recordIds };
  }

  private getRequiredRecords(): {
    zone: string;
    name: string;
    type: DomainRecordType;
    data: string;
  }[] {
    const records: {
      zone: string;
      name: string;
      type: DomainRecordType;
      data: string;
    }[] = [];

    if (this.loadBalancerIp) {
      // Backend API records
      records.push({
        zone: 'lssm.tech',
        name: 'api',
        type: 'A',
        data: this.loadBalancerIp,
      });
      records.push({
        zone: 'lssm.tech',
        name: 'api.equitya',
        type: 'A',
        data: this.loadBalancerIp,
      });
    }

    // Frontend CNAME records (reference only, managed by Vercel)
    // These are documented but not managed by this tool

    return records;
  }

  private async findZone(name: string) {
    try {
      const response = await this.apiDns.listDNSZones({
        domain: name,
      });
      return response.dnsZones?.[0];
    } catch {
      return null;
    }
  }

  private async findRecord(zone: string, name: string, type: DomainRecordType) {
    const zoneObj = await this.findZone(zone);
    if (!zoneObj) {
      return null;
    }

    try {
      const response = await this.apiDns.listDNSZoneRecords({
        dnsZone: zoneObj.domain,
        name: `${name}.${zone}`,
        type,
      });
      return response.records?.[0];
    } catch {
      return null;
    }
  }

  private async ensureZone(name: string, tags: Record<string, string>) {
    const existing = await this.findZone(name);
    if (existing) {
      return existing;
    }

    const config = await import('../config/index');
    const projectId = config.getConfig(this.env).projectId;
    const zone = await this.apiDns.createDNSZone({
      domain: name,
      subdomain: '',
      projectId,
    });

    return zone;
  }

  private async ensureRecord(
    zoneDomain: string,
    record: {
      zone: string;
      name: string;
      type: DomainRecordType;
      data: string;
    },
    tags: Record<string, string>
  ) {
    const existing = await this.findRecord(
      record.zone,
      record.name,
      record.type
    );
    if (existing) {
      return existing;
    }

    const dnsRecord = await this.apiDns.updateDNSZoneRecords({
      dnsZone: zoneDomain,
      changes: [
        {
          add: {
            records: [
              {
                name: `${record.name}.${record.zone}`,
                type: record.type,
                data: record.data,
                ttl: 3600,
                priority: 0,
                id: '',
              },
            ],
          },
        },
      ],
      disallowNewZoneCreation: false,
    } as any);

    // Find the created record
    const records = await this.apiDns.listDNSZoneRecords({
      dnsZone: zoneDomain,
      name: `${record.name}.${record.zone}`,
      type: record.type,
    });

    const createdRecord = records.records?.[0];
    if (!createdRecord) {
      throw new Error(
        `Failed to create DNS record ${record.name}.${record.zone}`
      );
    }

    return createdRecord;
  }
}
