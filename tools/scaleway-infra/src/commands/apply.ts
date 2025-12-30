import { Lb } from '@scaleway/sdk';
import { type Client } from '@scaleway/sdk-client';
import { createScalewayClient } from '../clients/scaleway-client';
import {
  getConfig,
  getResourceNames,
  loadScalewayCredentials,
} from '../config/index';
import { NetworkingStack } from '../stacks/networking-stack';
import { ComputeStack } from '../stacks/compute-stack';
import { DatabaseStack } from '../stacks/database-stack';
import { CacheStack } from '../stacks/cache-stack';
import { StorageStack } from '../stacks/storage-stack';
import { QueueStack } from '../stacks/queue-stack';
import { LoadBalancerStack } from '../stacks/loadbalancer-stack';
import { DnsStack } from '../stacks/dns-stack';

export interface ApplyResult {
  networking: Awaited<ReturnType<NetworkingStack['apply']>>;
  compute: Awaited<ReturnType<ComputeStack['apply']>>;
  database: Awaited<ReturnType<DatabaseStack['apply']>>;
  cache: Awaited<ReturnType<CacheStack['apply']>>;
  storage: Awaited<ReturnType<StorageStack['apply']>>;
  queues: Awaited<ReturnType<QueueStack['apply']>>;
  loadBalancer: Awaited<ReturnType<LoadBalancerStack['apply']>>;
  dns: Awaited<ReturnType<DnsStack['apply']>>;
}

export async function apply(
  env?: string,
  _autoApprove = false
): Promise<ApplyResult> {
  const config = getConfig(env as 'prd' | 'stg');
  const credentials = loadScalewayCredentials();
  const client = createScalewayClient(credentials, config.region, config.zone);
  const resourceNames = getResourceNames(config.environment, config.org);

  console.log(`Applying infrastructure for environment: ${config.environment}`);

  // Step 1: Networking (foundation)
  console.log('Creating networking resources...');
  const networkingStack = new NetworkingStack(
    client,
    resourceNames,
    config.environment,
    config.org
  );
  const networkingResult = await networkingStack.apply();
  const {
    privateNetworkId,
    securityGroupDbId,
    securityGroupRedisId,
    securityGroupBackendId,
  } = networkingResult;

  if (
    !privateNetworkId ||
    !securityGroupDbId ||
    !securityGroupRedisId ||
    !securityGroupBackendId
  ) {
    throw new Error('Failed to create networking resources');
  }

  // Step 2: Managed services (can be created in parallel with compute)
  console.log('Creating managed services...');
  const [databaseResult, cacheResult] = await Promise.all([
    (async () => {
      const stack = new DatabaseStack(
        client,
        resourceNames,
        config.environment,
        config.org,
        privateNetworkId,
        securityGroupDbId
      );
      return stack.apply();
    })(),
    (async () => {
      const stack = new CacheStack(
        client,
        resourceNames,
        config.environment,
        config.org,
        privateNetworkId,
        securityGroupRedisId
      );
      return stack.apply();
    })(),
  ]);

  // Step 3: Compute
  console.log('Creating compute resources...');
  const computeStack = new ComputeStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    privateNetworkId,
    securityGroupBackendId
  );
  const computeResult = await computeStack.apply();

  // Step 4: Storage and Queues (independent)
  console.log('Creating storage and queues...');
  const [storageResult, queuesResult] = await Promise.all([
    (async () => {
      const stack = new StorageStack(
        client,
        resourceNames,
        config.environment,
        config.org
      );
      return stack.apply();
    })(),
    (async () => {
      const stack = new QueueStack(
        client,
        resourceNames,
        config.environment,
        config.org
      );
      return stack.apply();
    })(),
  ]);

  // Step 5: Load Balancer (depends on compute)
  console.log('Creating load balancer...');
  const loadBalancerStack = new LoadBalancerStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    privateNetworkId,
    computeResult.instanceIds
  );
  const loadBalancerResult = await loadBalancerStack.apply();

  // Step 6: DNS (depends on load balancer IP)
  console.log('Creating DNS records...');
  // Note: We need to get the Lb IP first
  const lbIp = await getLoadBalancerIp(
    client,
    loadBalancerResult.loadBalancerId
  );
  const dnsStack = new DnsStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    lbIp
  );
  const dnsResult = await dnsStack.apply();

  console.log('Infrastructure applied successfully!');

  return {
    networking: networkingResult,
    compute: computeResult,
    database: databaseResult,
    cache: cacheResult,
    storage: storageResult,
    queues: queuesResult,
    loadBalancer: loadBalancerResult,
    dns: dnsResult,
  };
}

async function getLoadBalancerIp(
  client: Client,
  lbId: string
): Promise<string> {
  const apiLb = new Lb.v1.API(client);
  try {
    const lb = await apiLb.getLb({ lbId });
    return lb.ip?.[0]?.ipAddress || '';
  } catch {
    return '';
  }
}
