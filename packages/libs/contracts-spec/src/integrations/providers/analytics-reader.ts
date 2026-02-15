import type { AnalyticsQueryInput, AnalyticsQueryResult } from './analytics';

export type AnalyticsPropertyFilter = Record<
  string,
  string | number | boolean | null
>;

export interface DateRangeInput {
  from?: string | Date;
  to?: string | Date;
  timezone?: string;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface GetEventsInput extends PaginationInput {
  projectId?: string | number;
  event?: string;
  events?: string[];
  distinctId?: string;
  properties?: AnalyticsPropertyFilter;
  dateRange?: DateRangeInput;
  orderBy?: 'timestamp' | '-timestamp';
}

export interface GetPersonsInput extends PaginationInput {
  projectId?: string | number;
  cohortId?: string | number;
  properties?: AnalyticsPropertyFilter;
  search?: string;
}

export type AnalyticsInsightType =
  | 'TRENDS'
  | 'FUNNELS'
  | 'RETENTION'
  | 'PATHS'
  | 'STICKINESS'
  | 'LIFECYCLE'
  | 'SESSIONS'
  | 'CUSTOM';

export interface GetInsightsInput extends PaginationInput {
  projectId?: string | number;
  insightType?: AnalyticsInsightType;
}

export interface GetInsightResultInput {
  projectId?: string | number;
  insightId: string | number;
}

export interface GetCohortsInput extends PaginationInput {
  projectId?: string | number;
}

export interface GetFeatureFlagsInput extends PaginationInput {
  projectId?: string | number;
  active?: boolean;
}

export interface GetAnnotationsInput extends PaginationInput {
  projectId?: string | number;
  dateRange?: DateRangeInput;
}

export interface AnalyticsEvent {
  id?: string | number;
  event: string;
  distinctId: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

export interface AnalyticsPerson {
  id?: string | number;
  distinctId?: string;
  properties?: Record<string, unknown>;
  createdAt?: string;
}

export interface AnalyticsInsight {
  id?: string | number;
  name?: string;
  type?: AnalyticsInsightType | string;
  filters?: Record<string, unknown>;
  result?: unknown;
}

export interface AnalyticsCohort {
  id?: string | number;
  name?: string;
  groups?: unknown;
  count?: number;
}

export interface AnalyticsFeatureFlag {
  id?: string | number;
  key?: string;
  name?: string;
  active?: boolean;
  filters?: Record<string, unknown>;
  rolloutPercentage?: number;
}

export interface AnalyticsAnnotation {
  id?: string | number;
  content?: string;
  dateMarker?: string;
  scope?: string;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface AnalyticsReader {
  queryHogQL?(input: AnalyticsQueryInput): Promise<AnalyticsQueryResult>;
  getEvents?(input: GetEventsInput): Promise<PaginatedResponse<AnalyticsEvent>>;
  getPersons?(
    input: GetPersonsInput
  ): Promise<PaginatedResponse<AnalyticsPerson>>;
  getInsights?(
    input: GetInsightsInput
  ): Promise<PaginatedResponse<AnalyticsInsight>>;
  getInsightResult?(input: GetInsightResultInput): Promise<AnalyticsInsight>;
  getCohorts?(
    input: GetCohortsInput
  ): Promise<PaginatedResponse<AnalyticsCohort>>;
  getFeatureFlags?(
    input: GetFeatureFlagsInput
  ): Promise<PaginatedResponse<AnalyticsFeatureFlag>>;
  getAnnotations?(
    input: GetAnnotationsInput
  ): Promise<PaginatedResponse<AnalyticsAnnotation>>;
}
