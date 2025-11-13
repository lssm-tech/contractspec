import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

/**
 * Ensure directory exists, creating it if necessary
 */
export async function ensureDir(path: string): Promise<void> {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

/**
 * Write file, creating parent directories if needed
 */
export async function writeFileSafe(
  filePath: string,
  content: string
): Promise<void> {
  const dir = dirname(filePath);
  await ensureDir(dir);
  await writeFile(filePath, content, 'utf-8');
}

/**
 * Resolve output path based on config and spec type
 */
export function resolveOutputPath(
  basePath: string,
  specType:
    | 'operation'
    | 'event'
    | 'presentation'
    | 'form'
    | 'feature'
    | 'workflow'
    | 'data-view'
    | 'migration'
    | 'telemetry'
    | 'experiment'
    | 'app-config',
  conventions: Record<string, string>,
  fileName: string
): string {
  let subPath: string;
  
  switch (specType) {
    case 'operation':
      subPath = conventions.operations || 'interactions';
      break;
    case 'event':
      subPath = conventions.events || 'events';
      break;
    case 'presentation':
      subPath = conventions.presentations || 'presentations';
      break;
    case 'form':
      subPath = conventions.forms || 'forms';
      break;
    case 'feature':
      subPath = 'features';
      break;
    case 'workflow':
      subPath = conventions.workflows || 'workflows';
      break;
    case 'data-view':
      subPath = conventions['data-views'] || conventions.dataViews || 'data-views';
      break;
    case 'migration':
      subPath = conventions.migrations || 'migrations';
      break;
    case 'telemetry':
      subPath = conventions.telemetry || 'telemetry';
      break;
    case 'experiment':
      subPath = conventions.experiments || 'experiments';
      break;
    case 'app-config':
      subPath = conventions.appConfig || 'app-config';
      break;
    default:
      subPath = '';
  }
  
  return join(basePath, subPath, fileName);
}

/**
 * Generate unique filename to avoid conflicts
 */
export function generateFileName(
  baseName: string,
  extension: string = '.ts'
): string {
  // Convert camelCase or dot notation to kebab-case
  const kebab = baseName
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  return `${kebab}${extension}`;
}

