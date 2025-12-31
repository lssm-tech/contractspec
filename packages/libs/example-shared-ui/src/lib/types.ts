export type TemplateId = string;

export type TemplateCategory =
  | 'productivity'
  | 'communication'
  | 'content'
  | 'business'
  | 'ai';

export type TemplateComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  icon: string;
  features: string[];
  tags: string[];
  schema: {
    models: string[];
    contracts: string[];
  };
  components: {
    list: string;
    detail: string;
    form?: string;
    dashboard?: string;
  };
  preview?: {
    demoUrl?: string;
    videoUrl?: string;
  };
  docs?: {
    quickstart?: string;
    reference?: string;
  };
  /** Package name for external examples that can be cloned via Git */
  package?: string;
  /** Whether this template uses the new cross-cutting modules */
  usesModules?: string[];
  /** Feature spec key from the example package */
  featureSpec?: string;
  /** List of presentation names available for this template */
  presentations?: string[];
  /** List of render targets supported (default: ['react']) */
  renderTargets?: ('react' | 'markdown' | 'json' | 'xml')[];
}

export interface TemplateFilter {
  category?: TemplateCategory;
  complexity?: TemplateComplexity;
  tag?: string;
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

export interface SaveTemplateResult {
  projectId: string;
  status: string;
}

/**
 * Interface for the TemplateInstaller class.
 * Mirrors the public API of the implementation in @contractspec/module.examples
 */
export interface TemplateInstaller {
  install(
    templateId: TemplateId,
    options?: InstallTemplateOptions
  ): Promise<void>;
  saveToStudio(options: SaveTemplateOptions): Promise<SaveTemplateResult>;
}
