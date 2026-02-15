import {
  defineCapability,
  StabilityEnum,
} from '@contractspec/lib.contracts-spec';

export const TasksCapability = defineCapability({
  meta: {
    key: 'tasks',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Task management for teams',
    owners: ['platform.core'],
    tags: ['tasks', 'collaboration'],
  },
});

export const RitualsCapability = defineCapability({
  meta: {
    key: 'rituals',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Team rituals like standups and retrospectives',
    owners: ['platform.core'],
    tags: ['rituals', 'team', 'meetings'],
  },
});

export const AnnouncementsCapability = defineCapability({
  meta: {
    key: 'announcements',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Team announcements and communications',
    owners: ['platform.messaging'],
    tags: ['announcements', 'messaging'],
  },
});
