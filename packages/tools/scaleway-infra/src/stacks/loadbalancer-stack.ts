import { LB } from '@scaleway/sdk';
import type { ScalewayClient } from '../clients/scaleway-client.js';
import type { ResourceNames } from '../config/resources.js';
import { createResourceTags } from '../utils/tags.js';
import type { Environment } from '../config/index.js';

export interface LoadBalancerResources {
  loadBalancerId: string;
  frontendIds: string[];
  backendIds: string[];
}

export class LoadBalancerStack {
  private apiLb: LB.v1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string,
    private privateNetworkId: string,
    private instanceIds: string[]
  ) {
    this.apiLb = new LB.v1.API(client);
  }

  async plan(): Promise<{
    loadBalancer: { action: 'create' | 'update' | 'no-op'; current?: unknown };
    frontends: { action: 'create' | 'update' | 'no-op'; current?: unknown }[];
    backends: { action: 'create' | 'update' | 'no-op'; current?: unknown }[];
  }> {
    const lb = await this.findLoadBalancer();
    const frontends = await this.findFrontends();
    const backends = await this.findBackends();

    return {
      loadBalancer: {
        action: lb ? 'no-op' : 'create',
        current: lb,
      },
      frontends: [
        {
          action: frontends.http ? 'no-op' : 'create',
          current: frontends.http,
        },
        {
          action: frontends.https ? 'no-op' : 'create',
          current: frontends.https,
        },
      ],
      backends: this.instanceIds.map((instanceId) => {
        const backend = backends.find((b) => b.pool.includes(instanceId));
        return {
          action: backend ? 'no-op' : 'create',
          current: backend,
        };
      }),
    };
  }

  async apply(): Promise<LoadBalancerResources> {
    const tags = createResourceTags(this.env, this.org);
    const lb = await this.ensureLoadBalancer(tags);

    // Attach to private network
    await this.apiLb.attachPrivateNetwork({
      lbId: lb.id,
      privateNetworkId: this.privateNetworkId,
      staticConfig: {
        ipAddress: [],
      },
    });

    const backendIds: string[] = [];
    for (const instanceId of this.instanceIds) {
      const backend = await this.ensureBackend(lb.id, instanceId, tags);
      backendIds.push(backend.id);
    }

    const httpFrontend = await this.ensureFrontend(
      lb.id,
      'http',
      80,
      backendIds[0] ?? '',
      tags
    );
    const httpsFrontend = await this.ensureFrontend(
      lb.id,
      'https',
      443,
      backendIds[0] ?? '',
      tags
    );

    return {
      loadBalancerId: lb.id,
      frontendIds: [httpFrontend.id, httpsFrontend.id],
      backendIds,
    };
  }

  private async findLoadBalancer() {
    try {
      const response = await this.apiLb.listLbs({
        name: this.resourceNames.loadBalancer,
      });
      return response.lbs?.[0];
    } catch {
      return null;
    }
  }

  private async findFrontends() {
    const lb = await this.findLoadBalancer();
    if (!lb) {
      return { http: null, https: null };
    }

    try {
      const response = await this.apiLb.listFrontends({
        lbId: lb.id,
      });
      const http = response.frontends?.find((f) => f.inboundPort === 80);
      const https = response.frontends?.find((f) => f.inboundPort === 443);
      return { http, https };
    } catch {
      return { http: null, https: null };
    }
  }

  private async findBackends() {
    const lb = await this.findLoadBalancer();
    if (!lb) {
      return [];
    }

    try {
      const response = await this.apiLb.listBackends({
        lbId: lb.id,
      });
      return response.backends || [];
    } catch {
      return [];
    }
  }

  private async ensureLoadBalancer(tags: Record<string, string>) {
    const existing = await this.findLoadBalancer();
    if (existing) {
      return existing;
    }

    const lb = await this.apiLb.createLb({
      name: this.resourceNames.loadBalancer,
      type: 'LB-GP-S',
      description: `Load Balancer for ${this.resourceNames.loadBalancer}`,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
    });

    return lb;
  }

  private async ensureFrontend(
    lbId: string,
    protocol: 'http' | 'https',
    port: number,
    backendId: string,
    tags: Record<string, string>
  ) {
    const frontends = await this.findFrontends();
    const existing = protocol === 'http' ? frontends.http : frontends.https;

    if (existing) {
      return existing;
    }

    const frontend = await this.apiLb.createFrontend({
      lbId,
      name: `${this.resourceNames.loadBalancer}-${protocol}`,
      inboundPort: port,
      backendId,
      enableHttp3: protocol === 'https',
    });

    return frontend;
  }

  private async ensureBackend(
    lbId: string,
    instanceId: string,
    tags: Record<string, string>
  ) {
    const backends = await this.findBackends();
    const existing = backends.find((b) => b.pool.includes(instanceId));

    if (existing) {
      return existing;
    }

    const backend = await this.apiLb.createBackend({
      lbId,
      name: `${this.resourceNames.loadBalancer}-backend-${instanceId}`,
      forwardProtocol: 'http',
      forwardPort: 3000,
      healthCheck: {
        port: 3000,
        checkMaxRetries: 3,
        checkTimeout: '10s',
        checkSendProxy: false,
        httpConfig: {
          uri: '/healthz',
          method: 'GET',
          hostHeader: '',
        },
      },
      stickySessions: 'cookie',
      serverIp: [instanceId], // This should be the private IP
    } as any);

    return backend;
  }
}
