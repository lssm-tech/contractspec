import { getErrorMessage } from '../../utils/errors';

export type RegistryClientOptions = {
  registryUrl: string;
};

export class RegistryClient {
  private readonly registryUrl: string;

  constructor(opts: RegistryClientOptions) {
    this.registryUrl = opts.registryUrl.replace(/\/+$/, '');
  }

  async getJson<T>(path: string): Promise<T> {
    const url = `${this.registryUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (error) {
      throw new Error(`Registry request failed: ${url} (${getErrorMessage(error)})`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Registry request failed: ${res.status} ${res.statusText} ${text}`);
    }

    return (await res.json()) as T;
  }
}

export function resolveRegistryUrl(cliRegistryUrl?: string): string {
  return (
    cliRegistryUrl ||
    process.env.CONTRACTSPEC_REGISTRY_URL ||
    'http://localhost:8090'
  );
}


