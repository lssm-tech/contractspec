import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const NotificationsCapability = defineCapability({
  meta: {
    key: 'notifications',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'User notifications and alerts',
    owners: ['@platform.messaging'],
    tags: ['notifications', 'messaging', 'alerts'],
  },
});
