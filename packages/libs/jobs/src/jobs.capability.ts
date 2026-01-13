import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const JobsCapability = defineCapability({
  meta: {
    key: 'jobs',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Background job processing',
    owners: ['@platform.core'],
    tags: ['jobs', 'background', 'async'],
  },
});

export const SchedulerCapability = defineCapability({
  meta: {
    key: 'scheduler',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Scheduled job execution',
    owners: ['@platform.core'],
    tags: ['scheduler', 'cron', 'jobs'],
  },
});
