import type {
  AnalyticsReader,
  AnalyticsQueryInput,
  AnalyticsQueryResult,
  AnalyticsRequest,
  AnalyticsResponse,
  AnalyticsEvent,
  AnalyticsPerson,
  AnalyticsInsight,
  AnalyticsCohort,
  AnalyticsFeatureFlag,
  AnalyticsAnnotation,
  DateRangeInput,
  GetEventsInput,
  GetPersonsInput,
  GetInsightsInput,
  GetInsightResultInput,
  GetCohortsInput,
  GetFeatureFlagsInput,
  GetAnnotationsInput,
  PaginatedResponse,
} from '../analytics';

export interface PosthogReaderClient {
  request<T = unknown>(
    request: AnalyticsRequest
  ): Promise<AnalyticsResponse<T>>;
}

export interface PosthogAnalyticsReaderOptions {
  projectId?: string | number;
  client: PosthogReaderClient;
}

export class PosthogAnalyticsReader implements AnalyticsReader {
  private readonly projectId?: string | number;
  private readonly client: PosthogReaderClient;

  constructor(options: PosthogAnalyticsReaderOptions) {
    this.projectId = options.projectId;
    this.client = options.client;
  }

  async queryHogQL(input: AnalyticsQueryInput): Promise<AnalyticsQueryResult> {
    const projectId = resolveProjectId(undefined, this.projectId);
    const response = await this.client.request<AnalyticsQueryResult>({
      method: 'POST',
      path: `/api/projects/${projectId}/query`,
      body: {
        query: {
          kind: 'HogQLQuery',
          query: input.query,
          values: input.values,
        },
      },
    });
    return response.data;
  }

  async getEvents(
    input: GetEventsInput
  ): Promise<PaginatedResponse<AnalyticsEvent>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsEvent>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/events/`,
      query: {
        event: input.event ?? resolveSingleEvent(input.events),
        events: resolveEventList(input.events),
        distinct_id: input.distinctId,
        order_by: input.orderBy,
        limit: input.limit,
        offset: input.offset,
        properties: input.properties
          ? JSON.stringify(input.properties)
          : undefined,
        ...buildEventDateQuery(input.dateRange),
      },
    });
    return response.data;
  }

  async getPersons(
    input: GetPersonsInput
  ): Promise<PaginatedResponse<AnalyticsPerson>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsPerson>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/persons/`,
      query: {
        cohort_id: input.cohortId,
        search: input.search,
        limit: input.limit,
        offset: input.offset,
        properties: input.properties
          ? JSON.stringify(input.properties)
          : undefined,
      },
    });
    return response.data;
  }

  async getInsights(
    input: GetInsightsInput
  ): Promise<PaginatedResponse<AnalyticsInsight>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsInsight>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/insights/`,
      query: {
        insight: input.insightType,
        limit: input.limit,
        offset: input.offset,
      },
    });
    return response.data;
  }

  async getInsightResult(
    input: GetInsightResultInput
  ): Promise<AnalyticsInsight> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<AnalyticsInsight>({
      method: 'GET',
      path: `/api/projects/${projectId}/insights/${input.insightId}/`,
    });
    return response.data;
  }

  async getCohorts(
    input: GetCohortsInput
  ): Promise<PaginatedResponse<AnalyticsCohort>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsCohort>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/cohorts/`,
      query: {
        limit: input.limit,
        offset: input.offset,
      },
    });
    return response.data;
  }

  async getFeatureFlags(
    input: GetFeatureFlagsInput
  ): Promise<PaginatedResponse<AnalyticsFeatureFlag>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsFeatureFlag>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/feature_flags/`,
      query: {
        active: input.active,
        limit: input.limit,
        offset: input.offset,
      },
    });
    return response.data;
  }

  async getAnnotations(
    input: GetAnnotationsInput
  ): Promise<PaginatedResponse<AnalyticsAnnotation>> {
    const projectId = resolveProjectId(input.projectId, this.projectId);
    const response = await this.client.request<
      PaginatedResponse<AnalyticsAnnotation>
    >({
      method: 'GET',
      path: `/api/projects/${projectId}/annotations/`,
      query: {
        limit: input.limit,
        offset: input.offset,
        ...buildAnnotationDateQuery(input.dateRange),
      },
    });
    return response.data;
  }
}

function resolveProjectId(
  inputProjectId: string | number | undefined,
  defaultProjectId: string | number | undefined
): string | number {
  const projectId = inputProjectId ?? defaultProjectId;
  if (!projectId) {
    throw new Error('PostHog projectId is required for API reads.');
  }
  return projectId;
}

function resolveSingleEvent(events?: string[]): string | undefined {
  if (!events || events.length !== 1) return undefined;
  return events[0];
}

function resolveEventList(events?: string[]): string | undefined {
  if (!events || events.length <= 1) return undefined;
  return events.join(',');
}

function buildEventDateQuery(
  range?: DateRangeInput
): Record<string, string | undefined> {
  const after = formatDate(range?.from);
  const before = formatDate(range?.to);
  return {
    after,
    before,
    timezone: range?.timezone,
  };
}

function buildAnnotationDateQuery(
  range?: DateRangeInput
): Record<string, string | undefined> {
  const dateFrom = formatDate(range?.from);
  const dateTo = formatDate(range?.to);
  return {
    date_from: dateFrom,
    date_to: dateTo,
    timezone: range?.timezone,
  };
}

function formatDate(value?: string | Date): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.toISOString();
}
