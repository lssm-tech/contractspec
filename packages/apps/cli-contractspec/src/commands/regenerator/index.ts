import { dynamicImport } from '../../utils/dynamicImport';
import type { Config } from '../../utils/config';
import { resolvePathFromCwd } from '../../utils/fs';
import {
  ExecutorProposalSink,
  ProposalExecutor,
  RegeneratorService,
  type ProposalExecutorDeps,
  type ExecutorSinkOptions,
  type AppBlueprintSpec,
  type TenantAppConfig,
  type ProposalSink,
  type RegenerationContext,
  type RegenerationRule,
  type SignalAdapters,
  resolveAppConfig,
} from '@lssm/lib.contracts';

interface RegeneratorCliOptions {
  once?: boolean;
  pollInterval?: number;
  batchDuration?: number;
  contexts?: string;
  executor?: string;
  dryRun?: boolean;
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

  const blueprintModule = await dynamicImport(resolvedBlueprintPath);
  const tenantModule = await dynamicImport(resolvedTenantPath);
  const rulesModule = await dynamicImport(resolvedRulesPath);
  const sinkResolution = await resolveSink(sinkPath, options);
  const sinkModule = sinkResolution.module;
  const executorModule = sinkResolution.executorModule;

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
  const sink = sinkResolution.sink;

  const contexts = await loadContexts(
    options.contexts,
    blueprint,
    tenantConfig
  );

  const adapters = extractAdapters(rulesModule, sinkModule, executorModule);

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

function extractDefault<T>(
  module: Record<string, unknown>,
  typeName: string
): T {
  const value =
    'default' in module && module.default ? module.default : module[typeName];

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
          `${tenantConfig.meta.tenantId}-${blueprint.meta.key}`,
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

async function resolveSink(
  sinkPath: string,
  options: RegeneratorCliOptions
): Promise<{
  sink: ProposalSink;
  module?: Record<string, unknown>;
  executorModule?: Record<string, unknown>;
}> {
  if (sinkPath === 'auto') {
    if (!options.executor) {
      throw new Error(
        'Sink path "auto" requires --executor <module> to instantiate ProposalExecutor'
      );
    }
    const { sink, module } = await createExecutorSink(
      options.executor,
      options
    );
    return { sink, executorModule: module };
  }

  const resolvedSinkPath = resolvePathFromCwd(sinkPath);
  const sinkModule = await dynamicImport(resolvedSinkPath);
  const sink = extractDefault<ProposalSink>(sinkModule, 'ProposalSink');
  return { sink, module: sinkModule };
}

function extractAdapters(
  ...modules: (Record<string, unknown> | undefined)[]
): SignalAdapters {
  const adapters: SignalAdapters = {};

  for (const module of modules) {
    if (!module) continue;
    if (!adapters.telemetry && module.telemetry) {
      adapters.telemetry = module.telemetry as SignalAdapters['telemetry'];
    }
    if (!adapters.errors && module.errors) {
      adapters.errors = module.errors as SignalAdapters['errors'];
    }
    if (!adapters.behavior && module.behavior) {
      adapters.behavior = module.behavior as SignalAdapters['behavior'];
    }
  }

  return adapters;
}

async function createExecutorSink(
  executorPath: string,
  options: RegeneratorCliOptions
): Promise<{ sink: ProposalSink; module: Record<string, unknown> }> {
  const resolvedExecutorPath = resolvePathFromCwd(executorPath);
  const executorModule = await dynamicImport(resolvedExecutorPath);
  const executor = await instantiateExecutor(executorModule);
  const sinkOptions = normalizeExecutorSinkOptions(executorModule, options);
  const sink = new ExecutorProposalSink(executor, sinkOptions);
  return { sink, module: executorModule };
}

async function instantiateExecutor(
  module: Record<string, unknown>
): Promise<ProposalExecutor> {
  const candidates = [
    module.executor,
    module.default,
    module.createExecutor,
    module.create,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (isProposalExecutor(candidate)) {
      return candidate;
    }

    if (typeof candidate === 'function') {
      const result = await candidate();
      if (isProposalExecutor(result)) {
        return result;
      }
      if (isExecutorDeps(result)) {
        return new ProposalExecutor(result);
      }
    } else if (isExecutorDeps(candidate)) {
      return new ProposalExecutor(candidate);
    }
  }

  if (isExecutorDeps(module.deps)) {
    return new ProposalExecutor(module.deps);
  }

  throw new Error(
    'Executor module must export a ProposalExecutor instance, factory, or dependency object'
  );
}

function normalizeExecutorSinkOptions(
  module: Record<string, unknown>,
  options: RegeneratorCliOptions
): ExecutorSinkOptions {
  const normalized: ExecutorSinkOptions = {};

  if (module.sinkOptions && typeof module.sinkOptions === 'object') {
    Object.assign(normalized, module.sinkOptions as ExecutorSinkOptions);
  }
  if (typeof module.onResult === 'function') {
    normalized.onResult = module.onResult as ExecutorSinkOptions['onResult'];
  }
  if (module.logger && typeof module.logger === 'object') {
    normalized.logger = module.logger as ExecutorSinkOptions['logger'];
  }
  if (typeof module.dryRun === 'boolean') {
    normalized.dryRun = module.dryRun;
  }
  if (typeof options.dryRun === 'boolean') {
    normalized.dryRun = options.dryRun;
  }

  return normalized;
}

function isProposalExecutor(value: unknown): value is ProposalExecutor {
  return (
    Boolean(value) && typeof (value as ProposalExecutor).execute === 'function'
  );
}

function isExecutorDeps(value: unknown): value is ProposalExecutorDeps {
  return typeof value === 'object' && value !== null;
}
