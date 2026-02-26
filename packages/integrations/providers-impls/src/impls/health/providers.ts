import type { HealthTransportStrategy } from '@contractspec/integration.runtime/runtime';
import {
  BaseHealthProvider,
  type BaseHealthProviderOptions,
} from './base-health-provider';

type ProviderOptions = Omit<BaseHealthProviderOptions, 'providerKey'>;

function createProviderOptions(
  options: ProviderOptions,
  fallbackTransport: HealthTransportStrategy
): ProviderOptions {
  return {
    ...options,
    transport: options.transport ?? fallbackTransport,
  };
}

export class OpenWearablesHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.openwearables',
      ...createProviderOptions(options, 'aggregator-api'),
    });
  }
}

export class WhoopHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.whoop',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class AppleHealthBridgeProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.apple-health',
      ...createProviderOptions(options, 'aggregator-api'),
    });
  }
}

export class OuraHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.oura',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class StravaHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.strava',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class GarminHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.garmin',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class FitbitHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.fitbit',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class MyFitnessPalHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.myfitnesspal',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class EightSleepHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.eightsleep',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export class PelotonHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.peloton',
      ...createProviderOptions(options, 'official-api'),
    });
  }
}

export interface UnofficialHealthAutomationProviderOptions extends ProviderOptions {
  providerKey:
    | 'health.myfitnesspal'
    | 'health.eightsleep'
    | 'health.peloton'
    | 'health.garmin';
}

export class UnofficialHealthAutomationProvider extends BaseHealthProvider {
  constructor(options: UnofficialHealthAutomationProviderOptions) {
    super({
      ...createProviderOptions(options, 'unofficial'),
      providerKey: options.providerKey,
    });
  }
}
