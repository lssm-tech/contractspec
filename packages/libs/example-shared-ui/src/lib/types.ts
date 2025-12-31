export type TemplateId = string;

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  presentations?: string[];
  schema: {
    models: string[];
    contracts: string[];
  };
  [key: string]: unknown;
}

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

/**
 * Interface for the TemplateInstaller class.
 * Mirrors the public API of the implementation in @contractspec/module.examples
 */
export interface TemplateInstaller {
  install(templateId: TemplateId, options?: InstallTemplateOptions): Promise<void>;
  saveToStudio(options: SaveTemplateOptions): Promise<{
    projectId: string;
    status: string;
  }>;
}
