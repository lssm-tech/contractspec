import type { Environment } from './index';

export interface ResourceNames {
  vpc: string;
  privateNetwork: string;
  publicGateway: string;
  securityGroupBackend: string;
  securityGroupDb: string;
  securityGroupRedis: string;
  instance: (index: number) => string;
  postgresInstance: string;
  redisInstance: string;
  buckets: string[];
  queues: string[];
  loadBalancer: string;
  dnsZones: string[];
}

export function getResourceNames(
  env: Environment,
  org = 'lssm'
): ResourceNames {
  const envSuffix = env === 'prod' ? 'prod' : 'stg';

  return {
    vpc: `vpc-${org}-${envSuffix}`,
    privateNetwork: `pn-${org}-${envSuffix}-core`,
    publicGateway: `pgw-${org}-${envSuffix}-core`,
    securityGroupBackend: `sg-${org}-${envSuffix}-backend`,
    securityGroupDb: `sg-${org}-${envSuffix}-db`,
    securityGroupRedis: `sg-${org}-${envSuffix}-redis`,
    instance: (index: number) =>
      `${org}-${envSuffix}-core-${String(index).padStart(2, '0')}`,
    postgresInstance: `pg-${org}-${envSuffix}`,
    redisInstance: `redis-${org}-${envSuffix}`,
    buckets: [
      `${org}-${envSuffix}-core`,
      `equitya-${envSuffix}-files`,
      `artisanos-${envSuffix}-files`,
    ],
    queues: [
      `${org}-${envSuffix}-jobs`,
      `equitya-${envSuffix}-jobs`,
      `artisanos-${envSuffix}-jobs`,
    ],
    loadBalancer: `lb-${org}-${envSuffix}`,
    dnsZones: ['lssm.tech', 'lssm.world', 'lssm.community', 'lssm.cash'],
  };
}

export interface DatabaseConfig {
  name: string;
  tier: 'PICO' | 'DEV-S' | 'DEV-M';
}

export interface RedisConfig {
  tier: string;
  nodeType: string;
}

export interface InstanceConfig {
  type: string;
  image: string;
  os: string;
}

export const databaseConfig: DatabaseConfig = {
  name: 'contractspec_engine',
  tier: 'PICO',
};

export const redisConfig: RedisConfig = {
  tier: 'dev',
  nodeType: 'DEV1-M',
};

export const instanceConfig: InstanceConfig = {
  type: 'DEV1-M',
  image: 'debian_bookworm',
  os: 'Debian 12',
};

export const databases = [
  'contractspec_engine',
  'equitya',
  'artisanos',
] as const;

export type DatabaseName = (typeof databases)[number];
