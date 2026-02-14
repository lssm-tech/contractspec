import type {
  MeetingRecorderGetTranscriptParams,
  MeetingTranscriptRecord,
} from '@contractspec/lib.contracts-integrations';

import {
  createMeetingRecorderProvider,
  type MeetingRecorderProviderFactoryInput,
} from './create-provider';

export interface GetMeetingRecorderTranscriptInput extends MeetingRecorderProviderFactoryInput {
  params: MeetingRecorderGetTranscriptParams;
}

export async function getMeetingRecorderTranscript(
  input: GetMeetingRecorderTranscriptInput
): Promise<MeetingTranscriptRecord> {
  const provider = createMeetingRecorderProvider(input);
  return provider.getTranscript(input.params);
}
