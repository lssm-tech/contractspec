import type { HealthProvider, HealthDataTransport } from '../health';
import type { IntegrationContext } from '@contractspec/integration.runtime/runtime';
import {
  isUnofficialHealthProviderAllowed,
  resolveHealthStrategyOrder,
  type HealthTransportStrategy,
} from '@contractspec/integration.runtime/runtime';
import {
  AppleHealthBridgeProvider,
  EightSleepHealthProvider,
  FitbitHealthProvider,
  GarminHealthProvider,
  MyFitnessPalHealthProvider,
  OpenWearablesHealthProvider,
  OuraHealthProvider,
  PelotonHealthProvider,
  StravaHealthProvider,
  UnofficialHealthAutomationProvider,
  WhoopHealthProvider,
} from './health/providers';

interface HealthProviderFactoryConfig {
  apiBaseUrl?: string;
  mcpUrl?: string;
  defaultTransport?: HealthTransportStrategy;
  strategyOrder?: HealthTransportStrategy[];
  allowUnofficial?: boolean;
  unofficialAllowList?: string[];
}

type HealthProviderKey =
  | 'health.openwearables'
  | 'health.whoop'
  | 'health.apple-health'
  | 'health.oura'
  | 'health.strava'
  | 'health.garmin'
  | 'health.fitbit'
  | 'health.myfitnesspal'
  | 'health.eightsleep'
  | 'health.peloton';

export function createHealthProviderFromContext(
  context: IntegrationContext,
  secrets: Record<string, unknown>
): HealthProvider {
  const providerKey = context.spec.meta.key as HealthProviderKey;
  const config = toFactoryConfig(context.config);
  const strategyOrder = buildStrategyOrder(config);
  const errors: string[] = [];

  for (const strategy of strategyOrder) {
    const provider = createHealthProviderForStrategy(
      providerKey,
      strategy,
      config,
      secrets
    );
    if (provider) {
      return provider;
    }
    errors.push(`${strategy}: not available`);
  }

  throw new Error(
    `Unable to resolve health provider for ${providerKey}. Strategies attempted: ${errors.join(
      ', '
    )}.`
  );
}

function createHealthProviderForStrategy(
  providerKey: HealthProviderKey,
  strategy: HealthTransportStrategy,
  config: HealthProviderFactoryConfig,
  secrets: Record<string, unknown>
): HealthProvider | undefined {
  const options = {
    transport: strategy,
    apiBaseUrl: config.apiBaseUrl,
    mcpUrl: config.mcpUrl,
    apiKey: getSecretString(secrets, 'apiKey'),
    accessToken: getSecretString(secrets, 'accessToken'),
    mcpAccessToken: getSecretString(secrets, 'mcpAccessToken'),
    webhookSecret: getSecretString(secrets, 'webhookSecret'),
  };

  if (strategy === 'aggregator-api' || strategy === 'aggregator-mcp') {
    return new OpenWearablesHealthProvider(options);
  }

  if (strategy === 'unofficial') {
    if (!isUnofficialHealthProviderAllowed(providerKey, config)) {
      return undefined;
    }
    if (
      providerKey !== 'health.myfitnesspal' &&
      providerKey !== 'health.eightsleep' &&
      providerKey !== 'health.peloton' &&
      providerKey !== 'health.garmin'
    ) {
      return undefined;
    }
    return new UnofficialHealthAutomationProvider({
      ...options,
      providerKey,
    });
  }

  if (strategy === 'official-mcp') {
    return createOfficialProvider(providerKey, {
      ...options,
      transport: 'official-mcp',
    });
  }

  return createOfficialProvider(providerKey, options);
}

function createOfficialProvider(
  providerKey: HealthProviderKey,
  options: {
    transport: HealthDataTransport;
    apiBaseUrl?: string;
    mcpUrl?: string;
    apiKey?: string;
    accessToken?: string;
    mcpAccessToken?: string;
    webhookSecret?: string;
  }
): HealthProvider {
  switch (providerKey) {
    case 'health.openwearables':
      return new OpenWearablesHealthProvider(options);
    case 'health.whoop':
      return new WhoopHealthProvider(options);
    case 'health.apple-health':
      return new AppleHealthBridgeProvider(options);
    case 'health.oura':
      return new OuraHealthProvider(options);
    case 'health.strava':
      return new StravaHealthProvider(options);
    case 'health.garmin':
      return new GarminHealthProvider(options);
    case 'health.fitbit':
      return new FitbitHealthProvider(options);
    case 'health.myfitnesspal':
      return new MyFitnessPalHealthProvider(options);
    case 'health.eightsleep':
      return new EightSleepHealthProvider(options);
    case 'health.peloton':
      return new PelotonHealthProvider(options);
    default:
      throw new Error(`Unsupported health provider key: ${providerKey}`);
  }
}

function toFactoryConfig(config: unknown): HealthProviderFactoryConfig {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return {};
  }
  const record = config as Record<string, unknown>;
  return {
    apiBaseUrl: asString(record.apiBaseUrl),
    mcpUrl: asString(record.mcpUrl),
    defaultTransport: normalizeTransport(record.defaultTransport),
    strategyOrder: normalizeTransportArray(record.strategyOrder),
    allowUnofficial:
      typeof record.allowUnofficial === 'boolean'
        ? record.allowUnofficial
        : false,
    unofficialAllowList: Array.isArray(record.unofficialAllowList)
      ? record.unofficialAllowList
          .map((item) => (typeof item === 'string' ? item : undefined))
          .filter((item): item is string => Boolean(item))
      : undefined,
  };
}

function buildStrategyOrder(
  config: HealthProviderFactoryConfig
): HealthTransportStrategy[] {
  const order = resolveHealthStrategyOrder(config);
  if (!config.defaultTransport) {
    return order;
  }
  const withoutDefault = order.filter(
    (item) => item !== config.defaultTransport
  );
  return [config.defaultTransport, ...withoutDefault];
}

function normalizeTransport(
  value: unknown
): HealthTransportStrategy | undefined {
  if (typeof value !== 'string') return undefined;
  if (
    value === 'official-api' ||
    value === 'official-mcp' ||
    value === 'aggregator-api' ||
    value === 'aggregator-mcp' ||
    value === 'unofficial'
  ) {
    return value;
  }
  return undefined;
}

function normalizeTransportArray(
  value: unknown
): HealthTransportStrategy[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const transports = value
    .map((item) => normalizeTransport(item))
    .filter((item): item is HealthTransportStrategy => Boolean(item));
  return transports.length > 0 ? transports : undefined;
}

function getSecretString(
  secrets: Record<string, unknown>,
  key: string
): string | undefined {
  const value = secrets[key];
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : undefined;
}
