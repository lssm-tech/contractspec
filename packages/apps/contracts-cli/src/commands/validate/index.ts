import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { basename, dirname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { select } from '@inquirer/prompts';
import {
  validateBlueprint as validateBlueprintSpec,
  validateConfig as validateTenantConfigSpecs,
} from '@lssm/lib.contracts/app-config/validation';
import type {
  AppBlueprintSpec,
  TenantAppConfig,
} from '@lssm/lib.contracts/app-config/spec';
import type { IntegrationConnection } from '@lssm/lib.contracts/integrations/connection';
import { IntegrationSpecRegistry } from '@lssm/lib.contracts/integrations/spec';
import type { BlueprintTranslationCatalog } from '@lssm/lib.contracts/translations/catalog';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import { validateSpecStructure } from './spec-checker';
import type { Config } from '../../utils/config';

interface ValidateOptions {
  blueprint?: string;
  tenantConfig?: string;
  connections?: string[] | string;
  integrationRegistrars?: string[] | string;
  translationCatalog?: string;
  checkHandlers?: boolean;
  checkTests?: boolean;
  checkImplementation?: boolean;
  implementationPath?: string;
  agentMode?: string;
  interactive?: boolean;
}
/**
 * Main validate command implementation
 */
export async function validateCommand(
  specFile: string,
  options: ValidateOptions,
  config: Config
) {
  console.log(chalk.bold.blue('\n🔍 Contract Validator\n'));

  const blueprintResult = options.blueprint
    ? await validateBlueprint(options.blueprint)
    : null;

  const tenantReport =
    options.tenantConfig && blueprintResult
      ? await validateTenantConfig(
          blueprintResult.spec,
          options.tenantConfig,
          options
        )
      : null;

  // Validate spec file exists
  if (!existsSync(specFile)) {
    console.error(chalk.red(`❌ Spec file not found: ${specFile}`));
    process.exit(1);
  }

  // Read spec file
  const specCode = await readFile(specFile, 'utf-8');
  const fileName = basename(specFile);
  const resolvedSpecFile = resolve(process.cwd(), specFile);
  const skipSpecStructure =
    options.blueprint &&
    resolve(process.cwd(), options.blueprint) === resolvedSpecFile;

  console.log(chalk.gray(`Validating: ${specFile}\n`));

  const shouldPrompt = typeof options.checkImplementation !== 'boolean';

  let validateImplementation = Boolean(options.checkImplementation);

  if (shouldPrompt) {
    if (process.stdout.isTTY) {
      const choice = await select({
        message: 'Validate only the spec or also the implementation?',
        default: 'spec',
        choices: [
          { name: 'Spec file only', value: 'spec' },
          { name: 'Spec + implementation (AI-assisted)', value: 'both' },
        ],
      });

      validateImplementation = choice === 'both';
    } else {
      validateImplementation = false;
    }
  }

  // Run validations
  let hasErrors = false;

  // 1. Spec structure validation
  if (!skipSpecStructure) {
    console.log(chalk.cyan('📋 Checking spec structure...'));
    const structureResult = validateSpecStructure(specCode, fileName);

    if (structureResult.valid) {
      console.log(chalk.green('  ✅ Spec structure is valid'));
    } else {
      console.log(chalk.red('  ❌ Spec structure has errors:'));
      structureResult.errors.forEach((error) => {
        console.log(chalk.red(`     • ${error}`));
      });
      hasErrors = true;
    }

    if (structureResult.warnings.length > 0) {
      console.log(chalk.yellow('\n  ⚠️  Warnings:'));
      structureResult.warnings.forEach((warning) => {
        console.log(chalk.yellow(`     • ${warning}`));
      });
    }
  } else {
    console.log(
      chalk.yellow('⚠️  Skipping spec-structure checks (blueprint file).')
    );
  }

  // 2. Implementation validation (if requested)
  if (validateImplementation) {
    const implResult = await validateImplementation_AI(
      specFile,
      specCode,
      options,
      config
    );

    if (!implResult.success) {
      hasErrors = true;
    }
  }

  // 3. Handler validation (if requested)
  if (options.checkHandlers) {
    console.log(chalk.cyan('\n🔧 Checking handler implementation...'));
    console.log(chalk.yellow('  ⚠️  Handler validation not yet implemented'));
    // TODO: Implement handler checking
  }

  // 4. Test validation (if requested)
  if (options.checkTests) {
    console.log(chalk.cyan('\n🧪 Checking test coverage...'));
    console.log(chalk.yellow('  ⚠️  Test validation not yet implemented'));
    // TODO: Implement test checking
  }

  // Summary
  console.log();
  if (
    hasErrors ||
    (blueprintResult && !blueprintResult.report.valid) ||
    (tenantReport && !tenantReport.report.valid)
  ) {
    console.log(chalk.red('❌ Validation failed'));
    process.exit(1);
  }

  console.log(chalk.green('✅ Validation passed'));
}

async function validateBlueprint(
  blueprintPath: string
): Promise<{ spec: AppBlueprintSpec; report: ReturnType<typeof validateBlueprintSpec> }> {
  const resolvedPath = resolve(process.cwd(), blueprintPath);
  if (!existsSync(resolvedPath)) {
    console.error(chalk.red(`❌ Blueprint file not found: ${resolvedPath}`));
    process.exit(1);
  }

  const mod = await loadModule(resolvedPath);
  const spec = extractBlueprintSpec(mod);
  console.log(
    chalk.cyan(
      `\n🧭 Validating blueprint ${spec.meta.name}.v${spec.meta.version}`
    )
  );
  const report = validateBlueprintSpec(spec);
  printValidationReport(report);
  return { spec, report };
}

async function validateTenantConfig(
  blueprint: AppBlueprintSpec,
  tenantPath: string,
  options: ValidateOptions
): Promise<{ config: TenantAppConfig; report: ReturnType<typeof validateTenantConfigSpecs> }> {
  const resolvedPath = resolve(process.cwd(), tenantPath);
  if (!existsSync(resolvedPath)) {
    console.error(chalk.red(`❌ Tenant config file not found: ${resolvedPath}`));
    process.exit(1);
  }

  const tenant = await loadTenantConfig(resolvedPath);
  const connections = await loadIntegrationConnections(options.connections);
  const catalog = await loadTranslationCatalog(options.translationCatalog);
  const integrationSpecs = await loadIntegrationRegistrars(
    options.integrationRegistrars
  );

  console.log(
    chalk.cyan(
      `\n🏗️  Validating tenant config "${tenant.meta?.id ?? 'tenant'}" against blueprint ${blueprint.meta.name}.v${blueprint.meta.version}`
    )
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
  printValidationReport(report);
  return { config: tenant, report };
}

async function loadModule(modulePath: string): Promise<Record<string, unknown>> {
  try {
    const url = pathToFileURL(modulePath).href;
    return await import(url);
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Failed to load module at ${modulePath}. Ensure it is compiled to JavaScript or use node --loader to handle TypeScript.`
      )
    );
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

function extractBlueprintSpec(mod: Record<string, unknown>): AppBlueprintSpec {
  const candidates = Object.values(mod).filter(isBlueprintSpec);
  if (candidates.length === 0) {
    console.error(
      chalk.red(
        '❌ Blueprint module does not export an AppBlueprintSpec. Export the spec or set it as default.'
      )
    );
    process.exit(1);
  }
  return candidates[0] as AppBlueprintSpec;
}

async function loadTenantConfig(tenantPath: string): Promise<TenantAppConfig> {
  if (tenantPath.endsWith('.json')) {
    const raw = await readFile(tenantPath, 'utf-8');
    const json = JSON.parse(raw);
    if (!isTenantConfig(json)) {
      console.error(
        chalk.red(
          '❌ Tenant config JSON does not match the expected structure (missing meta).'
        )
      );
      process.exit(1);
    }
    return json;
  }

  const mod = await loadModule(tenantPath);
  const candidates = Object.values(mod).filter(isTenantConfig);
  if (candidates.length === 0) {
    console.error(
      chalk.red(
        '❌ Tenant config module does not export a TenantAppConfig.'
      )
    );
    process.exit(1);
  }
  return candidates[0] as TenantAppConfig;
}

function printValidationReport(
  report: ReturnType<typeof validateBlueprintSpec>
) {
  if (report.valid) {
    console.log(chalk.green('  ✅ Validation passed'));
  } else {
    console.log(chalk.red('  ❌ Validation failed'));
  }

  if (report.errors.length) {
    console.log(chalk.red('\n  Errors:'));
    for (const issue of report.errors) {
      console.log(chalk.red(`   • [${issue.code}] ${issue.path}: ${issue.message}`));
    }
  }

  if (report.warnings.length) {
    console.log(chalk.yellow('\n  Warnings:'));
    for (const issue of report.warnings) {
      console.log(
        chalk.yellow(`   • [${issue.code}] ${issue.path}: ${issue.message}`)
      );
    }
  }

  if (report.info.length) {
    console.log(chalk.gray('\n  Info:'));
    for (const issue of report.info) {
      console.log(chalk.gray(`   • [${issue.code}] ${issue.path}: ${issue.message}`));
    }
  }
}

function isBlueprintSpec(value: unknown): value is AppBlueprintSpec {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as AppBlueprintSpec).meta?.name === 'string' &&
    typeof (value as AppBlueprintSpec).meta?.version === 'number'
  );
}

function isTenantConfig(value: unknown): value is TenantAppConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as TenantAppConfig).meta?.tenantId === 'string'
  );
}

export type { ValidateOptions };
export { validateBlueprint, validateTenantConfig };

function normalizePathOption(
  value?: string | string[]
): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : value.split(',');
  return values.map((entry) => entry.trim()).filter(Boolean);
}

async function loadIntegrationConnections(
  value?: string | string[]
): Promise<IntegrationConnection[]> {
  const paths = normalizePathOption(value);
  if (!paths.length) return [];

  const results: IntegrationConnection[] = [];
  for (const path of paths) {
    const resolved = resolve(process.cwd(), path);
    if (!existsSync(resolved)) {
      console.warn(chalk.yellow(`  ⚠️  Connection file not found: ${resolved}`));
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
    const entries = Object.values(value);
    const collected = entries.flatMap((entry) => collectConnections(entry));
    if (collected.length) return collected;
  }
  return [];
}

async function loadTranslationCatalog(
  path?: string
): Promise<BlueprintTranslationCatalog | undefined> {
  if (!path) return undefined;
  const resolved = resolve(process.cwd(), path);
  if (!existsSync(resolved)) {
    console.warn(chalk.yellow(`  ⚠️  Translation catalog not found: ${resolved}`));
    return undefined;
  }

  if (resolved.endsWith('.json')) {
    const raw = await readFile(resolved, 'utf-8');
    const parsed = JSON.parse(raw);
    if (isBlueprintTranslationCatalog(parsed)) {
      return normaliseTranslationCatalog(parsed);
    }
    console.warn(
      chalk.yellow(`  ⚠️  Translation catalog JSON "${resolved}" is not valid.`)
    );
    return undefined;
  }

  const mod = await loadModule(resolved);
  const catalogs = Object.values(mod).filter(isBlueprintTranslationCatalog);
  if (catalogs.length === 0) {
    console.warn(
      chalk.yellow(
        `  ⚠️  Module "${resolved}" does not export a BlueprintTranslationCatalog.`
      )
    );
    return undefined;
  }
  return normaliseTranslationCatalog(catalogs[0] as BlueprintTranslationCatalog);
}

function isIntegrationConnection(value: unknown): value is IntegrationConnection {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as IntegrationConnection).meta?.id === 'string' &&
    typeof (value as IntegrationConnection).secretRef === 'string'
  );
}

function isBlueprintTranslationCatalog(
  value: unknown
): value is BlueprintTranslationCatalog {
  return (
    typeof value === 'object' &&
    value !== null &&
    'meta' in value &&
    typeof (value as BlueprintTranslationCatalog).meta?.name === 'string' &&
    typeof (value as BlueprintTranslationCatalog).meta?.version === 'number' &&
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

async function loadIntegrationRegistrars(
  value?: string | string[]
): Promise<IntegrationSpecRegistry | undefined> {
  const entries = normalizePathOption(value);
  if (!entries.length) return undefined;

  const registry = new IntegrationSpecRegistry();
  for (const entry of entries) {
    const { modulePath, exportName } = parseRegistrarEntry(entry);
    if (!modulePath) continue;
    const resolved = resolve(process.cwd(), modulePath);
    if (!existsSync(resolved)) {
      console.warn(chalk.yellow(`  ⚠️  Registrar not found: ${resolved}`));
      continue;
    }
    const mod = await loadModule(resolved);
    const registrar = pickRegistrar(mod, exportName);
    if (!registrar) {
      console.warn(
        chalk.yellow(
          `  ⚠️  No registrar function found in "${modulePath}"${
            exportName ? ` for export "${exportName}"` : ''
          }.`
        )
      );
      continue;
    }
    await registrar(registry);
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
  if (typeof (mod as Record<string, unknown>).default === 'function') {
    return (mod as Record<string, unknown>).default as (
      registry: IntegrationSpecRegistry
    ) => void | Promise<void>;
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

/**
 * Validate implementation against spec using AI agents
 */
async function validateImplementation_AI(
  specFile: string,
  specCode: string,
  options: ValidateOptions,
  config: Config
): Promise<{ success: boolean }> {
  console.log(chalk.cyan('\n🤖 Validating implementation with AI...'));

  if (config.agentMode === 'simple') {
    const providerStatus = await validateProvider(config);
    if (!providerStatus.success) {
      console.log(
        chalk.yellow(
          `  ⚠️  AI provider unavailable (${providerStatus.error}). Skipping implementation validation.`
        )
      );
      return { success: true };
    }
  }

  // Find implementation file
  let implementationPath = options.implementationPath;

  if (!implementationPath) {
    // Try to infer from spec file path
    const specDir = dirname(specFile);
    const specBaseName = basename(specFile, '.ts');

    // Try common patterns
    const possiblePaths = [
      join(specDir, specBaseName.replace('.contracts', '.handler') + '.ts'),
      join(specDir, specBaseName.replace('.presentation', '') + '.tsx'),
      join(specDir, specBaseName.replace('.form', '.form') + '.tsx'),
      join(
        dirname(specDir),
        'handlers',
        specBaseName.replace('.contracts', '.handler') + '.ts'
      ),
      join(
        dirname(specDir),
        'components',
        specBaseName.replace('.presentation', '') + '.tsx'
      ),
    ];

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        implementationPath = path;
        break;
      }
    }
  }

  if (!implementationPath || !existsSync(implementationPath)) {
    console.log(chalk.yellow('  ⚠️  Implementation file not found'));
    console.log(chalk.gray('  Please specify with --implementation-path'));
    return { success: true };
  }

  console.log(chalk.gray(`  Implementation: ${implementationPath}`));

  // Read implementation
  const implementationCode = await readFile(implementationPath, 'utf-8');

  // Use agent orchestrator to validate
  const orchestrator = new AgentOrchestrator(config);
  console.log(chalk.cyan(`  Using agent mode: ${config.agentMode}\n`));

  const result = await orchestrator.validate(specCode, implementationCode);

  if (result.success) {
    console.log(chalk.green('  ✅ Implementation matches specification'));

    if (result.suggestions && result.suggestions.length > 0) {
      console.log(chalk.cyan('\n  💡 Suggestions:'));
      result.suggestions.forEach((s) => console.log(chalk.gray(`     • ${s}`)));
    }

    return { success: true };
  } else {
    console.log(chalk.red('  ❌ Implementation has issues:\n'));

    if (result.errors && result.errors.length > 0) {
      console.log(chalk.red('  Errors:'));
      result.errors.forEach((e) => console.log(chalk.red(`     • ${e}`)));
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(chalk.yellow('\n  Warnings:'));
      result.warnings.forEach((w) => console.log(chalk.yellow(`     • ${w}`)));
    }

    if (result.suggestions && result.suggestions.length > 0) {
      console.log(chalk.cyan('\n  Suggestions:'));
      result.suggestions.forEach((s) => console.log(chalk.gray(`     • ${s}`)));
    }

    // Show validation report if available
    if (result.code) {
      console.log(chalk.gray('\n  Detailed Report:'));
      console.log(chalk.gray('  ' + '-'.repeat(60)));
      console.log(
        chalk.gray(
          result.code
            .split('\n')
            .map((l) => `  ${l}`)
            .join('\n')
        )
      );
      console.log(chalk.gray('  ' + '-'.repeat(60)));
    }

    return { success: false };
  }
}
