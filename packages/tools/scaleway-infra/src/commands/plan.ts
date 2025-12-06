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

export interface PlanResult {
  networking: Awaited<ReturnType<NetworkingStack['plan']>>;
  compute: Awaited<ReturnType<ComputeStack['plan']>>;
  database: Awaited<ReturnType<DatabaseStack['plan']>>;
  cache: Awaited<ReturnType<CacheStack['plan']>>;
  storage: Awaited<ReturnType<StorageStack['plan']>>;
  queues: Awaited<ReturnType<QueueStack['plan']>>;
  loadBalancer: Awaited<ReturnType<LoadBalancerStack['plan']>>;
  dns: Awaited<ReturnType<DnsStack['plan']>>;
}

export async function plan(env?: string): Promise<PlanResult> {
  const config = getConfig(env as 'prd' | 'stg');
  const credentials = loadScalewayCredentials();
  const client = createScalewayClient(credentials, config.region, config.zone);
  const resourceNames = getResourceNames(config.environment, config.org);

  // Initialize stacks
  const networkingStack = new NetworkingStack(
    client,
    resourceNames,
    config.environment,
    config.org
  );

  const networkingPlan = await networkingStack.plan();

  // For plan, we use placeholder IDs since resources may not exist yet
  const placeholderPnId = 'pending';
  const placeholderSgBackendId = 'pending';
  const placeholderSgDbId = 'pending';
  const placeholderSgRedisId = 'pending';

  const computeStack = new ComputeStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    placeholderPnId,
    placeholderSgBackendId
  );

  const databaseStack = new DatabaseStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    placeholderPnId,
    placeholderSgDbId
  );

  const cacheStack = new CacheStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    placeholderPnId,
    placeholderSgRedisId
  );

  const storageStack = new StorageStack(
    client,
    resourceNames,
    config.environment,
    config.org
  );

  const queueStack = new QueueStack(
    client,
    resourceNames,
    config.environment,
    config.org
  );

  const computePlan = await computeStack.plan();
  const databasePlan = await databaseStack.plan();
  const cachePlan = await cacheStack.plan();
  const storagePlan = await storageStack.plan();
  const queuesPlan = await queueStack.plan();

  const loadBalancerStack = new LoadBalancerStack(
    client,
    resourceNames,
    config.environment,
    config.org,
    placeholderPnId,
    computePlan.instances.map((i) => i.name)
  );

  const loadBalancerPlan = await loadBalancerStack.plan();

  const dnsStack = new DnsStack(
    client,
    resourceNames,
    config.environment,
    config.org
  );

  const dnsPlan = await dnsStack.plan();

  return {
    networking: networkingPlan,
    compute: computePlan,
    database: databasePlan,
    cache: cachePlan,
    storage: storagePlan,
    queues: queuesPlan,
    loadBalancer: loadBalancerPlan,
    dns: dnsPlan,
  };
}

export function formatPlan(planResult: PlanResult): string {
  const lines: string[] = [];
  lines.push('Infrastructure Plan');
  lines.push('='.repeat(50));
  lines.push('');

  // Networking
  lines.push('Networking:');
  lines.push(`  VPC: ${planResult.networking.vpc.action}`);
  lines.push(
    `  Private Network: ${planResult.networking.privateNetwork.action}`
  );
  lines.push(`  Public Gateway: ${planResult.networking.publicGateway.action}`);
  const backendSg = planResult.networking.securityGroups.backend;
  const dbSg = planResult.networking.securityGroups.db;
  const redisSg = planResult.networking.securityGroups.redis;
  if (backendSg) {
    lines.push(`  Security Group (Backend): ${backendSg.action}`);
  }
  if (dbSg) {
    lines.push(`  Security Group (DB): ${dbSg.action}`);
  }
  if (redisSg) {
    lines.push(`  Security Group (Redis): ${redisSg.action}`);
  }
  lines.push('');

  // Compute
  lines.push('Compute:');
  for (const instance of planResult.compute.instances) {
    lines.push(`  Instance ${instance.name}: ${instance.action}`);
  }
  lines.push('');

  // Database
  lines.push('Database:');
  lines.push(`  Instance: ${planResult.database.instance.action}`);
  for (const db of planResult.database.databases) {
    lines.push(`  Database ${db.name}: ${db.action}`);
  }
  lines.push('');

  // Cache
  lines.push('Cache:');
  lines.push(`  Redis Instance: ${planResult.cache.instance.action}`);
  lines.push('');

  // Storage
  lines.push('Storage:');
  for (const bucket of planResult.storage.buckets) {
    lines.push(`  Bucket ${bucket.name}: ${bucket.action}`);
  }
  lines.push('');

  // Queues
  lines.push('Queues:');
  for (const queue of planResult.queues.queues) {
    lines.push(`  Queue ${queue.name}: ${queue.action}`);
  }
  lines.push('');

  // Load Balancer
  lines.push('Load Balancer:');
  lines.push(`  LB: ${planResult.loadBalancer.loadBalancer.action}`);
  lines.push(
    `  Frontend (HTTP): ${planResult.loadBalancer.frontends[0]?.action}`
  );
  lines.push(
    `  Frontend (HTTPS): ${planResult.loadBalancer.frontends[1]?.action}`
  );
  for (const backend of planResult.loadBalancer.backends) {
    lines.push(`  Backend: ${backend.action}`);
  }
  lines.push('');

  // DNS
  lines.push('DNS:');
  for (const zone of planResult.dns.zones) {
    lines.push(`  Zone ${zone.name}: ${zone.action}`);
  }
  for (const record of planResult.dns.records) {
    lines.push(`  Record ${record.name}: ${record.action}`);
  }

  return lines.join('\n');
}
