import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, normalize } from 'node:path';

export const NAME_RE = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
export const REQUIRED_FILES = [
  '.cursor-plugin/plugin.json',
  '.mcp.json',
  'README.md',
  'assets/logo.svg',
];

function rel(context, pathValue) {
  return pathValue.replace(`${context.root}/`, '');
}

export function readJson(context, pathValue, label) {
  if (!existsSync(pathValue)) {
    context.errors.push(`${label} is missing: ${rel(context, pathValue)}`);
    return null;
  }

  try {
    return JSON.parse(readFileSync(pathValue, 'utf8'));
  } catch (error) {
    context.errors.push(`Invalid JSON in ${label}: ${String(error)}`);
    return null;
  }
}

export function isSafeRelativePath(pathValue) {
  if (
    typeof pathValue !== 'string' ||
    pathValue.trim().length === 0 ||
    isAbsolute(pathValue)
  ) {
    return false;
  }
  const normalized = normalize(pathValue).replace(/\\/g, '/');
  return !(
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.includes('/../')
  );
}

export function ensurePluginPath(context, pathValue, fieldName) {
  if (!isSafeRelativePath(pathValue)) {
    context.errors.push(
      `Manifest ${fieldName} contains unsafe path: ${String(pathValue)}`
    );
    return;
  }
  if (!existsSync(join(context.pluginDir, pathValue))) {
    context.errors.push(
      `Manifest ${fieldName} path does not exist: ${pathValue}`
    );
  }
}
