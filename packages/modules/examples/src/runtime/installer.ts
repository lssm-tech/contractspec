'use client';

import { getTemplate, TEMPLATE_REGISTRY } from './registry';
import type {
  TemplateDefinition,
  TemplateFilter,
  TemplateId,
  InstallTemplateOptions,
  SaveTemplateOptions,
  SaveTemplateResult,
} from '@contractspec/lib.example-shared-ui';
import {
  ContractSpecRegistryClient,
  type RegistryTemplateSummary,
} from './registry-client';
import { web } from '@contractspec/lib.runtime-sandbox';

const { LocalRuntimeServices } = web;
type LocalRuntimeServices = InstanceType<typeof LocalRuntimeServices>;

const SAVE_TEMPLATE_MUTATION = `
  mutation SaveTemplateToStudio($input: SaveTemplateInput!) {
    saveTemplateToStudio(input: $input) {
      projectId
      status
    }
  }
`;

export interface TemplateInstallerOptions {
  runtime?: LocalRuntimeServices;
  endpoint?: string;
  /** Optional registry server base URL (enables listing remote/community templates) */
  registryUrl?: string;
  fetchImpl?: typeof fetch;
}

export class TemplateInstaller {
  private readonly runtime: LocalRuntimeServices;
  private readonly endpoint: string;
  private readonly registryUrl: string | null;
  private readonly fetchImpl: typeof fetch;

  constructor(options: TemplateInstallerOptions = {}) {
    this.runtime = options.runtime ?? new LocalRuntimeServices();
    this.endpoint = options.endpoint ?? '/api/graphql';
    this.registryUrl = options.registryUrl
      ? options.registryUrl.replace(/\/+$/, '')
      : null;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async init(): Promise<void> {
    await this.runtime.init();
  }

  list(filter?: TemplateFilter): TemplateDefinition[] {
    return filter
      ? TEMPLATE_REGISTRY.filter((template) => {
          if (filter.category && filter.category !== template.category) {
            return false;
          }
          if (filter.complexity && filter.complexity !== template.complexity) {
            return false;
          }
          if (filter.tag && !template.tags.includes(filter.tag)) {
            return false;
          }
          return true;
        })
      : TEMPLATE_REGISTRY;
  }

  /**
   * List templates published to the ContractSpec Registry.
   *
   * Note: this returns *metadata* only. Installing still requires a local template
   * implementation unless/until we support seeding templates from registry payloads.
   */
  async listRemoteTemplates(): Promise<RegistryTemplateSummary[]> {
    if (!this.registryUrl) return [];
    const client = new ContractSpecRegistryClient({
      registryUrl: this.registryUrl,
      fetchImpl: this.fetchImpl,
    });
    return await client.listTemplateSummaries();
  }

  /**
   * Resolve a registry template id to a local TemplateId if available.
   */
  resolveLocalTemplateId(id: string): TemplateId | null {
    const found = getTemplate(id as TemplateId);
    return found ? (id as TemplateId) : null;
  }

  get(templateId: TemplateId): TemplateDefinition | undefined {
    return getTemplate(templateId);
  }

  async install(
    templateId: TemplateId,
    options: InstallTemplateOptions = {}
  ): Promise<void> {
    await this.runtime.seedTemplate({
      templateId,
      projectId: options.projectId,
    });
  }

  async saveToStudio(
    options: SaveTemplateOptions
  ): Promise<SaveTemplateResult> {
    const snapshot = await this.runtime.db.export();
    const payload = toBase64(snapshot);
    const response = await this.fetchImpl(options.endpoint ?? this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: JSON.stringify({
        query: SAVE_TEMPLATE_MUTATION,
        variables: {
          input: {
            templateId: options.templateId,
            projectName: options.projectName,
            organizationId: options.organizationId,
            payload,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save template: ${response.status} ${response.statusText}`
      );
    }

    const json = (await response.json()) as {
      data?: {
        saveTemplateToStudio: SaveTemplateResult;
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      throw new Error(json.errors[0]?.message ?? 'Unknown error');
    }

    if (!json.data?.saveTemplateToStudio) {
      throw new Error('Invalid response from Studio API');
    }

    return json.data.saveTemplateToStudio;
  }
}

function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary);
}
