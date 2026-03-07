import type {
  HealthListActivitiesParams,
  HealthListBiometricsParams,
  HealthListNutritionParams,
  HealthListSleepParams,
  HealthListWorkoutsParams,
} from '../../health';
import {
  BaseHealthProvider,
  type BaseHealthProviderOptions,
} from './base-health-provider';
import {
  toHealthActivity,
  toHealthBiometric,
  toHealthNutrition,
  toHealthSleep,
  toHealthWorkout,
} from './provider-normalizers';
import { OpenWearablesHealthProvider } from './official-health-providers';

type ProviderOptions = Omit<BaseHealthProviderOptions, 'providerKey'>;

const LIMITED_PROVIDER_SLUG = {
  'health.garmin': 'garmin',
  'health.myfitnesspal': 'myfitnesspal',
  'health.eightsleep': 'eightsleep',
  'health.peloton': 'peloton',
} as const;

function buildSharedQuery(
  params: HealthListActivitiesParams
): Record<string, unknown> {
  return {
    tenantId: params.tenantId,
    connectionId: params.connectionId,
    userId: params.userId,
    from: params.from,
    to: params.to,
    cursor: params.cursor,
    pageSize: params.pageSize,
  };
}

export class GarminHealthProvider extends OpenWearablesHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      ...options,
      providerKey: 'health.garmin',
      upstreamProvider: 'garmin',
    });
  }
}

export class MyFitnessPalHealthProvider extends OpenWearablesHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      ...options,
      providerKey: 'health.myfitnesspal',
      upstreamProvider: 'myfitnesspal',
    });
  }
}

export class EightSleepHealthProvider extends OpenWearablesHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      ...options,
      providerKey: 'health.eightsleep',
      upstreamProvider: 'eightsleep',
    });
  }
}

export class PelotonHealthProvider extends OpenWearablesHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      ...options,
      providerKey: 'health.peloton',
      upstreamProvider: 'peloton',
    });
  }
}

export interface UnofficialHealthAutomationProviderOptions extends ProviderOptions {
  providerKey:
    | 'health.garmin'
    | 'health.myfitnesspal'
    | 'health.eightsleep'
    | 'health.peloton';
}

export class UnofficialHealthAutomationProvider extends BaseHealthProvider {
  private readonly providerSlugValue: string;

  constructor(options: UnofficialHealthAutomationProviderOptions) {
    super({
      ...options,
      providerKey: options.providerKey,
      webhookSignatureHeader: 'x-unofficial-signature',
    });
    this.providerSlugValue = LIMITED_PROVIDER_SLUG[options.providerKey];
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      mcpTool: `${this.providerSlugValue}_list_activities`,
      buildQuery: buildSharedQuery,
      mapItem: (item, input) =>
        toHealthActivity(item, this.context(input), 'activity'),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      mcpTool: `${this.providerSlugValue}_list_workouts`,
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(params: HealthListSleepParams) {
    return this.fetchSleep(params, {
      mcpTool: `${this.providerSlugValue}_list_sleep`,
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthSleep(item, this.context(input)),
    });
  }

  async listBiometrics(params: HealthListBiometricsParams) {
    return this.fetchBiometrics(params, {
      mcpTool: `${this.providerSlugValue}_list_biometrics`,
      buildQuery: (input) => ({
        ...buildSharedQuery(input),
        metricTypes: input.metricTypes,
      }),
      mapItem: (item, input) => toHealthBiometric(item, this.context(input)),
    });
  }

  async listNutrition(params: HealthListNutritionParams) {
    return this.fetchNutrition(params, {
      mcpTool: `${this.providerSlugValue}_list_nutrition`,
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthNutrition(item, this.context(input)),
    });
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      mcpTool: `${this.providerSlugValue}_connection_status`,
    });
  }

  private context(params: HealthListActivitiesParams) {
    return {
      tenantId: params.tenantId,
      connectionId: params.connectionId,
      providerKey: this.providerKey,
    };
  }
}
