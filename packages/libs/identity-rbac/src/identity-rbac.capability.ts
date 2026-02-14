import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

export const IdentityCapability = defineCapability({
  meta: {
    key: 'identity',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'User identity and authentication',
    owners: ['@platform.core'],
    tags: ['identity', 'auth'],
  },
});

export const RbacCapability = defineCapability({
  meta: {
    key: 'rbac',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Role-based access control',
    owners: ['@platform.core'],
    tags: ['rbac', 'permissions', 'auth'],
  },
});
