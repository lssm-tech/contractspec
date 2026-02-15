import type { AnalyticsReader } from './analytics-reader';
import type { AnalyticsWriter } from './analytics-writer';

export type AnalyticsRequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export interface AnalyticsRequest {
  method: AnalyticsRequestMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface AnalyticsResponse<T = unknown> {
  status: number;
  data: T;
  headers?: Record<string, string>;
}

export interface AnalyticsEventInput {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
  groups?: Record<string, string>;
}

export interface AnalyticsIdentifyInput {
  distinctId: string;
  properties?: Record<string, unknown>;
  setOnce?: Record<string, unknown>;
}

export interface AnalyticsQueryInput {
  query: string;
  values?: Record<string, unknown>;
}

export interface AnalyticsQueryResult {
  results: unknown;
  columns?: string[];
  types?: string[];
  hogql?: string;
  timings?: unknown;
}

export interface AnalyticsMcpToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

export type AnalyticsProvider = AnalyticsWriter &
  AnalyticsReader & {
    request<T = unknown>(
      request: AnalyticsRequest
    ): Promise<AnalyticsResponse<T>>;
  };

export * from './analytics-reader';
export * from './analytics-writer';
