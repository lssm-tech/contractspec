// Library exports for programmatic usage
export { plan, formatPlan, type PlanResult } from './commands/plan';
export { apply, type ApplyResult } from './commands/apply';
export { destroy } from './commands/destroy';
export { status, formatStatus, type StatusResult } from './commands/status';

export type {
  Environment,
  InfrastructureConfig,
  ScalewayCredentials,
  VercelCredentials,
} from './config/index';
export {
  getConfig,
  loadScalewayCredentials,
  loadVercelCredentials,
  getResourceNames,
} from './config/index';
export type { ResourceNames } from './config/resources';
export { getResourceNames as getResourceNamesHelper } from './config/resources';

export {
  createScalewayClient,
  type ScalewayClient,
} from './clients/scaleway-client';
export type { Client } from '@scaleway/sdk-client';

export {
  NetworkingStack,
  type NetworkingResources,
} from './stacks/networking-stack';
export { ComputeStack, type ComputeResources } from './stacks/compute-stack';
export { DatabaseStack, type DatabaseResources } from './stacks/database-stack';
export { CacheStack, type CacheResources } from './stacks/cache-stack';
export { StorageStack, type StorageResources } from './stacks/storage-stack';
export { QueueStack, type QueueResources } from './stacks/queue-stack';
export {
  LoadBalancerStack,
  type LoadBalancerResources,
} from './stacks/loadbalancer-stack';
export { DnsStack, type DnsResources } from './stacks/dns-stack';
