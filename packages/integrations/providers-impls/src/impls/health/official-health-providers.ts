import type {
  HealthListActivitiesParams,
  HealthListBiometricsResult,
  HealthListBiometricsParams,
  HealthListNutritionResult,
  HealthListNutritionParams,
  HealthListSleepResult,
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

type ProviderOptions = Omit<BaseHealthProviderOptions, 'providerKey'>;

interface OpenWearablesOptions extends ProviderOptions {
  upstreamProvider?: string;
  providerKey?: string;
}

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

function withMetricTypes(
  params: HealthListBiometricsParams
): Record<string, unknown> {
  return {
    ...buildSharedQuery(params),
    metricTypes: params.metricTypes,
  };
}

export class OpenWearablesHealthProvider extends BaseHealthProvider {
  private readonly upstreamProvider?: string;

  constructor(options: OpenWearablesOptions) {
    super({
      providerKey: options.providerKey ?? 'health.openwearables',
      apiBaseUrl: options.apiBaseUrl ?? 'https://api.openwearables.io',
      webhookSignatureHeader: 'x-openwearables-signature',
      ...options,
    });
    this.upstreamProvider = options.upstreamProvider;
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      apiPath: '/v1/activities',
      mcpTool: 'openwearables_list_activities',
      buildQuery: (input) => this.withUpstreamProvider(buildSharedQuery(input)),
      mapItem: (item, input) =>
        toHealthActivity(item, this.context(input), 'activity'),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      apiPath: '/v1/workouts',
      mcpTool: 'openwearables_list_workouts',
      buildQuery: (input) => this.withUpstreamProvider(buildSharedQuery(input)),
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(params: HealthListSleepParams) {
    return this.fetchSleep(params, {
      apiPath: '/v1/sleep',
      mcpTool: 'openwearables_list_sleep',
      buildQuery: (input) => this.withUpstreamProvider(buildSharedQuery(input)),
      mapItem: (item, input) => toHealthSleep(item, this.context(input)),
    });
  }

  async listBiometrics(params: HealthListBiometricsParams) {
    return this.fetchBiometrics(params, {
      apiPath: '/v1/biometrics',
      mcpTool: 'openwearables_list_biometrics',
      buildQuery: (input) => this.withUpstreamProvider(withMetricTypes(input)),
      mapItem: (item, input) => toHealthBiometric(item, this.context(input)),
    });
  }

  async listNutrition(params: HealthListNutritionParams) {
    return this.fetchNutrition(params, {
      apiPath: '/v1/nutrition',
      mcpTool: 'openwearables_list_nutrition',
      buildQuery: (input) => this.withUpstreamProvider(buildSharedQuery(input)),
      mapItem: (item, input) => toHealthNutrition(item, this.context(input)),
    });
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      apiPath: `/v1/connections/${encodeURIComponent(params.connectionId)}/status`,
      mcpTool: 'openwearables_connection_status',
    });
  }

  private withUpstreamProvider(
    query: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...query,
      ...(this.upstreamProvider
        ? { upstreamProvider: this.upstreamProvider }
        : {}),
    };
  }

  private context(params: HealthListActivitiesParams) {
    return {
      tenantId: params.tenantId,
      connectionId: params.connectionId,
      providerKey: this.providerKey,
    };
  }
}

export class AppleHealthBridgeProvider extends OpenWearablesHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      ...options,
      providerKey: 'health.apple-health',
      upstreamProvider: 'apple-health',
    });
  }
}

export class WhoopHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.whoop',
      apiBaseUrl: options.apiBaseUrl ?? 'https://api.prod.whoop.com',
      webhookSignatureHeader: 'x-whoop-signature',
      oauth: {
        tokenUrl:
          options.oauth?.tokenUrl ??
          'https://api.prod.whoop.com/oauth/oauth2/token',
        ...options.oauth,
      },
      ...options,
    });
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      apiPath: '/v2/activity/workout',
      mcpTool: 'whoop_list_activities',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) =>
        toHealthActivity(item, this.context(input), 'workout'),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      apiPath: '/v2/activity/workout',
      mcpTool: 'whoop_list_workouts',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(params: HealthListSleepParams) {
    return this.fetchSleep(params, {
      apiPath: '/v2/activity/sleep',
      mcpTool: 'whoop_list_sleep',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthSleep(item, this.context(input)),
    });
  }

  async listBiometrics(params: HealthListBiometricsParams) {
    return this.fetchBiometrics(params, {
      apiPath: '/v2/recovery',
      mcpTool: 'whoop_list_biometrics',
      buildQuery: withMetricTypes,
      mapItem: (item, input) =>
        toHealthBiometric(item, this.context(input), 'recovery_score'),
    });
  }

  async listNutrition(
    _params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult> {
    throw this.unsupported('nutrition');
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      apiPath: '/v2/user/profile/basic',
      mcpTool: 'whoop_connection_status',
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

export class OuraHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.oura',
      apiBaseUrl: options.apiBaseUrl ?? 'https://api.ouraring.com',
      webhookSignatureHeader: 'x-oura-signature',
      oauth: {
        tokenUrl:
          options.oauth?.tokenUrl ?? 'https://api.ouraring.com/oauth/token',
        ...options.oauth,
      },
      ...options,
    });
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      apiPath: '/v2/usercollection/daily_activity',
      mcpTool: 'oura_list_activities',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthActivity(item, this.context(input)),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      apiPath: '/v2/usercollection/workout',
      mcpTool: 'oura_list_workouts',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(params: HealthListSleepParams) {
    return this.fetchSleep(params, {
      apiPath: '/v2/usercollection/sleep',
      mcpTool: 'oura_list_sleep',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthSleep(item, this.context(input)),
    });
  }

  async listBiometrics(params: HealthListBiometricsParams) {
    return this.fetchBiometrics(params, {
      apiPath: '/v2/usercollection/daily_readiness',
      mcpTool: 'oura_list_biometrics',
      buildQuery: withMetricTypes,
      mapItem: (item, input) =>
        toHealthBiometric(item, this.context(input), 'readiness_score'),
    });
  }

  async listNutrition(
    _params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult> {
    throw this.unsupported('nutrition');
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      apiPath: '/v2/usercollection/personal_info',
      mcpTool: 'oura_connection_status',
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

export class StravaHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.strava',
      apiBaseUrl: options.apiBaseUrl ?? 'https://www.strava.com',
      webhookSignatureHeader: 'x-strava-signature',
      oauth: {
        tokenUrl:
          options.oauth?.tokenUrl ?? 'https://www.strava.com/oauth/token',
        ...options.oauth,
      },
      ...options,
    });
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      apiPath: '/api/v3/athlete/activities',
      mcpTool: 'strava_list_activities',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthActivity(item, this.context(input)),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      apiPath: '/api/v3/athlete/activities',
      mcpTool: 'strava_list_workouts',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(
    _params: HealthListSleepParams
  ): Promise<HealthListSleepResult> {
    throw this.unsupported('sleep');
  }

  async listBiometrics(
    _params: HealthListBiometricsParams
  ): Promise<HealthListBiometricsResult> {
    throw this.unsupported('biometrics');
  }

  async listNutrition(
    _params: HealthListNutritionParams
  ): Promise<HealthListNutritionResult> {
    throw this.unsupported('nutrition');
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      apiPath: '/api/v3/athlete',
      mcpTool: 'strava_connection_status',
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

export class FitbitHealthProvider extends BaseHealthProvider {
  constructor(options: ProviderOptions) {
    super({
      providerKey: 'health.fitbit',
      apiBaseUrl: options.apiBaseUrl ?? 'https://api.fitbit.com',
      webhookSignatureHeader: 'x-fitbit-signature',
      oauth: {
        tokenUrl:
          options.oauth?.tokenUrl ?? 'https://api.fitbit.com/oauth2/token',
        ...options.oauth,
      },
      ...options,
    });
  }

  async listActivities(params: HealthListActivitiesParams) {
    return this.fetchActivities(params, {
      apiPath: '/1/user/-/activities/list.json',
      mcpTool: 'fitbit_list_activities',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthActivity(item, this.context(input)),
    });
  }

  async listWorkouts(params: HealthListWorkoutsParams) {
    return this.fetchWorkouts(params, {
      apiPath: '/1/user/-/activities/list.json',
      mcpTool: 'fitbit_list_workouts',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthWorkout(item, this.context(input)),
    });
  }

  async listSleep(params: HealthListSleepParams) {
    return this.fetchSleep(params, {
      apiPath: '/1.2/user/-/sleep/list.json',
      mcpTool: 'fitbit_list_sleep',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthSleep(item, this.context(input)),
    });
  }

  async listBiometrics(params: HealthListBiometricsParams) {
    return this.fetchBiometrics(params, {
      apiPath: '/1/user/-/body/log/weight/date/today/1m.json',
      mcpTool: 'fitbit_list_biometrics',
      buildQuery: withMetricTypes,
      mapItem: (item, input) =>
        toHealthBiometric(item, this.context(input), 'weight'),
    });
  }

  async listNutrition(params: HealthListNutritionParams) {
    return this.fetchNutrition(params, {
      apiPath: '/1/user/-/foods/log/date/today.json',
      mcpTool: 'fitbit_list_nutrition',
      buildQuery: buildSharedQuery,
      mapItem: (item, input) => toHealthNutrition(item, this.context(input)),
    });
  }

  async getConnectionStatus(params: {
    tenantId: string;
    connectionId: string;
  }) {
    return this.fetchConnectionStatus(params, {
      apiPath: '/1/user/-/profile.json',
      mcpTool: 'fitbit_connection_status',
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
