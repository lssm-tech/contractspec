// Library exports for programmatic usage
export { plan, formatPlan, type PlanResult } from './commands/plan.js';
export { apply, type ApplyResult } from './commands/apply.js';
export { destroy } from './commands/destroy.js';
export { status, formatStatus, type StatusResult } from './commands/status.js';

export type {
  Environment,
  InfrastructureConfig,
  ScalewayCredentials,
  VercelCredentials,
} from './config/index.js';
export {
  getConfig,
  loadScalewayCredentials,
  loadVercelCredentials,
  getResourceNames,
} from './config/index.js';
export type { ResourceNames } from './config/resources.js';
export { getResourceNames as getResourceNamesHelper } from './config/resources.js';

export { createScalewayClient, type ScalewayClient } from './clients/scaleway-client.js';
export type { Client } from '@scaleway/sdk';

export {
  NetworkingStack,
  type NetworkingResources,
} from './stacks/networking-stack.js';
export { ComputeStack, type ComputeResources } from './stacks/compute-stack.js';
export {
  DatabaseStack,
  type DatabaseResources,
} from './stacks/database-stack.js';
export { CacheStack, type CacheResources } from './stacks/cache-stack.js';
export { StorageStack, type StorageResources } from './stacks/storage-stack.js';
export { QueueStack, type QueueResources } from './stacks/queue-stack.js';
export {
  LoadBalancerStack,
  type LoadBalancerResources,
} from './stacks/loadbalancer-stack.js';
export { DnsStack, type DnsResources } from './stacks/dns-stack.js';
