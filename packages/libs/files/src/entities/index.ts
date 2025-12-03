import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

/**
 * Storage provider enum.
 */
export const StorageProviderEnum = defineEntityEnum({
  name: 'StorageProvider',
  values: ['LOCAL', 'S3', 'GCS', 'AZURE', 'CLOUDFLARE'] as const,
  schema: 'lssm_files',
  description: 'Storage backend provider.',
});

/**
 * File status enum.
 */
export const FileStatusEnum = defineEntityEnum({
  name: 'FileStatus',
  values: [
    'PENDING',
    'UPLOADED',
    'PROCESSING',
    'READY',
    'ERROR',
    'DELETED',
  ] as const,
  schema: 'lssm_files',
  description: 'File processing status.',
});

/**
 * File entity - represents an uploaded file.
 */
export const FileEntity = defineEntity({
  name: 'File',
  description: 'An uploaded file.',
  schema: 'lssm_files',
  map: 'file',
  fields: {
    id: field.id({ description: 'Unique file identifier' }),

    // File info
    name: field.string({ description: 'Original file name' }),
    mimeType: field.string({ description: 'MIME type' }),
    size: field.int({ description: 'File size in bytes' }),

    // Storage
    storageProvider: field.enum('StorageProvider', {
      default: 'LOCAL',
      description: 'Storage backend',
    }),
    storagePath: field.string({ description: 'Path in storage backend' }),
    storageKey: field.string({
      isOptional: true,
      description: 'Storage key/bucket',
    }),

    // Integrity
    checksum: field.string({
      isOptional: true,
      description: 'SHA-256 checksum',
    }),
    etag: field.string({ isOptional: true, description: 'Storage ETag' }),

    // Status
    status: field.enum('FileStatus', {
      default: 'PENDING',
      description: 'File status',
    }),

    // Access
    isPublic: field.boolean({
      default: false,
      description: 'Whether file is publicly accessible',
    }),
    expiresAt: field.dateTime({
      isOptional: true,
      description: 'Auto-delete timestamp',
    }),

    // Ownership
    ownerId: field.string({ description: 'User who uploaded' }),
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),
    tags: field.json({
      isOptional: true,
      description: 'Tags for categorization',
    }),

    // Image-specific
    width: field.int({
      isOptional: true,
      description: 'Image width in pixels',
    }),
    height: field.int({
      isOptional: true,
      description: 'Image height in pixels',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    versions: field.hasMany('FileVersion'),
    attachments: field.hasMany('Attachment'),
  },
  indexes: [
    index.on(['ownerId']),
    index.on(['orgId']),
    index.on(['status']),
    index.on(['mimeType']),
    index.on(['storageProvider', 'storagePath']),
  ],
  enums: [StorageProviderEnum, FileStatusEnum],
});

/**
 * FileVersion entity - version history for files.
 */
export const FileVersionEntity = defineEntity({
  name: 'FileVersion',
  description: 'A version of a file.',
  schema: 'lssm_files',
  map: 'file_version',
  fields: {
    id: field.id({ description: 'Unique version identifier' }),
    fileId: field.foreignKey({ description: 'Parent file' }),

    // Version info
    version: field.int({ description: 'Version number' }),
    size: field.int({ description: 'Version size in bytes' }),

    // Storage
    storagePath: field.string({ description: 'Path in storage backend' }),
    checksum: field.string({
      isOptional: true,
      description: 'SHA-256 checksum',
    }),

    // Metadata
    comment: field.string({ isOptional: true, description: 'Version comment' }),
    changes: field.json({
      isOptional: true,
      description: 'Change description',
    }),

    // Creator
    createdBy: field.string({ description: 'User who created version' }),

    // Timestamps
    createdAt: field.createdAt(),

    // Relations
    file: field.belongsTo('File', ['fileId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['fileId', 'version']),
    index.unique(['fileId', 'version'], { name: 'file_version_unique' }),
  ],
});

/**
 * Attachment entity - polymorphic link between files and entities.
 */
export const AttachmentEntity = defineEntity({
  name: 'Attachment',
  description: 'Links a file to an entity.',
  schema: 'lssm_files',
  map: 'attachment',
  fields: {
    id: field.id({ description: 'Unique attachment identifier' }),
    fileId: field.foreignKey({ description: 'Attached file' }),

    // Target entity (polymorphic)
    entityType: field.string({
      description: 'Target entity type (deal, listing, etc.)',
    }),
    entityId: field.string({ description: 'Target entity ID' }),

    // Attachment metadata
    attachmentType: field.string({
      isOptional: true,
      description: 'Type of attachment (document, image, avatar, etc.)',
    }),
    name: field.string({
      isOptional: true,
      description: 'Display name (overrides file name)',
    }),
    description: field.string({
      isOptional: true,
      description: 'Attachment description',
    }),

    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Attachment-specific metadata',
    }),

    // Creator
    createdBy: field.string({ description: 'User who created attachment' }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    file: field.belongsTo('File', ['fileId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['entityType', 'entityId']),
    index.on(['fileId']),
    index.on(['entityType', 'entityId', 'attachmentType']),
    index.unique(['fileId', 'entityType', 'entityId'], {
      name: 'attachment_unique',
    }),
  ],
});

/**
 * UploadSession entity - tracks multipart uploads.
 */
export const UploadSessionEntity = defineEntity({
  name: 'UploadSession',
  description: 'Tracks a multipart upload session.',
  schema: 'lssm_files',
  map: 'upload_session',
  fields: {
    id: field.id({ description: 'Unique session identifier' }),

    // File info
    fileName: field.string({ description: 'Target file name' }),
    mimeType: field.string({ description: 'Expected MIME type' }),
    totalSize: field.int({ description: 'Total file size' }),

    // Upload state
    uploadId: field.string({
      isOptional: true,
      description: 'Storage upload ID',
    }),
    uploadedBytes: field.int({
      default: 0,
      description: 'Bytes uploaded so far',
    }),
    uploadedParts: field.json({
      isOptional: true,
      description: 'Completed part info',
    }),

    // Status
    status: field.string({
      default: '"pending"',
      description: 'Session status',
    }),
    error: field.string({
      isOptional: true,
      description: 'Error message if failed',
    }),

    // Result
    fileId: field.string({
      isOptional: true,
      description: 'Resulting file ID',
    }),

    // Context
    ownerId: field.string({ description: 'User who initiated upload' }),
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Expiry
    expiresAt: field.dateTime({ description: 'Session expiry time' }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [index.on(['status', 'expiresAt']), index.on(['ownerId'])],
});

/**
 * All file entities for schema composition.
 */
export const fileEntities = [
  FileEntity,
  FileVersionEntity,
  AttachmentEntity,
  UploadSessionEntity,
];

/**
 * Module schema contribution for files.
 */
export const filesSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/lib.files',
  entities: fileEntities,
  enums: [StorageProviderEnum, FileStatusEnum],
};


