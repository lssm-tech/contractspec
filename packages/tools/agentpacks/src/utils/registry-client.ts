/**
 * HTTP client for the agentpacks pack registry API.
 * Handles search, info, download, publish, and auth operations.
 */

const DEFAULT_REGISTRY_URL = 'https://registry.agentpacks.dev';

/**
 * Registry API client configuration.
 */
export interface RegistryClientConfig {
  /** Base URL of the registry API */
  registryUrl: string;
  /** Bearer token for authenticated operations */
  authToken?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Pack search result from the registry.
 */
export interface RegistryPackResult {
  name: string;
  displayName: string;
  description: string;
  author: string;
  downloads: number;
  weeklyDownloads: number;
  tags: string[];
  targets: string[];
  features: string[];
  verified: boolean;
  featured: boolean;
  latestVersion: string;
  updatedAt: string;
}

/**
 * Detailed pack info from the registry.
 */
export interface RegistryPackInfo extends RegistryPackResult {
  longDescription?: string;
  license: string;
  homepage?: string;
  repository?: string;
  versions: {
    version: string;
    createdAt: string;
    fileCount: number;
    tarballSize: number;
  }[];
  readme?: string;
}

/**
 * Search parameters.
 */
export interface SearchParams {
  query?: string;
  tags?: string[];
  targets?: string[];
  features?: string[];
  author?: string;
  sort?: 'downloads' | 'updated' | 'name' | 'weekly';
  limit?: number;
  offset?: number;
}

/**
 * Publish result.
 */
export interface PublishResult {
  name: string;
  version: string;
  integrity: string;
}

/**
 * Create a registry client with the given configuration.
 */
export function createRegistryClient(
  config?: Partial<RegistryClientConfig>
): RegistryClient {
  return new RegistryClient({
    registryUrl: config?.registryUrl ?? DEFAULT_REGISTRY_URL,
    authToken: config?.authToken,
    timeout: config?.timeout ?? 30_000,
  });
}

/**
 * Registry API client.
 */
export class RegistryClient {
  private config: Required<Omit<RegistryClientConfig, 'authToken'>> & {
    authToken?: string;
  };

  constructor(config: RegistryClientConfig) {
    this.config = {
      registryUrl: config.registryUrl.replace(/\/+$/, ''),
      authToken: config.authToken,
      timeout: config.timeout ?? 30_000,
    };
  }

  /**
   * Search for packs in the registry.
   */
  async search(params: SearchParams): Promise<{
    packs: RegistryPackResult[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('q', params.query);
    if (params.tags?.length) searchParams.set('tags', params.tags.join(','));
    if (params.targets?.length)
      searchParams.set('targets', params.targets.join(','));
    if (params.features?.length)
      searchParams.set('features', params.features.join(','));
    if (params.author) searchParams.set('author', params.author);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.offset) searchParams.set('offset', String(params.offset));

    const url = `${this.config.registryUrl}/packs?${searchParams.toString()}`;
    const res = await this.fetch(url);
    return res as { packs: RegistryPackResult[]; total: number };
  }

  /**
   * Get detailed pack info.
   */
  async info(packName: string): Promise<RegistryPackInfo> {
    const url = `${this.config.registryUrl}/packs/${encodeURIComponent(packName)}`;
    const res = await this.fetch(url);
    return res as RegistryPackInfo;
  }

  /**
   * Download a pack tarball. Returns the raw ArrayBuffer.
   */
  async download(
    packName: string,
    version = 'latest'
  ): Promise<{ data: ArrayBuffer; integrity: string }> {
    const url = `${this.config.registryUrl}/packs/${encodeURIComponent(packName)}/versions/${encodeURIComponent(version)}/download`;
    const response = await fetch(url, {
      headers: this.headers(),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      throw new RegistryApiError(
        response.status,
        `Failed to download ${packName}@${version}: ${response.statusText}`
      );
    }

    const integrity = response.headers.get('x-integrity') ?? '';
    const data = await response.arrayBuffer();
    return { data, integrity };
  }

  /**
   * Publish a pack tarball to the registry.
   */
  async publish(
    tarball: ArrayBuffer,
    metadata: {
      name: string;
      version: string;
      manifest: Record<string, unknown>;
    }
  ): Promise<PublishResult> {
    if (!this.config.authToken) {
      throw new Error('Authentication required. Run `agentpacks login` first.');
    }

    const formData = new FormData();
    formData.append(
      'tarball',
      new Blob([tarball], { type: 'application/gzip' }),
      `${metadata.name}-${metadata.version}.tgz`
    );
    formData.append('metadata', JSON.stringify(metadata));

    const url = `${this.config.registryUrl}/packs`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.authToken}`,
      },
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new RegistryApiError(
        response.status,
        `Publish failed: ${body || response.statusText}`
      );
    }

    return (await response.json()) as PublishResult;
  }

  /**
   * Get featured packs.
   */
  async featured(limit?: number): Promise<RegistryPackResult[]> {
    const url = limit
      ? `${this.config.registryUrl}/featured?limit=${limit}`
      : `${this.config.registryUrl}/featured`;
    const res = await this.fetch(url);
    return (res as { packs: RegistryPackResult[] }).packs;
  }

  /**
   * Get available tags.
   */
  async tags(): Promise<{ tag: string; count: number }[]> {
    const url = `${this.config.registryUrl}/tags`;
    const res = await this.fetch(url);
    return (res as { tags: { tag: string; count: number }[] }).tags;
  }

  /**
   * Get registry stats.
   */
  async stats(): Promise<{
    totalPacks: number;
    totalDownloads: number;
    totalVersions: number;
  }> {
    const url = `${this.config.registryUrl}/stats`;
    return (await this.fetch(url)) as {
      totalPacks: number;
      totalDownloads: number;
      totalVersions: number;
    };
  }

  /**
   * Health check.
   */
  async health(): Promise<boolean> {
    try {
      const url = `${this.config.registryUrl}/health`;
      await this.fetch(url);
      return true;
    } catch {
      return false;
    }
  }

  /** Internal fetch helper with timeout and error handling. */
  private async fetch(url: string): Promise<unknown> {
    const response = await fetch(url, {
      headers: this.headers(),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new RegistryApiError(response.status, body || response.statusText);
    }

    return response.json();
  }

  /** Build headers for requests. */
  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/json',
    };
    if (this.config.authToken) {
      h['Authorization'] = `Bearer ${this.config.authToken}`;
    }
    return h;
  }
}

/**
 * Registry API error with HTTP status code.
 */
export class RegistryApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'RegistryApiError';
    this.status = status;
  }
}
