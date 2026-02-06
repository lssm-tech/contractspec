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

export interface AnalyticsProvider {
  capture(event: AnalyticsEventInput): Promise<void>;
  identify?(input: AnalyticsIdentifyInput): Promise<void>;
  queryHogQL?(input: AnalyticsQueryInput): Promise<AnalyticsQueryResult>;
  request<T = unknown>(
    request: AnalyticsRequest
  ): Promise<AnalyticsResponse<T>>;
  callMcpTool?(call: AnalyticsMcpToolCall): Promise<unknown>;
}
