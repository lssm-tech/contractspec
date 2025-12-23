import { mkdir, writeFile } from 'fs/promises';
import { dirname, join, isAbsolute } from 'path';
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
    | 'app-config'
    | 'integration'
    | 'knowledge',
  conventions: Record<string, unknown>,
  fileName: string
): string {
  let subPath: string;

  switch (specType) {
    case 'operation':
      subPath = (conventions.operations as string) || 'interactions';
      break;
    case 'event':
      subPath = (conventions.events as string) || 'events';
      break;
    case 'presentation':
      subPath = (conventions.presentations as string) || 'presentations';
      break;
    case 'form':
      subPath = (conventions.forms as string) || 'forms';
      break;
    case 'feature':
      subPath = 'features';
      break;
    case 'workflow':
      subPath = (conventions.workflows as string) || 'workflows';
      break;
    case 'data-view':
      subPath =
        (conventions['data-views'] as string) ||
        (conventions.dataViews as string) ||
        'data-views';
      break;
    case 'migration':
      subPath = (conventions.migrations as string) || 'migrations';
      break;
    case 'telemetry':
      subPath = (conventions.telemetry as string) || 'telemetry';
      break;
    case 'experiment':
      subPath = (conventions.experiments as string) || 'experiments';
      break;
    case 'app-config':
      subPath = (conventions.appConfig as string) || 'app-config';
      break;
    case 'integration':
      subPath = (conventions.integrations as string) || 'integrations';
      break;
    case 'knowledge':
      subPath = (conventions.knowledge as string) || 'knowledge';
      break;
    default:
      subPath = '';
  }

  return join(basePath, subPath, fileName);
}

/**
 * Generate unique filename to avoid conflicts
 */
export function generateFileName(baseName: string, extension = '.ts'): string {
  // Convert camelCase or dot notation to kebab-case
  const kebab = baseName
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  return `${kebab}${extension}`;
}

export function resolvePathFromCwd(targetPath: string): string {
  return isAbsolute(targetPath) ? targetPath : join(process.cwd(), targetPath);
}
