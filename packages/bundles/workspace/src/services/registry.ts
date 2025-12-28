/**
 * Registry service - interacts with ContractSpec registry.
 */

import type { LoggerAdapter } from '../ports/logger';

/**
 * Registry client options.
 */
export interface RegistryClientOptions {
  registryUrl: string;
}

/**
 * Registry client for interacting with ContractSpec registry.
 */
export class RegistryClient {
  private readonly registryUrl: string;

  constructor(opts: RegistryClientOptions) {
    this.registryUrl = opts.registryUrl.replace(/\/+$/, '');
  }

  /**
   * Make GET request to registry.
   */
  async getJson<T>(path: string): Promise<T> {
    const url = `${this.registryUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    let res: Response;

    try {
      res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (error) {
      throw new Error(
        `Registry request failed: ${url} (${error instanceof Error ? error.message : String(error)})`
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `Registry request failed: ${res.status} ${res.statusText} ${text}`
      );
    }

    return (await res.json()) as T;
  }
}

/**
 * Resolve registry URL from options or environment.
 */
export function resolveRegistryUrl(cliRegistryUrl?: string): string {
  return (
    cliRegistryUrl ||
    process.env.CONTRACTSPEC_REGISTRY_URL ||
    'http://localhost:8090'
  );
}

/**
 * Add spec to registry.
 */
export async function addToRegistry(
  specPath: string,
  options: { registryUrl?: string },
  adapters: { logger: LoggerAdapter }
): Promise<void> {
  const { logger } = adapters;
  const registryUrl = resolveRegistryUrl(options.registryUrl);

  logger.info(`Adding spec to registry: ${specPath}`, { registryUrl });

  const client = new RegistryClient({ registryUrl });

  // Implementation depends on registry API
  // This is a placeholder
  await client.getJson(`/specs/add?path=${encodeURIComponent(specPath)}`);

  logger.info('Spec added to registry successfully');
}

/**
 * List specs from registry.
 */
export async function listFromRegistry(
  options: { registryUrl?: string; filter?: string },
  adapters: { logger: LoggerAdapter }
): Promise<unknown[]> {
  const { logger } = adapters;
  const registryUrl = resolveRegistryUrl(options.registryUrl);

  logger.info('Listing specs from registry', { registryUrl });

  const client = new RegistryClient({ registryUrl });

  const filter = options.filter
    ? `?filter=${encodeURIComponent(options.filter)}`
    : '';
  const specs = await client.getJson<unknown[]>(`/specs${filter}`);

  logger.info(`Found ${specs.length} specs`);

  return specs;
}

/**
 * Search registry for specs.
 */
export async function searchRegistry(
  query: string,
  options: { registryUrl?: string },
  adapters: { logger: LoggerAdapter }
): Promise<unknown[]> {
  const { logger } = adapters;
  const registryUrl = resolveRegistryUrl(options.registryUrl);

  logger.info(`Searching registry: ${query}`, { registryUrl });

  const client = new RegistryClient({ registryUrl });

  const results = await client.getJson<unknown[]>(
    `/specs/search?q=${encodeURIComponent(query)}`
  );

  logger.info(`Found ${results.length} results`);

  return results;
}
