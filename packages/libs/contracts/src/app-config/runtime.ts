import type { CapabilityRef, CapabilityRegistry, CapabilitySpec } from '../capabilities';
import type { FeatureRegistry, FeatureModuleSpec, FeatureRef } from '../features';
import type { DataViewRegistry, DataViewSpec } from '../data-views';
import type { WorkflowRegistry, WorkflowSpec } from '../workflow/spec';
import type { PolicyRegistry, PolicySpec } from '../policy/spec';
import type { ThemeRegistry, ThemeSpec } from '../themes';
import type { TelemetryRegistry, TelemetrySpec } from '../telemetry/spec';
import type { ExperimentRef, ExperimentRegistry, ExperimentSpec } from '../experiments/spec';
import type { AppConfigSpec, SpecPointer } from './spec';

export interface AppComposition {
  config: AppConfigSpec;
  capabilities: CapabilitySpec[];
  features: FeatureModuleSpec[];
  dataViews: Record<string, DataViewSpec>;
  workflows: Record<string, WorkflowSpec>;
  policies: PolicySpec[];
  theme?: ThemeSpec;
  themeFallbacks: ThemeSpec[];
  telemetry?: TelemetrySpec;
  experiments: {
    active: ExperimentSpec[];
    paused: ExperimentSpec[];
  };
  missing: MissingReference[];
}

export interface MissingReference {
  type:
    | 'capability'
    | 'feature'
    | 'dataView'
    | 'workflow'
    | 'policy'
    | 'theme'
    | 'telemetry'
    | 'experiment';
  identifier: string;
}

export interface AppCompositionDeps {
  capabilities?: CapabilityRegistry;
  features?: FeatureRegistry;
  dataViews?: DataViewRegistry;
  workflows?: WorkflowRegistry;
  policies?: PolicyRegistry;
  themes?: ThemeRegistry;
  telemetry?: TelemetryRegistry;
  experiments?: ExperimentRegistry;
}

export interface ComposeOptions {
  strict?: boolean;
}

export function composeAppConfig(
  config: AppConfigSpec,
  deps: AppCompositionDeps,
  options: ComposeOptions = {}
): AppComposition {
  const missing: MissingReference[] = [];

  const capabilities = resolveCapabilityRefs(
    config.capabilities?.enabled ?? [],
    deps.capabilities,
    missing
  );

  const features = resolveFeatureRefs(
    config.features?.include ?? [],
    deps.features,
    missing
  );

  const dataViews = resolvePointerRecord(
    config.dataViews ?? {},
    deps.dataViews,
    'dataView',
    missing
  );

  const workflows = resolvePointerRecord(
    config.workflows ?? {},
    deps.workflows,
    'workflow',
    missing
  );

  const policies = config.policies
    ? (config.policies
        .map((policy) => {
          const registry = deps.policies;
          if (!registry) {
            missing.push({
              type: 'policy',
              identifier: policy.name,
            });
            return null;
          }
          const spec = registry.get(policy.name, policy.version);
          if (!spec) {
            missing.push({
              type: 'policy',
              identifier: `${policy.name}${policy.version ? `.v${policy.version}` : ''}`,
            });
            return null;
          }
          return spec;
        })
        .filter(Boolean) as PolicySpec[])
    : [];

  const { theme, fallbacks, themeMissing } = resolveThemeBinding(
    config.theme,
    deps.themes
  );
  missing.push(...themeMissing);

  const { telemetry, telemetryMissing } = resolveTelemetryBinding(
    config.telemetry,
    deps.telemetry
  );
  missing.push(...telemetryMissing);

  const experiments = resolveExperiments(
    config.experiments,
    deps.experiments,
    missing
  );

  if (options.strict && missing.length > 0) {
    const reasons = missing.map((item) => `${item.type}:${item.identifier}`).join(', ');
    throw new Error(`composeAppConfig: missing references -> ${reasons}`);
  }

  return {
    config,
    capabilities,
    features,
    dataViews,
    workflows,
    policies,
    theme,
    themeFallbacks: fallbacks,
    telemetry,
    experiments,
    missing,
  };
}

function resolveCapabilityRefs(
  refs: CapabilityRef[],
  registry: CapabilityRegistry | undefined,
  missing: MissingReference[]
): CapabilitySpec[] {
  if (!registry) {
    if (refs.length > 0) {
      for (const ref of refs) {
        missing.push({
          type: 'capability',
          identifier: `${ref.key}${ref.version ? `.v${ref.version}` : ''}`,
        });
      }
    }
    return [];
  }

  const resolved: CapabilitySpec[] = [];
  for (const ref of refs) {
    const spec = registry.get(ref.key, ref.version);
    if (!spec) {
      missing.push({
        type: 'capability',
        identifier: `${ref.key}${ref.version ? `.v${ref.version}` : ''}`,
      });
      continue;
    }
    resolved.push(spec);
  }
  return resolved;
}

function resolveFeatureRefs(
  refs: FeatureRef[],
  registry: FeatureRegistry | undefined,
  missing: MissingReference[]
): FeatureModuleSpec[] {
  if (!registry) {
    if (refs.length > 0) {
      for (const ref of refs) {
        missing.push({ type: 'feature', identifier: ref.key });
      }
    }
    return [];
  }
  const resolved: FeatureModuleSpec[] = [];
  for (const ref of refs) {
    const spec = registry.get(ref.key);
    if (!spec) {
      missing.push({ type: 'feature', identifier: ref.key });
      continue;
    }
    resolved.push(spec);
  }
  return resolved;
}

function resolvePointerRecord<TSpec>(
  record: Record<string, SpecPointer>,
  registry: { get(name: string, version?: number): TSpec | undefined } | undefined,
  type:
    | 'dataView'
    | 'workflow',
  missing: MissingReference[]
): Record<string, TSpec> {
  if (!registry) {
    if (Object.keys(record).length > 0) {
      for (const [slot, pointer] of Object.entries(record)) {
        missing.push({
          type,
          identifier: `${slot} -> ${pointer.name}${pointer.version ? `.v${pointer.version}` : ''}`,
        });
      }
    }
    return {};
  }
  const resolved: Record<string, TSpec> = {};
  for (const [slot, pointer] of Object.entries(record)) {
    const spec = registry.get(pointer.name, pointer.version);
    if (!spec) {
      missing.push({
        type,
        identifier: `${slot} -> ${pointer.name}${pointer.version ? `.v${pointer.version}` : ''}`,
      });
      continue;
    }
    resolved[slot] = spec;
  }
  return resolved;
}

function resolveThemeBinding(
  binding: AppConfigSpec['theme'],
  registry: ThemeRegistry | undefined
): { theme?: ThemeSpec; fallbacks: ThemeSpec[]; themeMissing: MissingReference[] } {
  const themeMissing: MissingReference[] = [];
  if (!binding) {
    return { theme: undefined, fallbacks: [], themeMissing };
  }
  if (!registry) {
    themeMissing.push({
      type: 'theme',
      identifier: `${binding.primary.name}.v${binding.primary.version}`,
    });
    if (binding.fallbacks) {
      for (const fallback of binding.fallbacks) {
        themeMissing.push({
          type: 'theme',
          identifier: `${fallback.name}.v${fallback.version}`,
        });
      }
    }
    return { theme: undefined, fallbacks: [], themeMissing };
  }
  const theme = registry.get(binding.primary.name, binding.primary.version);
  if (!theme) {
    themeMissing.push({
      type: 'theme',
      identifier: `${binding.primary.name}.v${binding.primary.version}`,
    });
  }
  const fallbacks: ThemeSpec[] = [];
  if (binding.fallbacks) {
    for (const fallback of binding.fallbacks) {
      const spec = registry.get(fallback.name, fallback.version);
      if (!spec) {
        themeMissing.push({
          type: 'theme',
          identifier: `${fallback.name}.v${fallback.version}`,
        });
        continue;
      }
      fallbacks.push(spec);
    }
  }
  return { theme: theme ?? undefined, fallbacks, themeMissing };
}

function resolveTelemetryBinding(
  binding: AppConfigSpec['telemetry'],
  registry: TelemetryRegistry | undefined
): { telemetry?: TelemetrySpec; telemetryMissing: MissingReference[] } {
  const telemetryMissing: MissingReference[] = [];
  if (!binding?.spec) {
    return { telemetry: undefined, telemetryMissing };
  }
  if (!registry) {
    telemetryMissing.push({
      type: 'telemetry',
      identifier: `${binding.spec.name}${binding.spec.version ? `.v${binding.spec.version}` : ''}`,
    });
    return { telemetry: undefined, telemetryMissing };
  }
  const telemetry = registry.get(binding.spec.name, binding.spec.version);
  if (!telemetry) {
    telemetryMissing.push({
      type: 'telemetry',
      identifier: `${binding.spec.name}${binding.spec.version ? `.v${binding.spec.version}` : ''}`,
    });
  }
  return { telemetry: telemetry ?? undefined, telemetryMissing };
}

function resolveExperiments(
  experiments: AppConfigSpec['experiments'],
  registry: ExperimentRegistry | undefined,
  missing: MissingReference[]
): { active: ExperimentSpec[]; paused: ExperimentSpec[] } {
  const resolveList = (refs: ExperimentRef[] | undefined): ExperimentSpec[] => {
    if (!refs || refs.length === 0) return [];
    if (!registry) {
      for (const ref of refs) {
        missing.push({
          type: 'experiment',
          identifier: `${ref.name}${ref.version ? `.v${ref.version}` : ''}`,
        });
      }
      return [];
    }
    const resolved: ExperimentSpec[] = [];
    for (const ref of refs) {
      const spec = registry.get(ref.name, ref.version);
      if (!spec) {
        missing.push({
          type: 'experiment',
          identifier: `${ref.name}${ref.version ? `.v${ref.version}` : ''}`,
        });
        continue;
      }
      resolved.push(spec);
    }
    return resolved;
  };

  return {
    active: resolveList(experiments?.active),
    paused: resolveList(experiments?.paused),
  };
}

