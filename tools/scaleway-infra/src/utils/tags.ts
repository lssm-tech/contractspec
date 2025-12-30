import type { Environment } from '../config/index';

export interface ResourceTags {
  'managed-by': string;
  environment: Environment;
  org: string;
  project: string;
  [key: string]: string;
}

export function createResourceTags(
  env: Environment,
  org = 'lssm',
  project = 'contractspec'
): ResourceTags {
  return {
    'managed-by': 'scaleway-infra',
    environment: env,
    org,
    project,
  };
}

export function mergeTags(
  base: ResourceTags,
  additional: Record<string, string>
): ResourceTags {
  return { ...base, ...additional };
}
