import { Instancev1 } from '@scaleway/sdk-instance';
import type { ScalewayClient } from '../clients/scaleway-client';
import type { ResourceNames } from '../config/resources';
import { instanceConfig } from '../config/resources';
import { createResourceTags } from '../utils/tags';
import type { Environment } from '../config/index';

export interface ComputeResources {
  instanceIds: string[];
}

export class ComputeStack {
  private apiInstance: Instancev1.API;

  constructor(
    private client: ScalewayClient,
    private resourceNames: ResourceNames,
    private env: Environment,
    private org: string,
    private privateNetworkId: string,
    private securityGroupId: string
  ) {
    this.apiInstance = new Instancev1.API(client);
  }

  async plan(): Promise<{
    instances: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[];
  }> {
    const instances: {
      name: string;
      action: 'create' | 'update' | 'no-op';
      current?: unknown;
    }[] = [];
    const instanceCount = this.env === 'prd' ? 1 : 1; // Start with 1, can scale later

    for (let i = 1; i <= instanceCount; i++) {
      const name = this.resourceNames.instance(i);
      const existing = await this.findInstance(name);
      instances.push({
        name,
        action: existing ? 'no-op' : 'create',
        current: existing,
      });
    }

    return { instances };
  }

  async apply(): Promise<ComputeResources> {
    const tags = createResourceTags(this.env, this.org);
    const instanceCount = this.env === 'prd' ? 1 : 1;
    const instanceIds: string[] = [];

    for (let i = 1; i <= instanceCount; i++) {
      const name = this.resourceNames.instance(i);
      const instance = await this.ensureInstance(name, tags);
      if (instance) {
        instanceIds.push(instance.id);
      }
    }

    return { instanceIds };
  }

  private async findInstance(name: string) {
    try {
      const response = await this.apiInstance.listServers({
        name,
      });
      return response.servers?.[0];
    } catch {
      return null;
    }
  }

  private async ensureInstance(name: string, tags: Record<string, string>) {
    const existing = await this.findInstance(name);
    if (existing) {
      return existing;
    }

    // const userData = this.generateUserData(name);

    const instanceResponse = await this.apiInstance.createServer({
      protected: false,
      name,
      commercialType: instanceConfig.type,
      image: instanceConfig.image,
      tags: Object.entries(tags).map(([k, v]) => `${k}=${v}`),
      enableIpv6: false,
      // No public IP, traffic via LB only
      securityGroup: this.securityGroupId,
    });

    if (!instanceResponse.server) {
      throw new Error('Failed to create server');
    }

    // Attach to private network after creation
    // Note: Private network attachment is done via Instance API's setServerPrivateNetworks method
    // For now, we'll skip this as it requires the Instance API to support it
    // In production, you would use: await this.apiInstance.setServerPrivateNetworks({ serverId, privateNetworkIds: [this.privateNetworkId] })

    // Set user data via update (if supported) or use cloud-init script separately
    // Note: User data might need to be set via a different method or during image creation

    // Get the created instance to return full Server object
    const instance = await this.apiInstance.getServer({
      serverId: instanceResponse.server.id,
    });

    if (!instance.server) {
      throw new Error('Failed to retrieve server');
    }

    return instance.server;
  }

  private generateUserData(hostname: string): string {
    return `#!/bin/bash
# Set hostname
hostnamectl set-hostname ${hostname}

# Update system
apt-get update -y
apt-get upgrade -y

# Install Bun
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

# Create application directory
mkdir -p /srv/lssm
chown -R lssm:lssm /srv/lssm

# Create systemd service files
cat > /etc/systemd/system/lssm-api.service << 'EOF'
[Unit]
Description=LSSM API Service
After=network.target

[Service]
Type=simple
User=lssm
WorkingDirectory=/srv/lssm
EnvironmentFile=/etc/lssm/backend.env
ExecStart=/home/lssm/.bun/bin/bun run start:api
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/lssm-worker.service << 'EOF'
[Unit]
Description=LSSM Worker Service
After=network.target

[Service]
Type=simple
User=lssm
WorkingDirectory=/srv/lssm
EnvironmentFile=/etc/lssm/backend.env
ExecStart=/home/lssm/.bun/bin/bun run start:worker
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Create environment file directory
mkdir -p /etc/lssm

# Reload systemd
systemctl daemon-reload
systemctl enable lssm-api lssm-worker
`;
  }
}
