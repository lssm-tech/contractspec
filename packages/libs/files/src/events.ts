import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts-spec';

// ============ Event Payloads ============

const FileUploadedPayload = defineSchemaModel({
  name: 'FileUploadedEventPayload',
  description: 'Payload when a file is uploaded',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    storageProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    uploadedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FileUpdatedPayload = defineSchemaModel({
  name: 'FileUpdatedEventPayload',
  description: 'Payload when a file is updated',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changes: { type: ScalarTypeEnum.JSON(), isOptional: false },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FileDeletedPayload = defineSchemaModel({
  name: 'FileDeletedEventPayload',
  description: 'Payload when a file is deleted',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storageProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    storagePath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FileVersionCreatedPayload = defineSchemaModel({
  name: 'FileVersionCreatedEventPayload',
  description: 'Payload when a file version is created',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    versionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const AttachmentAttachedPayload = defineSchemaModel({
  name: 'AttachmentAttachedEventPayload',
  description: 'Payload when a file is attached to an entity',
  fields: {
    attachmentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attachmentType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    attachedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const AttachmentDetachedPayload = defineSchemaModel({
  name: 'AttachmentDetachedEventPayload',
  description: 'Payload when a file is detached from an entity',
  fields: {
    attachmentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    detachedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    detachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UploadSessionStartedPayload = defineSchemaModel({
  name: 'UploadSessionStartedEventPayload',
  description: 'Payload when an upload session starts',
  fields: {
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    totalSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UploadSessionCompletedPayload = defineSchemaModel({
  name: 'UploadSessionCompletedEventPayload',
  description: 'Payload when an upload session completes',
  fields: {
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

/**
 * Emitted when a file is uploaded.
 */
export const FileUploadedEvent = defineEvent({
  meta: {
    key: 'file.uploaded',
    version: '1.0.0',
    description: 'A file has been uploaded.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'upload'],
  },
  payload: FileUploadedPayload,
});

/**
 * Emitted when a file is updated.
 */
export const FileUpdatedEvent = defineEvent({
  meta: {
    key: 'file.updated',
    version: '1.0.0',
    description: 'A file has been updated.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'update'],
  },
  payload: FileUpdatedPayload,
});

/**
 * Emitted when a file is deleted.
 */
export const FileDeletedEvent = defineEvent({
  meta: {
    key: 'file.deleted',
    version: '1.0.0',
    description: 'A file has been deleted.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'delete'],
  },
  payload: FileDeletedPayload,
});

/**
 * Emitted when a file version is created.
 */
export const FileVersionCreatedEvent = defineEvent({
  meta: {
    key: 'file.version_created',
    version: '1.0.0',
    description: 'A new file version has been created.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'version', 'create'],
  },
  payload: FileVersionCreatedPayload,
});

/**
 * Emitted when a file is attached to an entity.
 */
export const AttachmentAttachedEvent = defineEvent({
  meta: {
    key: 'attachment.attached',
    version: '1.0.0',
    description: 'A file has been attached to an entity.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'attachment', 'attach'],
  },
  payload: AttachmentAttachedPayload,
});

/**
 * Emitted when a file is detached from an entity.
 */
export const AttachmentDetachedEvent = defineEvent({
  meta: {
    key: 'attachment.detached',
    version: '1.0.0',
    description: 'A file has been detached from an entity.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'attachment', 'detach'],
  },
  payload: AttachmentDetachedPayload,
});

/**
 * Emitted when an upload session starts.
 */
export const UploadSessionStartedEvent = defineEvent({
  meta: {
    key: 'upload.session_started',
    version: '1.0.0',
    description: 'An upload session has started.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'upload', 'session', 'start'],
  },
  payload: UploadSessionStartedPayload,
});

/**
 * Emitted when an upload session completes.
 */
export const UploadSessionCompletedEvent = defineEvent({
  meta: {
    key: 'upload.session_completed',
    version: '1.0.0',
    description: 'An upload session has completed.',
    stability: 'stable',
    owners: ['@platform.files'],
    tags: ['files', 'upload', 'session', 'complete'],
  },
  payload: UploadSessionCompletedPayload,
});

/**
 * All file events.
 */
export const FileEvents = {
  FileUploadedEvent,
  FileUpdatedEvent,
  FileDeletedEvent,
  FileVersionCreatedEvent,
  AttachmentAttachedEvent,
  AttachmentDetachedEvent,
  UploadSessionStartedEvent,
  UploadSessionCompletedEvent,
};
