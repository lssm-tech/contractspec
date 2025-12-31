import type {
  ContractRegistryItem,
  ContractRegistryItemType,
  ContractRegistryManifest,
} from '@contractspec/lib.contracts';

export interface RegistryTemplateSummary {
  id: string;
  title: string;
  description: string;
  version: string;
  tags: string[];
  source: 'registry';
}

export interface RegistryClientOptions {
  registryUrl: string;
  fetchImpl?: typeof fetch;
}

export class ContractSpecRegistryClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RegistryClientOptions) {
    this.baseUrl = options.registryUrl.replace(/\/+$/, '');
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getManifest(): Promise<ContractRegistryManifest> {
    const res = await this.fetchImpl(`${this.baseUrl}/r/contractspec.json`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(
        `Registry manifest fetch failed: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()) as ContractRegistryManifest;
  }

  async listByType(
    type: ContractRegistryItemType
  ): Promise<ContractRegistryItem[]> {
    const manifest = await this.getManifest();
    return manifest.items.filter((i) => i.type === type);
  }

  async listTemplateSummaries(): Promise<RegistryTemplateSummary[]> {
    const templates = await this.listByType('contractspec:template');
    return templates.map((t) => ({
      id: t.key,
      title: t.title,
      description: t.description,
      version: t.version,
      tags: t.meta.tags,
      source: 'registry',
    }));
  }

  async getItem(
    typeSegment: string,
    name: string
  ): Promise<ContractRegistryItem> {
    const res = await this.fetchImpl(
      `${this.baseUrl}/r/contractspec/${typeSegment}/${name}.json`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    );
    if (!res.ok) {
      throw new Error(
        `Registry item fetch failed: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()) as ContractRegistryItem;
  }
}
