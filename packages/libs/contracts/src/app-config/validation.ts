import type { CapabilityRef, CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views';
import type { IntegrationConnection } from '../integrations/connection';
import type {
  IntegrationSpec,
  IntegrationSpecRegistry,
} from '../integrations/spec';
import type { KnowledgeSourceConfig } from '../knowledge/source';
import type { KnowledgeSpaceRegistry } from '../knowledge/spec';
import type {
  BlueprintTranslationCatalog,
  PlatformTranslationCatalog,
  TranslationEntry,
} from '../translations/catalog';
import type { WorkflowRegistry } from '../workflow/spec';
import type { ResolvedAppConfig } from './runtime';
import type { AppBlueprintSpec, TenantAppConfig } from './spec';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  path: string;
  message: string;
  suggestion?: string;
  docsUrl?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
}

export interface ValidationContext {
  integrationSpecs?: IntegrationSpecRegistry;
  knowledgeSpaces?: KnowledgeSpaceRegistry;
  knowledgeSources?: KnowledgeSourceConfig[];
  capabilities?: CapabilityRegistry;
  dataViews?: DataViewRegistry;
  workflows?: WorkflowRegistry;
  tenantConnections?: IntegrationConnection[];
  existingConfigs?: TenantAppConfig[];
  translationCatalogs?: {
    platform?:
      | PlatformTranslationCatalog
      | PlatformTranslationCatalog[]
      | undefined;
    blueprint?:
      | BlueprintTranslationCatalog
      | BlueprintTranslationCatalog[]
      | undefined;
  };
}

type ValidationCategory =
  | 'general'
  | 'capability'
  | 'integration'
  | 'knowledge'
  | 'branding'
  | 'translation'
  | 'policy'
  | 'experiment';

type BlueprintRule = {
  scope: 'blueprint';
  name: string;
  category: ValidationCategory;
  validate: (
    blueprint: AppBlueprintSpec,
    context: ValidationContext
  ) => ValidationIssue[];
};

type TenantRule = {
  scope: 'tenant';
  name: string;
  category: ValidationCategory;
  validate: (
    blueprint: AppBlueprintSpec,
    tenant: TenantAppConfig,
    context: ValidationContext
  ) => ValidationIssue[];
};

type ResolvedRule = {
  scope: 'resolved';
  name: string;
  category: ValidationCategory;
  validate: (
    blueprint: AppBlueprintSpec,
    resolved: ResolvedAppConfig,
    context: ValidationContext
  ) => ValidationIssue[];
};

type ValidationRule = BlueprintRule | TenantRule | ResolvedRule;

class ValidationRuleRegistry {
  private readonly blueprintRules: BlueprintRule[] = [];
  private readonly tenantRules: TenantRule[] = [];
  private readonly resolvedRules: ResolvedRule[] = [];

  register(rule: ValidationRule): this {
    if (rule.scope === 'blueprint') {
      this.blueprintRules.push(rule);
    } else if (rule.scope === 'tenant') {
      this.tenantRules.push(rule);
    } else {
      this.resolvedRules.push(rule);
    }
    return this;
  }

  validateBlueprint(
    blueprint: AppBlueprintSpec,
    context: ValidationContext
  ): ValidationIssue[] {
    return dedupeIssues(
      this.blueprintRules.flatMap((rule) => rule.validate(blueprint, context))
    );
  }

  validateTenant(
    blueprint: AppBlueprintSpec,
    tenant: TenantAppConfig,
    context: ValidationContext
  ): ValidationIssue[] {
    return dedupeIssues(
      this.tenantRules.flatMap((rule) =>
        rule.validate(blueprint, tenant, context)
      )
    );
  }

  validateResolved(
    blueprint: AppBlueprintSpec,
    resolved: ResolvedAppConfig,
    context: ValidationContext
  ): ValidationIssue[] {
    return dedupeIssues(
      this.resolvedRules.flatMap((rule) =>
        rule.validate(blueprint, resolved, context)
      )
    );
  }
}

const DOMAIN_REGEX =
  /^(?!:\/\/)([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[A-Za-z]{2,}$/;

const HTTPS_URL_REGEX = /^https:\/\//i;

const ALLOWED_ASSET_EXTENSIONS: Record<string, string[]> = {
  logo: ['png', 'svg', 'webp'],
  'logo-dark': ['png', 'svg', 'webp'],
  favicon: ['ico', 'png', 'svg'],
  'og-image': ['png', 'jpg', 'jpeg', 'webp'],
};

const EMPTY_CONTEXT: ValidationContext = {};

let registryInstance: ValidationRuleRegistry | undefined;

function getRegistry(): ValidationRuleRegistry {
  if (!registryInstance) {
    registryInstance = createDefaultRegistry();
  }
  return registryInstance;
}

export function validateConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig,
  context: ValidationContext = EMPTY_CONTEXT
): ValidationResult {
  const registry = getRegistry();
  const blueprintResult = buildResult(
    registry.validateBlueprint(blueprint, context)
  );
  const tenantResult = buildResult(
    registry.validateTenant(blueprint, tenant, context)
  );
  return mergeResults(blueprintResult, tenantResult);
}

export function validateBlueprint(
  blueprint: AppBlueprintSpec,
  context: ValidationContext = EMPTY_CONTEXT
): ValidationResult {
  const issues = getRegistry().validateBlueprint(blueprint, context);
  return buildResult(issues);
}

export function validateTenantConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig,
  context: ValidationContext = EMPTY_CONTEXT
): ValidationResult {
  const issues = getRegistry().validateTenant(blueprint, tenant, context);
  return buildResult(issues);
}

export function validateResolvedConfig(
  blueprint: AppBlueprintSpec,
  resolved: ResolvedAppConfig,
  context: ValidationContext = EMPTY_CONTEXT
): ValidationResult {
  const issues = getRegistry().validateResolved(blueprint, resolved, context);
  return buildResult(issues);
}

function buildResult(issues: ValidationIssue[]): ValidationResult {
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const info = issues.filter((issue) => issue.severity === 'info');
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
  };
}

function mergeResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((result) => result.errors);
  const warnings = results.flatMap((result) => result.warnings);
  const info = results.flatMap((result) => result.info);
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
  };
}

function createDefaultRegistry(): ValidationRuleRegistry {
  return new ValidationRuleRegistry()
    .register(blueprintIntegrationSlotRule)
    .register(blueprintCapabilityRegistryRule)
    .register(tenantCapabilityRule)
    .register(tenantIntegrationBindingRule)
    .register(tenantKnowledgeRule)
    .register(tenantBrandingRule)
    .register(tenantTranslationRule)
    .register(resolvedIntegrationRule)
    .register(resolvedTranslationRule);
}

const blueprintIntegrationSlotRule: BlueprintRule = {
  scope: 'blueprint',
  name: 'integration.duplicate-slots',
  category: 'integration',
  validate(blueprint) {
    const issues: ValidationIssue[] = [];
    const seen = new Set<string>();
    for (const slot of blueprint.integrationSlots ?? []) {
      if (seen.has(slot.slotId)) {
        issues.push(
          issue({
            code: 'DUPLICATE_SLOT',
            severity: 'error',
            path: `integrationSlots.${slot.slotId}`,
            message: `Duplicate integration slot id "${slot.slotId}".`,
          })
        );
      } else {
        seen.add(slot.slotId);
      }
      if (slot.allowedModes && slot.allowedModes.length === 0) {
        issues.push(
          issue({
            code: 'EMPTY_ALLOWED_MODES',
            severity: 'warning',
            path: `integrationSlots.${slot.slotId}.allowedModes`,
            message:
              'allowedModes is empty; the slot will accept any supported mode.',
          })
        );
      }
    }
    if (blueprint.branding && !blueprint.branding.appNameKey.trim()) {
      issues.push(
        issue({
          code: 'MISSING_APP_NAME_KEY',
          severity: 'warning',
          path: 'branding.appNameKey',
          message:
            'branding.appNameKey should reference a translation catalog key.',
        })
      );
    }
    return issues;
  },
};

const blueprintCapabilityRegistryRule: BlueprintRule = {
  scope: 'blueprint',
  name: 'capability.registry-check',
  category: 'capability',
  validate(blueprint, context) {
    const issues: ValidationIssue[] = [];
    const registry = context.capabilities;
    if (!registry) return issues;

    const required = blueprint.capabilities?.enabled ?? [];
    required.forEach((ref, index) => {
      if (!registry.get(ref.key, ref.version)) {
        issues.push(
          issue({
            code: 'MISSING_CAPABILITY',
            severity: 'error',
            path: `capabilities.enabled[${index}]`,
            message: `Capability "${ref.key}@${ref.version}" is not registered.`,
          })
        );
      }
    });
    return issues;
  },
};

const tenantCapabilityRule: TenantRule = {
  scope: 'tenant',
  name: 'capability.required-enabled',
  category: 'capability',
  validate(blueprint, tenant, context) {
    const issues: ValidationIssue[] = [];
    const registry = context.capabilities;
    const requiredKeys = new Set(
      (blueprint.capabilities?.enabled ?? []).map(capabilityRefKey)
    );

    const disabled = tenant.capabilities?.disable ?? [];
    disabled.forEach((ref, index) => {
      if (requiredKeys.has(capabilityRefKey(ref))) {
        issues.push(
          issue({
            code: 'DISABLED_REQUIRED_CAPABILITY',
            severity: 'error',
            path: `capabilities.disable[${index}]`,
            message: `Capability "${ref.key}@${ref.version}" is required by the blueprint and cannot be disabled.`,
          })
        );
      }
    });

    if (registry) {
      (tenant.capabilities?.enable ?? []).forEach((ref, index) => {
        if (!registry.get(ref.key, ref.version)) {
          issues.push(
            issue({
              code: 'UNKNOWN_CAPABILITY_ENABLE',
              severity: 'error',
              path: `capabilities.enable[${index}]`,
              message: `Capability "${ref.key}@${ref.version}" is not registered.`,
            })
          );
        }
      });
      disabled.forEach((ref, index) => {
        if (!registry.get(ref.key, ref.version)) {
          issues.push(
            issue({
              code: 'UNKNOWN_CAPABILITY_DISABLE',
              severity: 'warning',
              path: `capabilities.disable[${index}]`,
              message: `Capability "${ref.key}@${ref.version}" is not registered.`,
            })
          );
        }
      });
    }

    return issues;
  },
};

const tenantIntegrationBindingRule: TenantRule = {
  scope: 'tenant',
  name: 'integration.slot-binding',
  category: 'integration',
  validate(blueprint, tenant, context) {
    const issues: ValidationIssue[] = [];
    const slots = new Map(
      (blueprint.integrationSlots ?? []).map((slot) => [slot.slotId, slot])
    );
    const bindings = tenant.integrations ?? [];
    const connections =
      context.tenantConnections?.reduce<Map<string, IntegrationConnection>>(
        (map, connection) => map.set(connection.meta.id, connection),
        new Map()
      ) ?? new Map();
    const satisfiedSlots = new Set<string>();

    bindings.forEach((binding) => {
      const path = `integrations.${binding.slotId}`;
      const slot = slots.get(binding.slotId);
      if (!slot) {
        issues.push(
          issue({
            code: 'UNKNOWN_SLOT_BINDING',
            severity: 'error',
            path,
            message: `Integration slot "${binding.slotId}" is not defined in the blueprint.`,
          })
        );
        return;
      }

      let slotValid = true;
      const connection = connections.get(binding.connectionId);
      if (!connection) {
        issues.push(
          issue({
            code: 'MISSING_INTEGRATION_CONNECTION',
            severity: 'error',
            path,
            message: `Integration connection "${binding.connectionId}" was not found for tenant "${tenant.meta.tenantId}".`,
          })
        );
        slotValid = false;
        return;
      }

      if (connection.meta.tenantId !== tenant.meta.tenantId) {
        issues.push(
          issue({
            code: 'FOREIGN_CONNECTION',
            severity: 'error',
            path,
            message: `Connection "${binding.connectionId}" belongs to tenant "${connection.meta.tenantId}", not "${tenant.meta.tenantId}".`,
          })
        );
        slotValid = false;
      }

      if (slot.allowedModes && slot.allowedModes.length > 0) {
        if (!slot.allowedModes.includes(connection.ownershipMode)) {
          issues.push(
            issue({
              code: 'MODE_MISMATCH',
              severity: 'error',
              path,
              message: `Slot "${slot.slotId}" only allows modes [${slot.allowedModes.join(
                ', '
              )}] but connection is "${connection.ownershipMode}".`,
            })
          );
          slotValid = false;
        }
      }

      if (
        connection.status === 'disconnected' ||
        connection.status === 'error'
      ) {
        issues.push(
          issue({
            code: 'CONNECTION_NOT_READY',
            severity: 'error',
            path,
            message: `Connection "${connection.meta.label}" is in status "${connection.status}".`,
          })
        );
        slotValid = false;
      } else if (connection.status === 'unknown') {
        issues.push(
          issue({
            code: 'CONNECTION_STATUS_UNKNOWN',
            severity: 'warning',
            path,
            message: `Connection "${connection.meta.label}" has unknown health status.`,
          })
        );
      }

      const spec = lookupIntegrationSpec(context.integrationSpecs, connection);
      if (!spec) {
        issues.push(
          issue({
            code: 'INTEGRATION_SPEC_NOT_FOUND',
            severity: 'warning',
            path,
            message: `Integration spec "${connection.meta.integrationKey}@${connection.meta.integrationVersion}" is not registered.`,
          })
        );
        slotValid = false;
        return;
      }

      if (spec.meta.category !== slot.requiredCategory) {
        issues.push(
          issue({
            code: 'CATEGORY_MISMATCH',
            severity: 'error',
            path,
            message: `Slot "${slot.slotId}" requires category "${slot.requiredCategory}" but connection provides "${spec.meta.category}".`,
          })
        );
        slotValid = false;
      }

      if (!spec.supportedModes.includes(connection.ownershipMode)) {
        issues.push(
          issue({
            code: 'UNSUPPORTED_OWNERSHIP_MODE',
            severity: 'error',
            path,
            message: `Integration spec "${spec.meta.key}" does not support ownership mode "${connection.ownershipMode}".`,
          })
        );
        slotValid = false;
      }

      for (const required of slot.requiredCapabilities ?? []) {
        if (!integrationProvidesCapability(spec, required)) {
          issues.push(
            issue({
              code: 'CAPABILITY_NOT_PROVIDED',
              severity: 'error',
              path,
              message: `Integration "${spec.meta.key}" does not provide required capability "${required.key}@${required.version}".`,
            })
          );
          slotValid = false;
        }
      }

      if (slotValid) {
        satisfiedSlots.add(slot.slotId);
      }
    });

    for (const slot of slots.values()) {
      if (slot.required && !satisfiedSlots.has(slot.slotId)) {
        issues.push(
          issue({
            code: 'MISSING_REQUIRED_SLOT',
            severity: 'error',
            path: `integrations.${slot.slotId}`,
            message: `Required integration slot "${slot.slotId}" is not bound.`,
          })
        );
      }
    }

    return issues;
  },
};

const tenantKnowledgeRule: TenantRule = {
  scope: 'tenant',
  name: 'knowledge.bindings',
  category: 'knowledge',
  validate(_blueprint, tenant, context) {
    const issues: ValidationIssue[] = [];
    const registry = context.knowledgeSpaces;
    if (!registry) return issues;
    const sources = context.knowledgeSources ?? [];

    (tenant.knowledge ?? []).forEach((binding, index) => {
      const path = `knowledge[${index}]`;
      const space = registry.get(binding.spaceKey, binding.spaceVersion);
      if (!space) {
        issues.push(
          issue({
            code: 'UNKNOWN_KNOWLEDGE_SPACE',
            severity: 'error',
            path: `${path}.spaceKey`,
            message: `Knowledge space "${binding.spaceKey}" is not registered.`,
          })
        );
        return;
      }

      const hasSources = sources.some((source) => {
        if (source.meta.spaceKey !== binding.spaceKey) return false;
        if (binding.spaceVersion != null) {
          return source.meta.spaceVersion === binding.spaceVersion;
        }
        return true;
      });

      if (!hasSources) {
        issues.push(
          issue({
            code: 'MISSING_KNOWLEDGE_SOURCES',
            severity: 'error',
            path,
            message: `Knowledge space "${binding.spaceKey}" has no configured sources for tenant "${tenant.meta.tenantId}".`,
          })
        );
      }

      if (
        space.meta.category === 'external' ||
        space.meta.category === 'ephemeral'
      ) {
        issues.push(
          issue({
            code: 'LOW_TRUST_KNOWLEDGE',
            severity: 'warning',
            path,
            message: `Knowledge space "${binding.spaceKey}" has category "${space.meta.category}". Avoid using it for irreversible or policy decisions.`,
          })
        );
      }
    });

    return issues;
  },
};

const tenantBrandingRule: TenantRule = {
  scope: 'tenant',
  name: 'branding.constraints',
  category: 'branding',
  validate(_blueprint, tenant, context) {
    const issues: ValidationIssue[] = [];
    const branding = tenant.branding;
    if (!branding) return issues;

    const domain = branding.customDomain?.trim();
    if (domain) {
      if (!DOMAIN_REGEX.test(domain)) {
        issues.push(
          issue({
            code: 'INVALID_DOMAIN',
            severity: 'error',
            path: 'branding.customDomain',
            message: `Custom domain "${domain}" is not a valid hostname.`,
          })
        );
      }

      const conflict = (context.existingConfigs ?? []).find((config) => {
        if (config.meta.id === tenant.meta.id) return false;
        const otherDomain = config.branding?.customDomain?.trim();
        if (!otherDomain) return false;
        return otherDomain.toLowerCase() === domain.toLowerCase();
      });

      if (conflict) {
        issues.push(
          issue({
            code: 'DUPLICATE_DOMAIN',
            severity: 'error',
            path: 'branding.customDomain',
            message: `Custom domain "${domain}" is already used by tenant "${conflict.meta.tenantId}".`,
          })
        );
      }
    }

    (branding.assets ?? []).forEach((asset, index) => {
      const assetPath = `branding.assets[${index}]`;
      if (!HTTPS_URL_REGEX.test(asset.url)) {
        issues.push(
          issue({
            code: 'INSECURE_ASSET_URL',
            severity: 'error',
            path: `${assetPath}.url`,
            message: `Branding asset "${asset.type}" must use an HTTPS URL.`,
          })
        );
      }

      const allowed =
        ALLOWED_ASSET_EXTENSIONS[asset.type] ?? ALLOWED_ASSET_EXTENSIONS.logo;
      const extension = extractExtension(asset.url);
      if (extension && !allowed.includes(extension)) {
        issues.push(
          issue({
            code: 'UNEXPECTED_ASSET_TYPE',
            severity: 'warning',
            path: `${assetPath}.url`,
            message: `Asset "${asset.type}" should use one of: ${allowed.join(
              ', '
            )}. Detected "${extension}".`,
          })
        );
      }
    });

    return issues;
  },
};

const tenantTranslationRule: TenantRule = {
  scope: 'tenant',
  name: 'translation.consistency',
  category: 'translation',
  validate(blueprint, tenant, context) {
    const issues: ValidationIssue[] = [];
    const pointer = blueprint.translationCatalog;
    const catalogs = normalizeCatalogs(context.translationCatalogs);
    const blueprintCatalog = pointer
      ? catalogs.blueprint.find(
          (catalog) =>
            catalog.meta.name === pointer.name &&
            catalog.meta.version === pointer.version
        )
      : undefined;

    if (pointer && !blueprintCatalog) {
      issues.push(
        issue({
          code: 'MISSING_BLUEPRINT_CATALOG',
          severity: 'error',
          path: 'translationCatalog',
          message: `Blueprint translation catalog "${pointer.name}@${pointer.version}" is not loaded in context.`,
        })
      );
    }

    const requiredKeys = new Set<string>();
    if (blueprint.branding?.appNameKey) {
      requiredKeys.add(blueprint.branding.appNameKey);
      if (
        blueprintCatalog &&
        !hasTranslationEntry(
          blueprintCatalog.entries,
          blueprint.branding.appNameKey,
          blueprintCatalog.defaultLocale
        )
      ) {
        issues.push(
          issue({
            code: 'MISSING_TRANSLATION_KEY',
            severity: 'error',
            path: 'branding.appNameKey',
            message: `Translation key "${blueprint.branding.appNameKey}" is missing for locale "${blueprintCatalog.defaultLocale}".`,
          })
        );
      }
    }

    const tenantLocales = tenant.locales;
    if (tenantLocales) {
      const { defaultLocale, enabledLocales } = tenantLocales;
      if (!enabledLocales.includes(defaultLocale)) {
        issues.push(
          issue({
            code: 'LOCALE_NOT_ENABLED',
            severity: 'warning',
            path: 'locales.enabledLocales',
            message: `enabledLocales does not include defaultLocale "${defaultLocale}".`,
          })
        );
      }
      if (blueprintCatalog) {
        const supported = new Set(blueprintCatalog.supportedLocales);
        for (const locale of [defaultLocale, ...enabledLocales]) {
          if (!supported.has(locale)) {
            issues.push(
              issue({
                code: 'UNSUPPORTED_LOCALE',
                severity: 'error',
                path: 'locales.enabledLocales',
                message: `Locale "${locale}" is not supported by blueprint catalog "${blueprintCatalog.meta.name}".`,
              })
            );
          }
        }
      }
    }

    const allowedKeys = new Set<string>();
    for (const catalog of catalogs.blueprint) {
      for (const entry of catalog.entries) {
        allowedKeys.add(entry.key);
      }
    }
    for (const catalog of catalogs.platform) {
      for (const entry of catalog.entries) {
        allowedKeys.add(entry.key);
      }
    }

    const overrides = tenant.translationOverrides?.entries ?? [];
    overrides.forEach((entry, index) => {
      const path = `translationOverrides.entries[${index}]`;
      if (!allowedKeys.has(entry.key)) {
        issues.push(
          issue({
            code: 'UNKNOWN_TRANSLATION_KEY',
            severity: 'error',
            path,
            message: `Override references unknown key "${entry.key}".`,
          })
        );
      }
      if (blueprintCatalog) {
        const supportedLocales = new Set([
          ...blueprintCatalog.supportedLocales,
          ...(tenant.locales?.enabledLocales ?? []),
          tenant.locales?.defaultLocale ?? blueprintCatalog.defaultLocale,
        ]);
        if (!supportedLocales.has(entry.locale)) {
          issues.push(
            issue({
              code: 'UNSUPPORTED_LOCALE_OVERRIDE',
              severity: 'error',
              path,
              message: `Locale "${entry.locale}" is not enabled for tenant overrides.`,
            })
          );
        }
      }
    });

    return issues;
  },
};

const resolvedIntegrationRule: ResolvedRule = {
  scope: 'resolved',
  name: 'integration.required-slots',
  category: 'integration',
  validate(blueprint, resolved) {
    const issues: ValidationIssue[] = [];
    const requiredSlots = (blueprint.integrationSlots ?? []).filter(
      (slot) => slot.required
    );
    for (const slot of requiredSlots) {
      const satisfied = resolved.integrations.some(
        (integration) => integration.slot.slotId === slot.slotId
      );
      if (!satisfied) {
        issues.push(
          issue({
            code: 'MISSING_REQUIRED_SLOT',
            severity: 'error',
            path: `integrations.${slot.slotId}`,
            message: `Resolved config is missing integration slot "${slot.slotId}".`,
          })
        );
      }
    }
    for (const integration of resolved.integrations) {
      if (
        integration.connection.status === 'inactive' ||
        integration.connection.status === 'error'
      ) {
        issues.push(
          issue({
            code: 'CONNECTION_NOT_READY',
            severity: 'error',
            path: `integrations.${integration.slot.slotId}`,
            message: `Resolved integration "${integration.slot.slotId}" uses a connection in status "${integration.connection.status}".`,
          })
        );
      }
    }
    return issues;
  },
};

const resolvedTranslationRule: ResolvedRule = {
  scope: 'resolved',
  name: 'translation.default-locale',
  category: 'translation',
  validate(_blueprint, resolved) {
    const issues: ValidationIssue[] = [];
    const translation = resolved.translation;
    if (
      translation &&
      !translation.supportedLocales.includes(translation.defaultLocale)
    ) {
      issues.push(
        issue({
          code: 'DEFAULT_LOCALE_NOT_SUPPORTED',
          severity: 'warning',
          path: 'translation.defaultLocale',
          message:
            'supportedLocales should include defaultLocale for consistent fallback behaviour.',
        })
      );
    }
    return issues;
  },
};

function issue(input: ValidationIssue): ValidationIssue {
  return input;
}

function dedupeIssues(issues: ValidationIssue[]): ValidationIssue[] {
  const map = new Map<string, ValidationIssue>();
  for (const current of issues) {
    const key = `${current.code}|${current.path}|${current.severity}`;
    if (!map.has(key)) {
      map.set(key, current);
    }
  }
  return [...map.values()];
}

function capabilityRefKey(ref: CapabilityRef): string {
  return `${ref.key}@${ref.version}`;
}

function integrationProvidesCapability(
  spec: IntegrationSpec,
  required: CapabilityRef
): boolean {
  return spec.capabilities.provides.some(
    (provided) =>
      provided.key === required.key && provided.version === required.version
  );
}

function lookupIntegrationSpec(
  registry: IntegrationSpecRegistry | undefined,
  connection: IntegrationConnection
): IntegrationSpec | undefined {
  if (!registry) return undefined;
  return registry.get(
    connection.meta.integrationKey,
    connection.meta.integrationVersion
  );
}

function extractExtension(url: string): string | undefined {
  const clean = url.split('?')[0];
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) return undefined;
  return clean.slice(lastDot + 1).toLowerCase();
}

function normalizeCatalogs(
  catalogs: ValidationContext['translationCatalogs']
): {
  platform: PlatformTranslationCatalog[];
  blueprint: BlueprintTranslationCatalog[];
} {
  if (!catalogs) return { platform: [], blueprint: [] };
  const platform = catalogs.platform
    ? Array.isArray(catalogs.platform)
      ? catalogs.platform
      : [catalogs.platform]
    : [];
  const blueprint = catalogs.blueprint
    ? Array.isArray(catalogs.blueprint)
      ? catalogs.blueprint
      : [catalogs.blueprint]
    : [];
  return { platform, blueprint };
}

function hasTranslationEntry(
  entries: TranslationEntry[],
  key: string,
  locale: string
): boolean {
  return entries.some(
    (entry) => entry.key === key && entry.locale === locale
  );
}

