import * as z from 'zod';

export type Environment = 'prd' | 'stg';

export const EnvironmentSchema = z.enum(['prd', 'stg']);

export interface InfrastructureConfig {
  environment: Environment;
  region: string;
  zone: string;
  projectId: string;
  org: string;
}

export interface ScalewayCredentials {
  accessKey: string;
  secretKey: string;
  projectId: string;
}

export interface VercelCredentials {
  token: string;
  teamId?: string;
}

export const defaultConfig: Omit<InfrastructureConfig, 'projectId'> = {
  environment: 'prd',
  region: 'fr-par',
  zone: 'fr-par-1',
  org: 'lssm',
};

export function getConfig(env?: Environment): InfrastructureConfig {
  const environment = env || (process.env.INFRA_ENV as Environment) || 'prd';
  const projectId = process.env.SCALEWAY_PROJECT_ID || '';

  if (!projectId) {
    throw new Error('SCALEWAY_PROJECT_ID environment variable is required');
  }

  return {
    ...defaultConfig,
    environment: EnvironmentSchema.parse(environment),
    projectId,
  };
}

export function loadScalewayCredentials(): ScalewayCredentials {
  const accessKey = process.env.SCALEWAY_ACCESS_KEY;
  const secretKey = process.env.SCALEWAY_SECRET_KEY;
  const projectId = process.env.SCALEWAY_PROJECT_ID;

  if (!accessKey || !secretKey || !projectId) {
    throw new Error(
      'Missing Scaleway credentials. Required: SCALEWAY_ACCESS_KEY, SCALEWAY_SECRET_KEY, SCALEWAY_PROJECT_ID'
    );
  }

  return { accessKey, secretKey, projectId };
}

export function loadVercelCredentials(): VercelCredentials {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) {
    throw new Error('Missing Vercel credentials. Required: VERCEL_TOKEN');
  }

  return { token, teamId };
}

export { getResourceNames } from './resources';
