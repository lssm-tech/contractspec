import { VPC, VPCGW, Instance } from '@scaleway/sdk';
import type { ScalewayClient } from '../clients/scaleway-client.js';
import type { ResourceNames } from '../config/resources.js';
import { createResourceTags } from '../utils/tags.js';
import type { Environment } from '../config/index.js';

export interface NetworkingResources {
  vpcId?: string;
  privateNetworkId?: string;
  publicGatewayId?: string;
  securityGroupBackendId?: string;
  securityGroupDbId?: string;
  securityGroupRedisId?: string;
}

export class NetworkingStack {
  private apiVpc: VPC.v2.API;
  private apiVpcGw: VPCGW.v1.API;
  private apiInstance: Instance.v1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string
  ) {
    this.apiVpc = new VPC.v2.API(client);
    this.apiVpcGw = new VPCGW.v1.API(client);
    this.apiInstance = new Instance.v1.API(client);
  }

  async plan(): Promise<{
    vpc: { action: 'create' | 'update' | 'no-op'; current?: unknown };
    privateNetwork: {
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    };
    publicGateway: { action: 'create' | 'update' | 'no-op'; current?: unknown };
    securityGroups: Record<
      string,
      { action: 'create' | 'update' | 'no-op'; current?: unknown }
    >;
  }> {
    // Check existing resources
    const existingVpc = await this.findVpc();
    const existingPn = await this.findPrivateNetwork();
    const existingPgw = await this.findPublicGateway();
    const existingSgs = await this.findSecurityGroups();

    return {
      vpc: {
        action: existingVpc ? 'no-op' : 'create',
        current: existingVpc,
      },
      privateNetwork: {
        action: existingPn ? 'no-op' : 'create',
        current: existingPn,
      },
      publicGateway: {
        action: existingPgw ? 'no-op' : 'create',
        current: existingPgw,
      },
      securityGroups: {
        backend: {
          action: existingSgs.backend ? 'no-op' : 'create',
          current: existingSgs.backend,
        },
        db: {
          action: existingSgs.db ? 'no-op' : 'create',
          current: existingSgs.db,
        },
        redis: {
          action: existingSgs.redis ? 'no-op' : 'create',
          current: existingSgs.redis,
        },
      },
    };
  }

  async apply(): Promise<NetworkingResources> {
    const tags = createResourceTags(this.env, this.org);

    // Create VPC
    const vpc = await this.ensureVpc(tags);

    // Create Private Network
    const privateNetwork = await this.ensurePrivateNetwork(vpc.id, tags);

    // Create Public Gateway
    const publicGateway = await this.ensurePublicGateway(
      privateNetwork.id,
      tags
    );

    // Create Security Groups
    const securityGroups = await this.ensureSecurityGroups(tags);

    return {
      vpcId: vpc.id,
      privateNetworkId: privateNetwork.id,
      publicGatewayId: publicGateway.id,
      securityGroupBackendId: securityGroups.backend?.id,
      securityGroupDbId: securityGroups.db?.id,
      securityGroupRedisId: securityGroups.redis?.id,
    };
  }

  private async findVpc() {
    try {
      const response = await this.apiVpc.listVPCs({
        name: this.resourceNames.vpc,
      });
      return response.vpcs?.[0];
    } catch {
      return null;
    }
  }

  private async findPrivateNetwork() {
    try {
      const response = await this.apiVpc.listPrivateNetworks({
        name: this.resourceNames.privateNetwork,
      });
      return response.privateNetworks?.[0];
    } catch {
      return null;
    }
  }

  private async findPublicGateway() {
    try {
      const response = await this.apiVpcGw.listGateways({
        name: this.resourceNames.publicGateway,
      });
      return response.gateways?.[0];
    } catch {
      return null;
    }
  }

  private async findSecurityGroups() {
    const backend = await this.findSecurityGroup(
      this.resourceNames.securityGroupBackend
    );
    const db = await this.findSecurityGroup(this.resourceNames.securityGroupDb);
    const redis = await this.findSecurityGroup(
      this.resourceNames.securityGroupRedis
    );

    return { backend, db, redis };
  }

  private async findSecurityGroup(name: string) {
    try {
      const response = await this.apiInstance.listSecurityGroups({
        name,
      });
      return response.securityGroups?.[0];
    } catch {
      return null;
    }
  }

  private async ensureVpc(tags: Record<string, string>) {
    const existing = await this.findVpc();
    if (existing) {
      return existing;
    }

    const vpc = await this.apiVpc.createVPC({
      name: this.resourceNames.vpc,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
    });

    return vpc;
  }

  private async ensurePrivateNetwork(
    vpcId: string,
    tags: Record<string, string>
  ) {
    const existing = await this.findPrivateNetwork();
    if (existing) {
      return existing;
    }

    const pn = await this.apiVpc.createPrivateNetwork({
      name: this.resourceNames.privateNetwork,
      vpcId,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
    });

    return pn;
  }

  private async ensurePublicGateway(
    pnId: string,
    tags: Record<string, string>
  ) {
    const existing = await this.findPublicGateway();
    if (existing) {
      return existing;
    }

    const gateway = await this.apiVpcGw.createGateway({
      name: this.resourceNames.publicGateway,
      type: 'VPC-GW-S',
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
      enableSmtp: false,
      enableBastion: false,
    });

    // Attach to private network
    await this.apiVpcGw.createGatewayNetwork({
      gatewayId: gateway.id,
      privateNetworkId: pnId,
      enableMasquerade: true,
    });

    return gateway;
  }

  private async ensureSecurityGroups(tags: Record<string, string>) {
    const backend = await this.ensureSecurityGroup(
      this.resourceNames.securityGroupBackend,
      tags,
      [
        {
          action: 'accept',
          protocol: 'TCP',
          port: '3000',
          ipRange: '0.0.0.0/0',
          direction: 'inbound',
        },
      ]
    );

    const db = await this.ensureSecurityGroup(
      this.resourceNames.securityGroupDb,
      tags,
      [
        {
          action: 'accept',
          protocol: 'TCP',
          port: '5432',
          ipRange: '10.0.0.0/8',
          direction: 'inbound',
        },
      ]
    );

    const redis = await this.ensureSecurityGroup(
      this.resourceNames.securityGroupRedis,
      tags,
      [
        {
          action: 'accept',
          protocol: 'TCP',
          port: '6379',
          ipRange: '10.0.0.0/8',
          direction: 'inbound',
        },
      ]
    );

    return { backend, db, redis };
  }

  private async ensureSecurityGroup(
    name: string,
    tags: Record<string, string>,
    rules: {
      action: 'accept' | 'drop';
      protocol: string;
      port: string;
      ipRange: string;
      direction: 'inbound' | 'outbound';
    }[]
  ) {
    const existing = await this.findSecurityGroup(name);
    if (existing) {
      return existing;
    }

    const sgResponse = await this.apiInstance.createSecurityGroup({
      name,
      description: `Security group for ${name}`,
      stateful: true,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
      inboundDefaultPolicy: 'drop',
      outboundDefaultPolicy: 'accept',
    });

    if (!sgResponse.securityGroup) {
      throw new Error('Failed to create security group');
    }

    const sg = await this.apiInstance.getSecurityGroup({
      securityGroupId: sgResponse.securityGroup.id,
    });

    if (!sg.securityGroup) {
      throw new Error('Failed to retrieve security group');
    }

    // Add rules
    for (const rule of rules) {
      await this.apiInstance.createSecurityGroupRule({
        securityGroupId: sg.securityGroup.id,
        action: rule.action,
        protocol: rule.protocol as 'TCP' | 'UDP' | 'ICMP' | 'ANY',
        port: parseInt(rule.port, 10),
        ipRange: rule.ipRange,
        direction: rule.direction,
      } as any);
    }

    return sg.securityGroup;
  }
}
