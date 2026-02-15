import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  MeetingRecorderGetMeeting,
  MeetingRecorderListMeetings,
  registerMeetingRecorderMeetingContracts,
} from './meetings';
import {
  MeetingRecorderGetTranscript,
  MeetingRecorderSyncTranscript,
  registerMeetingRecorderTranscriptContracts,
} from './transcripts';
import {
  MeetingRecorderWebhookIngest,
  registerMeetingRecorderWebhookContracts,
} from './webhooks';

export {
  MeetingRecorderGetMeeting,
  MeetingRecorderListMeetings,
  MeetingRecorderGetTranscript,
  MeetingRecorderSyncTranscript,
  MeetingRecorderWebhookIngest,
};

export * from '../meeting-recorder.feature';

export function registerMeetingRecorderContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registerMeetingRecorderWebhookContracts(
    registerMeetingRecorderTranscriptContracts(
      registerMeetingRecorderMeetingContracts(registry)
    )
  );
}
