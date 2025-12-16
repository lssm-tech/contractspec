import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Announcement to spaces/org.
 */
export const AnnouncementModel = defineSchemaModel({
  name: 'Announcement',
  description: 'Announcement to spaces/org',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audience: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audienceRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for posting an announcement.
 */
export const PostAnnouncementInputModel = defineSchemaModel({
  name: 'PostAnnouncementInput',
  description: 'Post an announcement',
  fields: {
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audience: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audienceRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});


