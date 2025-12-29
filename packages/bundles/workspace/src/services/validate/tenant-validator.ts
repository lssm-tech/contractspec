import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { pathToFileURL } from 'url';
import {
  validateConfig as validateTenantConfigSpecs,
  type AppBlueprintSpec,
  type TenantAppConfig,
  type IntegrationSpecRegistry,
  type BlueprintTranslationCatalog,
  type IntegrationConnection,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../ports/fs';

export interface TenantValidationResult {
  config?: TenantAppConfig;
  report?: ReturnType<typeof validateTenantConfigSpecs>;
  valid: boolean;
  errors: string[];
}

export interface TenantValidationContext {
  connections?: string[] | string;
  integrationRegistrars?: string[] | string;
  translationCatalog?: string;
}

export async function validateTenantConfig(
  blueprint: AppBlueprintSpec,
  tenantPath: string,
  contextOptions: TenantValidationContext,
  adapters: { fs: FsAdapter }
): Promise<TenantValidationResult> {
  const { fs } = adapters;
  const resolvedPath = resolve(process.cwd(), tenantPath);

  if (!(await fs.exists(resolvedPath))) {
    return {
      valid: false,
      errors: [`Tenant config file not found: ${resolvedPath}`],
    };
  }

  try {
    const tenant = await loadTenantConfig(resolvedPath);
    const connections = await loadIntegrationConnections(
      contextOptions.connections,
      fs
    );
    const catalog = await loadTranslationCatalog(
      contextOptions.translationCatalog,
      fs
    );
    const integrationSpecs = await loadIntegrationRegistrars(
      contextOptions.integrationRegistrars
    );

    const context: Parameters<typeof validateTenantConfigSpecs>[2] = {};
    if (connections.length > 0) {
      context.tenantConnections = connections;
    }
    if (catalog) {
      context.translationCatalogs = {
        blueprint: [catalog],
        platform: [],
      };
    }
    if (integrationSpecs) {
      context.integrationSpecs = integrationSpecs;
    }

    const report = validateTenantConfigSpecs(blueprint, tenant, context);

    return {
      config: tenant,
      report,
      valid: report.valid,
      errors: report.errors.map((e) => `[${e.code}] ${e.path}: ${e.message}`),
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

// Helpers

async function loadTenantConfig(tenantPath: string): Promise<TenantAppConfig> {
  if (tenantPath.endsWith('.json')) {
    const raw = await readFile(tenantPath, 'utf-8');
    const json = JSON.parse(raw);
    if (!isTenantConfig(json)) {
      throw new Error(
        'Tenant config JSON does not match the expected structure (missing meta).'
      );
    }
    return json;
  }

  const mod = await loadModule(tenantPath);
  const candidates = Object.values(mod).filter(isTenantConfig);
  if (candidates.length === 0) {
    throw new Error('Tenant config module does not export a TenantAppConfig.');
  }
  return candidates[0] as TenantAppConfig;
}

function isTenantConfig(value: unknown): value is TenantAppConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as TenantAppConfig).meta?.tenantId === 'string'
  );
}

// Basic module loader
async function loadModule(
  modulePath: string
): Promise<Record<string, unknown>> {
  try {
    const url = pathToFileURL(modulePath).href;
    const mod = await import(url);
    return mod;
  } catch (error) {
    throw new Error(`Failed to load module at ${modulePath}: ${error}`);
  }
}

// --- Connection Loaders ---

function normalizePathOption(value?: string | string[]): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : value.split(',');
  return values.map((entry) => entry.trim()).filter(Boolean);
}

async function loadIntegrationConnections(
  value: string | string[] | undefined,
  fs: FsAdapter
): Promise<IntegrationConnection[]> {
  const paths = normalizePathOption(value);
  if (!paths.length) return [];

  const results: IntegrationConnection[] = [];
  for (const path of paths) {
    const resolved = resolve(process.cwd(), path);
    if (!(await fs.exists(resolved))) {
      console.warn(`Warning: Connection file not found: ${resolved}`);
      continue;
    }

    if (resolved.endsWith('.json')) {
      const raw = await readFile(resolved, 'utf-8');
      const parsed = JSON.parse(raw);
      results.push(...collectConnections(parsed));
      continue;
    }

    const mod = await loadModule(resolved);
    results.push(...collectConnections(mod));
  }
  return results;
}

function collectConnections(value: unknown): IntegrationConnection[] {
  if (Array.isArray(value)) {
    const connections = value.filter(isIntegrationConnection);
    if (connections.length) return connections;
  }
  if (isIntegrationConnection(value)) {
    return [value];
  }
  if (value && typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>);
    const collected = entries.flatMap((entry) => collectConnections(entry));
    if (collected.length) return collected;
  }
  return [];
}

function isIntegrationConnection(
  value: unknown
): value is IntegrationConnection {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as IntegrationConnection).meta?.id === 'string' &&
    typeof (value as IntegrationConnection).secretRef === 'string'
  );
}

// --- Translation Catalog Loaders ---

async function loadTranslationCatalog(
  path: string | undefined,
  fs: FsAdapter
): Promise<BlueprintTranslationCatalog | undefined> {
  if (!path) return undefined;
  const resolved = resolve(process.cwd(), path);
  if (!(await fs.exists(resolved))) return undefined;

  if (resolved.endsWith('.json')) {
    const raw = await readFile(resolved, 'utf-8');
    const parsed = JSON.parse(raw);
    if (isBlueprintTranslationCatalog(parsed)) {
      return normaliseTranslationCatalog(parsed);
    }
    return undefined;
  }

  const mod = await loadModule(resolved);
  const catalogs = Object.values(mod).filter(isBlueprintTranslationCatalog);
  if (catalogs.length === 0) return undefined;
  return normaliseTranslationCatalog(
    catalogs[0] as BlueprintTranslationCatalog
  );
}

function isBlueprintTranslationCatalog(
  value: unknown
): value is BlueprintTranslationCatalog {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as BlueprintTranslationCatalog).meta?.key === 'string' &&
    typeof (value as BlueprintTranslationCatalog).meta?.version === 'string' &&
    Array.isArray((value as BlueprintTranslationCatalog).entries)
  );
}

function normaliseTranslationCatalog(
  catalog: BlueprintTranslationCatalog
): BlueprintTranslationCatalog {
  const supportedLocales =
    catalog.supportedLocales && catalog.supportedLocales.length > 0
      ? catalog.supportedLocales
      : [catalog.defaultLocale];
  return {
    ...catalog,
    supportedLocales,
  };
}

// --- Registrar Loaders ---
// Important: This needs IntegrationSpecRegistry which is a Class.
// We only import type in signature, but need constructor.
// Imports fixed at top.

async function loadIntegrationRegistrars(
  value?: string | string[]
): Promise<IntegrationSpecRegistry | undefined> {
  const entries = normalizePathOption(value);
  if (!entries.length) return undefined;

  // We need to import the Class dynamically or have it available.
  // It is imported from @contractspec/lib.contracts
  const { IntegrationSpecRegistry } =
    await import('@contractspec/lib.contracts');
  const registry = new IntegrationSpecRegistry();

  for (const entry of entries) {
    const { modulePath, exportName } = parseRegistrarEntry(entry);
    if (!modulePath) continue;
    const resolved = resolve(process.cwd(), modulePath);
    // Logic simplified for brevity, assume module exists or handled by catch in loadModule
    try {
      const mod = await loadModule(resolved);
      const registrar = pickRegistrar(mod, exportName);
      if (registrar) {
        await registrar(registry);
      }
    } catch (e) {
      console.warn(`Failed to load registrar from ${resolved}: ${e}`);
    }
  }
  return registry;
}

function parseRegistrarEntry(entry: string): {
  modulePath: string | null;
  exportName?: string;
} {
  if (!entry) return { modulePath: null };
  const [modulePathRaw, exportNameRaw] = entry.split('#');
  const modulePath = modulePathRaw?.trim() ?? null;
  const exportName = exportNameRaw?.trim();
  return { modulePath, exportName };
}

function pickRegistrar(
  mod: Record<string, unknown>,
  exportName?: string
): ((registry: IntegrationSpecRegistry) => void | Promise<void>) | undefined {
  if (exportName) {
    const candidate = mod[exportName];
    if (typeof candidate === 'function') {
      return candidate as (
        registry: IntegrationSpecRegistry
      ) => void | Promise<void>;
    }
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (mod as any).default === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (mod as any).default;
  }
  for (const value of Object.values(mod)) {
    if (typeof value === 'function') {
      return value as (
        registry: IntegrationSpecRegistry
      ) => void | Promise<void>;
    }
  }
  return undefined;
}
