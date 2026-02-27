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
  oauthTokenUrl?: string;
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

const OFFICIAL_TRANSPORT_SUPPORTED_BY_PROVIDER: Record<
  HealthProviderKey,
  boolean
> = {
  'health.openwearables': false,
  'health.whoop': true,
  'health.apple-health': false,
  'health.oura': true,
  'health.strava': true,
  'health.garmin': false,
  'health.fitbit': true,
  'health.myfitnesspal': false,
  'health.eightsleep': false,
  'health.peloton': false,
};

const UNOFFICIAL_SUPPORTED_BY_PROVIDER: Record<HealthProviderKey, boolean> = {
  'health.openwearables': false,
  'health.whoop': false,
  'health.apple-health': false,
  'health.oura': false,
  'health.strava': false,
  'health.garmin': true,
  'health.fitbit': false,
  'health.myfitnesspal': true,
  'health.eightsleep': true,
  'health.peloton': true,
};

export function createHealthProviderFromContext(
  context: IntegrationContext,
  secrets: Record<string, unknown>
): HealthProvider {
  const providerKey = context.spec.meta.key as HealthProviderKey;
  const config = toFactoryConfig(context.config);
  const strategyOrder = buildStrategyOrder(config);
  const attemptLogs: string[] = [];

  for (let index = 0; index < strategyOrder.length; index += 1) {
    const strategy = strategyOrder[index];
    if (!strategy) continue;
    const route = index === 0 ? 'primary' : 'fallback';

    if (!supportsStrategy(providerKey, strategy)) {
      attemptLogs.push(`${strategy}: unsupported by ${providerKey}`);
      continue;
    }

    if (!hasCredentialsForStrategy(strategy, config, secrets)) {
      attemptLogs.push(`${strategy}: missing credentials`);
      continue;
    }

    const provider = createHealthProviderForStrategy(
      providerKey,
      strategy,
      route,
      config,
      secrets
    );
    if (provider) {
      return provider;
    }
    attemptLogs.push(`${strategy}: not available`);
  }

  throw new Error(
    `Unable to resolve health provider for ${providerKey}. Strategies attempted: ${attemptLogs.join(
      ', '
    )}.`
  );
}

function createHealthProviderForStrategy(
  providerKey: HealthProviderKey,
  strategy: HealthTransportStrategy,
  route: 'primary' | 'fallback',
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
    route,
    oauth: {
      tokenUrl: config.oauthTokenUrl,
      refreshToken: getSecretString(secrets, 'refreshToken'),
      clientId: getSecretString(secrets, 'clientId'),
      clientSecret: getSecretString(secrets, 'clientSecret'),
      tokenExpiresAt: getSecretString(secrets, 'tokenExpiresAt'),
    },
  };

  if (strategy === 'aggregator-api' || strategy === 'aggregator-mcp') {
    return createAggregatorProvider(providerKey, {
      ...options,
      aggregatorKey: 'health.openwearables',
    });
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

function createAggregatorProvider(
  providerKey: HealthProviderKey,
  options: {
    transport: HealthDataTransport;
    apiBaseUrl?: string;
    mcpUrl?: string;
    apiKey?: string;
    accessToken?: string;
    mcpAccessToken?: string;
    webhookSecret?: string;
    route: 'primary' | 'fallback';
    aggregatorKey?: string;
    oauth: {
      tokenUrl?: string;
      refreshToken?: string;
      clientId?: string;
      clientSecret?: string;
      tokenExpiresAt?: string;
    };
  }
): HealthProvider {
  if (providerKey === 'health.apple-health') {
    return new AppleHealthBridgeProvider(options);
  }
  if (providerKey === 'health.garmin') {
    return new GarminHealthProvider(options);
  }
  if (providerKey === 'health.myfitnesspal') {
    return new MyFitnessPalHealthProvider(options);
  }
  if (providerKey === 'health.eightsleep') {
    return new EightSleepHealthProvider(options);
  }
  if (providerKey === 'health.peloton') {
    return new PelotonHealthProvider(options);
  }
  if (providerKey === 'health.openwearables') {
    return new OpenWearablesHealthProvider(options);
  }

  return new OpenWearablesHealthProvider({
    ...options,
    providerKey,
    upstreamProvider: providerKey.replace('health.', ''),
  });
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
    route: 'primary' | 'fallback';
    aggregatorKey?: string;
    oauth: {
      tokenUrl?: string;
      refreshToken?: string;
      clientId?: string;
      clientSecret?: string;
      tokenExpiresAt?: string;
    };
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
      return new MyFitnessPalHealthProvider({
        ...options,
        transport: 'aggregator-api',
      });
    case 'health.eightsleep':
      return new EightSleepHealthProvider({
        ...options,
        transport: 'aggregator-api',
      });
    case 'health.peloton':
      return new PelotonHealthProvider({
        ...options,
        transport: 'aggregator-api',
      });
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
    oauthTokenUrl: asString(record.oauthTokenUrl),
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

function supportsStrategy(
  providerKey: HealthProviderKey,
  strategy: HealthTransportStrategy
): boolean {
  if (strategy === 'official-api' || strategy === 'official-mcp') {
    return OFFICIAL_TRANSPORT_SUPPORTED_BY_PROVIDER[providerKey];
  }
  if (strategy === 'unofficial') {
    return UNOFFICIAL_SUPPORTED_BY_PROVIDER[providerKey];
  }
  return true;
}

function hasCredentialsForStrategy(
  strategy: HealthTransportStrategy,
  config: HealthProviderFactoryConfig,
  secrets: Record<string, unknown>
): boolean {
  const hasApiCredential =
    Boolean(getSecretString(secrets, 'accessToken')) ||
    Boolean(getSecretString(secrets, 'apiKey'));
  const hasMcpCredential =
    Boolean(getSecretString(secrets, 'mcpAccessToken')) || hasApiCredential;

  if (strategy === 'official-api' || strategy === 'aggregator-api') {
    return hasApiCredential;
  }

  if (strategy === 'official-mcp' || strategy === 'aggregator-mcp') {
    return Boolean(config.mcpUrl) && hasMcpCredential;
  }

  const hasAutomationCredential =
    hasMcpCredential ||
    (Boolean(getSecretString(secrets, 'username')) &&
      Boolean(getSecretString(secrets, 'password')));
  return Boolean(config.mcpUrl) && hasAutomationCredential;
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
