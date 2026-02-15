import type {
  AnalyticsEventInput,
  AnalyticsIdentifyInput,
  AnalyticsMcpToolCall,
} from './analytics';

export interface AnalyticsWriter {
  capture(event: AnalyticsEventInput): Promise<void>;
  identify?(input: AnalyticsIdentifyInput): Promise<void>;
  callMcpTool?(call: AnalyticsMcpToolCall): Promise<unknown>;
}
