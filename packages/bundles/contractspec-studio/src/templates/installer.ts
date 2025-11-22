import { LocalRuntimeServices } from '@lssm/lib.runtime-local';

import {
  TEMPLATE_REGISTRY,
  getTemplate,
  type TemplateDefinition,
  type TemplateFilter,
  type TemplateId,
} from './registry';

const SAVE_TEMPLATE_MUTATION = `
  mutation SaveTemplateToStudio($input: SaveTemplateInput!) {
    saveTemplateToStudio(input: $input) {
      projectId
      status
    }
  }
`;

export interface InstallTemplateOptions {
  projectId?: string;
}

export interface SaveTemplateOptions {
  endpoint?: string;
  token?: string;
  projectName: string;
  organizationId: string;
  templateId: TemplateId;
}

export interface TemplateInstallerOptions {
  runtime?: LocalRuntimeServices;
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export interface SaveTemplateResult {
  projectId: string;
  status: string;
}

export class TemplateInstaller {
  private readonly runtime: LocalRuntimeServices;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: TemplateInstallerOptions = {}) {
    this.runtime = options.runtime ?? new LocalRuntimeServices();
    this.endpoint = options.endpoint ?? '/api/graphql';
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
    const snapshot = this.runtime.db.export();
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
