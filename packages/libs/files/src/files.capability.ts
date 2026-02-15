import {
  defineCapability,
  StabilityEnum,
} from '@contractspec/lib.contracts-spec';

export const FilesCapability = defineCapability({
  meta: {
    key: 'files',
    version: '1.0.0',
    kind: 'data',
    stability: StabilityEnum.Experimental,
    description: 'File storage and management',
    owners: ['@platform.core'],
    tags: ['files', 'storage'],
  },
});

export const AttachmentsCapability = defineCapability({
  meta: {
    key: 'attachments',
    version: '1.0.0',
    kind: 'data',
    stability: StabilityEnum.Experimental,
    description: 'File attachments for entities',
    owners: ['@platform.core'],
    tags: ['attachments', 'files'],
  },
});
