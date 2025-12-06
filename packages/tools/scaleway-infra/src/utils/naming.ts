import type { Environment } from '../config/index';

export function formatResourceName(
  org: string,
  env: Environment,
  role: string,
  index?: number
): string {
  const envSuffix = env === 'prod' ? 'prod' : 'stg';
  const indexSuffix =
    index !== undefined ? `-${String(index).padStart(2, '0')}` : '';
  return `${org}-${envSuffix}-${role}${indexSuffix}`;
}

export function parseResourceName(name: string): {
  org: string;
  env: Environment;
  role: string;
  index?: number;
} | null {
  const parts = name.split('-');
  if (parts.length < 3) {
    return null;
  }

  const org = parts[0] ?? '';
  const envPart = parts[1];
  const env: Environment | null =
    envPart === 'prod' ? 'prod' : envPart === 'stg' ? 'stg' : null;

  if (!env || !org) {
    return null;
  }

  const role = parts.slice(2).join('-');
  const indexMatch = role.match(/-(\d+)$/);
  const index =
    indexMatch && indexMatch[1] ? parseInt(indexMatch[1], 10) : undefined;
  const cleanRole = indexMatch ? role.replace(/-(\d+)$/, '') : role;

  return { org, env, role: cleanRole, index };
}

export function validateResourceName(name: string): boolean {
  return parseResourceName(name) !== null;
}
