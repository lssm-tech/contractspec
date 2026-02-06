import type {
  MeetingRecorderListMeetingsParams,
  MeetingRecorderListMeetingsResult,
} from '@contractspec/lib.contracts/integrations/providers/meeting-recorder';

import {
  createMeetingRecorderProvider,
  type MeetingRecorderProviderFactoryInput,
} from './create-provider';

export interface ListMeetingRecorderMeetingsInput extends MeetingRecorderProviderFactoryInput {
  params: MeetingRecorderListMeetingsParams;
}

export async function listMeetingRecorderMeetings(
  input: ListMeetingRecorderMeetingsInput
): Promise<MeetingRecorderListMeetingsResult> {
  const provider = createMeetingRecorderProvider(input);
  return provider.listMeetings(input.params);
}
