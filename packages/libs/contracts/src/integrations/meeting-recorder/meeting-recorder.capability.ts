import { defineCapability } from '../../capabilities';
import { StabilityEnum } from '../../ownership';

export const MeetingRecorderCapability = defineCapability({
  meta: {
    key: 'meeting-recorder',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Meeting recorder integrations capability',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'transcripts', 'integrations'],
  },
});
