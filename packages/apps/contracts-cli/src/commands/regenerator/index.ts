import { dynamicImport } from '../../utils/dynamicImport';
import type { Config } from '../../utils/config';
import { resolvePathFromCwd } from '../../utils/fs';
import { RegeneratorService } from '@lssm/lib.contracts/regenerator';
import type {
  AppBlueprintSpec,
  TenantAppConfig,
} from '@lssm/lib.contracts/app-config';
import type {
  ProposalSink,
  RegenerationContext,
  RegenerationRule,
} from '@lssm/lib.contracts/regenerator/types';
import type { SignalAdapters } from '@lssm/lib.contracts/regenerator/adapters';
import { composeAppConfig, resolveAppConfig } from '@lssm/lib.contracts/app-config';

interface RegeneratorCliOptions {
  once?: boolean;
  pollInterval?: number;
  batchDuration?: number;
  contexts?: string;
}

export async function regeneratorCommand(
  blueprintPath: string,
  tenantPath: string,
  rulesPath: string,
  sinkPath: string,
  options: RegeneratorCliOptions,
  _config: Config
) {
  const resolvedBlueprintPath = resolvePathFromCwd(blueprintPath);
  const resolvedTenantPath = resolvePathFromCwd(tenantPath);
  const resolvedRulesPath = resolvePathFromCwd(rulesPath);
  const resolvedSinkPath = resolvePathFromCwd(sinkPath);

  const blueprintModule = await dynamicImport(resolvedBlueprintPath);
  const tenantModule = await dynamicImport(resolvedTenantPath);
  const rulesModule = await dynamicImport(resolvedRulesPath);
  const sinkModule = await dynamicImport(resolvedSinkPath);

  const blueprint = extractDefault<AppBlueprintSpec>(
    blueprintModule,
    'AppBlueprintSpec'
  );
  const tenantConfig = extractDefault<TenantAppConfig>(
    tenantModule,
    'TenantAppConfig'
  );
  const rules = normalizeArray<RegenerationRule>(
    extractDefault<RegenerationRule | RegenerationRule[]>(
      rulesModule,
      'RegenerationRule'
    )
  );
  const sink = extractDefault<ProposalSink>(sinkModule, 'ProposalSink');

  const contexts = await loadContexts(
    options.contexts,
    blueprint,
    tenantConfig
  );

  const adapters = extractAdapters(rulesModule, sinkModule);

  const service = new RegeneratorService({
    contexts,
    adapters,
    rules,
    sink,
    pollIntervalMs: options.pollInterval,
    batchDurationMs: options.batchDuration,
  });

  if (options.once) {
    await service.runOnce();
    return;
  }

  service.start();
  process.on('SIGINT', () => {
    service.stop();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    service.stop();
    process.exit(0);
  });
}

function extractDefault<T>(module: Record<string, unknown>, typeName: string): T {
  const value =
    'default' in module && module.default
      ? module.default
      : module[typeName];

  if (!value) {
    throw new Error(`Module must export a default ${typeName}`);
  }
  return value as T;
}

function normalizeArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

async function loadContexts(
  contextsPath: string | undefined,
  blueprint: AppBlueprintSpec,
  tenantConfig: TenantAppConfig
): Promise<RegenerationContext[]> {
  if (!contextsPath) {
    return [
      {
        id:
          tenantConfig.meta.id ??
          `${tenantConfig.meta.tenantId}-${blueprint.meta.name}`,
        blueprint,
        tenantConfig,
        resolved: resolveAppConfig(blueprint, tenantConfig),
      },
    ];
  }

  const module = await dynamicImport(resolvePathFromCwd(contextsPath));
  const value = module.default ?? module.contexts;
  if (!Array.isArray(value)) {
    throw new Error(
      'Contexts module must export an array via default export or `contexts`'
    );
  }
  return value as RegenerationContext[];
}

function extractAdapters(
  rulesModule: Record<string, unknown>,
  sinkModule: Record<string, unknown>
): SignalAdapters {
  const adapters: SignalAdapters = {};

  const telemetry = (rulesModule.telemetry ??
    sinkModule.telemetry) as SignalAdapters['telemetry'];
  if (telemetry) adapters.telemetry = telemetry;

  const errors = (rulesModule.errors ??
    sinkModule.errors) as SignalAdapters['errors'];
  if (errors) adapters.errors = errors;

  const behavior = (rulesModule.behavior ??
    sinkModule.behavior) as SignalAdapters['behavior'];
  if (behavior) adapters.behavior = behavior;

  return adapters;
}

