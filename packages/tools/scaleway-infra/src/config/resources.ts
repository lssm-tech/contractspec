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
  const envSuffix = env === 'prd' ? 'prd' : 'stg';
  const baseName = `${org}-${envSuffix}`;

  return {
    vpc: `${baseName}-vpc`,
    privateNetwork: `${baseName}-vpc-pn-core`,
    publicGateway: `${baseName}-pgw-core`,
    securityGroupBackend: `sg-${org}-${envSuffix}-backend`,
    securityGroupDb: `sg-${org}-${envSuffix}-db`,
    securityGroupRedis: `sg-${org}-${envSuffix}-redis`,
    instance: (index: number) =>
      `${baseName}-instance-api-${String(index).padStart(2, '0')}`,
    postgresInstance: `${baseName}-psql-01`,
    redisInstance: `redis-${org}-${envSuffix}`,
    buckets: [
      `${baseName}-core`,
      `equitya-${envSuffix}-files`,
      `artisanos-${envSuffix}-files`,
    ],
    queues: [
      `${org}-${envSuffix}-jobs`,
      `equitya-${envSuffix}-jobs`,
      `artisanos-${envSuffix}-jobs`,
    ],
    loadBalancer: `${baseName}-lb-core`,
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
