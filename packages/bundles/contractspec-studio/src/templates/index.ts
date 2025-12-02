/**
 * Template System Exports
 *
 * This module provides the complete template infrastructure including:
 * - Registry: Template definitions and metadata
 * - Runtime: Context providers and hooks for template execution
 * - Engine: TransformEngine for multi-target rendering
 * - Installer: Template installation and seeding
 */

// Registry
export {
  TEMPLATE_REGISTRY,
  listTemplates,
  getTemplate,
  getTemplatesByModule,
  getClonableTemplates,
  type TemplateId,
  type TemplateCategory,
  type TemplateComplexity,
  type TemplateDefinition,
  type TemplateFilter,
} from './registry';

// Runtime
export {
  TemplateRuntimeProvider,
  useTemplateRuntime,
  useTemplateEngine,
  templateComponentRegistry,
  registerTemplateComponents,
  type TemplateRuntimeProviderProps,
  type TemplateRuntimeContextValue,
  type TemplateComponentRegistration,
} from './runtime';

// Engine
export {
  createTemplateTransformEngine,
  getTemplateEngine,
  resetTemplateEngine,
} from './engine';

// Installer
export {
  TemplateInstaller,
  type InstallTemplateOptions,
  type SaveTemplateOptions,
  type TemplateInstallerOptions,
  type SaveTemplateResult,
} from './installer';
