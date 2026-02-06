import { GranolaMeetingRecorderProvider } from '@contractspec/integration.providers-impls/impls/granola-meeting-recorder';
import { TldvMeetingRecorderProvider } from '@contractspec/integration.providers-impls/impls/tldv-meeting-recorder';
import { FirefliesMeetingRecorderProvider } from '@contractspec/integration.providers-impls/impls/fireflies-meeting-recorder';
import { FathomMeetingRecorderProvider } from '@contractspec/integration.providers-impls/impls/fathom-meeting-recorder';
import type { MeetingRecorderProvider } from '@contractspec/lib.contracts/integrations/providers/meeting-recorder';

export type MeetingRecorderIntegrationKey =
  | 'meeting-recorder.granola'
  | 'meeting-recorder.tldv'
  | 'meeting-recorder.fireflies'
  | 'meeting-recorder.fathom';

export interface MeetingRecorderProviderSecrets {
  apiKey: string;
  webhookSecret?: string;
}

export interface MeetingRecorderProviderConfig {
  baseUrl?: string;
  pageSize?: number;
  transcriptsPageSize?: number;
  includeTranscript?: boolean;
  includeSummary?: boolean;
  includeActionItems?: boolean;
  includeCrmMatches?: boolean;
  triggeredFor?: string[];
  maxPages?: number;
}

export interface MeetingRecorderProviderFactoryInput {
  integrationKey: MeetingRecorderIntegrationKey;
  secrets: MeetingRecorderProviderSecrets;
  config?: MeetingRecorderProviderConfig;
}

export function createMeetingRecorderProvider(
  input: MeetingRecorderProviderFactoryInput
): MeetingRecorderProvider {
  const { integrationKey, secrets, config } = input;

  if (!secrets.apiKey) {
    throw new Error('Meeting recorder apiKey is required.');
  }

  switch (integrationKey) {
    case 'meeting-recorder.granola':
      return new GranolaMeetingRecorderProvider({
        apiKey: secrets.apiKey,
        baseUrl: config?.baseUrl,
        pageSize: config?.pageSize,
      });
    case 'meeting-recorder.tldv':
      return new TldvMeetingRecorderProvider({
        apiKey: secrets.apiKey,
        baseUrl: config?.baseUrl,
        pageSize: config?.pageSize,
      });
    case 'meeting-recorder.fireflies':
      return new FirefliesMeetingRecorderProvider({
        apiKey: secrets.apiKey,
        baseUrl: config?.baseUrl,
        pageSize: config?.transcriptsPageSize ?? config?.pageSize,
        webhookSecret: secrets.webhookSecret,
      });
    case 'meeting-recorder.fathom':
      return new FathomMeetingRecorderProvider({
        apiKey: secrets.apiKey,
        baseUrl: config?.baseUrl,
        includeTranscript: config?.includeTranscript,
        includeSummary: config?.includeSummary,
        includeActionItems: config?.includeActionItems,
        includeCrmMatches: config?.includeCrmMatches,
        triggeredFor: config?.triggeredFor,
        maxPages: config?.maxPages,
        webhookSecret: secrets.webhookSecret,
      });
    default:
      throw new Error(
        `Unsupported meeting recorder provider: ${integrationKey}`
      );
  }
}
