import { defineCapability } from '../capabilities';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';

export const AppConfigCapability = defineCapability({
  meta: {
    key: 'app-config',
    version: '1.0.0',
    title: 'App Configuration Capability',
    description: 'Provides tenant app configuration lifecycle management.',
    domain: 'platform',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.Hygiene],
    kind: 'api',
    stability: StabilityEnum.Stable,
  },
  provides: [],
  requires: [],
});
