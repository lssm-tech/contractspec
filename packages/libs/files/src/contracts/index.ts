import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

const OWNERS = ['platform.files'] as const;

// ============ Schema Models ============

export const FileModel = defineSchemaModel({
  name: 'File',
  description: 'Represents an uploaded file',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    storageProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    storagePath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    checksum: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    width: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    height: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const FileVersionModel = defineSchemaModel({
  name: 'FileVersion',
  description: 'Represents a file version',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    storagePath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    checksum: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const AttachmentModel = defineSchemaModel({
  name: 'Attachment',
  description: 'Represents an attachment',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attachmentType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    file: { type: FileModel, isOptional: true },
  },
});

export const PresignedUrlModel = defineSchemaModel({
  name: 'PresignedUrl',
  description: 'A presigned URL for file operations',
  fields: {
    url: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fields: { type: ScalarTypeEnum.JSON(), isOptional: true },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// ============ Input/Output Models ============

const UploadFileInput = defineSchemaModel({
  name: 'UploadFileInput',
  description: 'Input for uploading a file',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // Base64 encoded
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const UpdateFileInput = defineSchemaModel({
  name: 'UpdateFileInput',
  description: 'Input for updating a file',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const DeleteFileInput = defineSchemaModel({
  name: 'DeleteFileInput',
  description: 'Input for deleting a file',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const GetFileInput = defineSchemaModel({
  name: 'GetFileInput',
  description: 'Input for getting a file',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ListFilesInput = defineSchemaModel({
  name: 'ListFilesInput',
  description: 'Input for listing files',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const ListFilesOutput = defineSchemaModel({
  name: 'ListFilesOutput',
  description: 'Output for listing files',
  fields: {
    files: { type: FileModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const GetDownloadUrlInput = defineSchemaModel({
  name: 'GetDownloadUrlInput',
  description: 'Input for getting a download URL',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expiresInSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const CreateVersionInput = defineSchemaModel({
  name: 'CreateVersionInput',
  description: 'Input for creating a file version',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // Base64 encoded
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const GetVersionsInput = defineSchemaModel({
  name: 'GetVersionsInput',
  description: 'Input for getting file versions',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const GetVersionsOutput = defineSchemaModel({
  name: 'GetVersionsOutput',
  description: 'Output for getting file versions',
  fields: {
    versions: { type: FileVersionModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const AttachFileInput = defineSchemaModel({
  name: 'AttachFileInput',
  description: 'Input for attaching a file to an entity',
  fields: {
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attachmentType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const DetachFileInput = defineSchemaModel({
  name: 'DetachFileInput',
  description: 'Input for detaching a file',
  fields: {
    attachmentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ListAttachmentsInput = defineSchemaModel({
  name: 'ListAttachmentsInput',
  description: 'Input for listing attachments',
  fields: {
    entityType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    entityId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attachmentType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const ListAttachmentsOutput = defineSchemaModel({
  name: 'ListAttachmentsOutput',
  description: 'Output for listing attachments',
  fields: {
    attachments: { type: AttachmentModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const CreatePresignedUrlInput = defineSchemaModel({
  name: 'CreatePresignedUrlInput',
  description: 'Input for creating a presigned upload URL',
  fields: {
    fileName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    expiresInSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const SuccessOutput = defineSchemaModel({
  name: 'SuccessOutput',
  description: 'Generic success output',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Upload a file.
 */
export const UploadFileContract = defineCommand({
  meta: {
    key: 'file.upload',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'upload'],
    description: 'Upload a new file.',
    goal: 'Store a file and create a file record.',
    context: 'Called when uploading files directly.',
  },
  io: {
    input: UploadFileInput,
    output: FileModel,
    errors: {
      FILE_TOO_LARGE: {
        description: 'File exceeds size limit',
        http: 413,
        gqlCode: 'FILE_TOO_LARGE',
        when: 'File size exceeds configured limit',
      },
      INVALID_MIME_TYPE: {
        description: 'MIME type not allowed',
        http: 415,
        gqlCode: 'INVALID_MIME_TYPE',
        when: 'File type is not in allowed list',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Update a file.
 */
export const UpdateFileContract = defineCommand({
  meta: {
    key: 'file.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'update'],
    description: 'Update file metadata.',
    goal: 'Modify file properties without replacing content.',
    context: 'Called when renaming or updating file metadata.',
  },
  io: {
    input: UpdateFileInput,
    output: FileModel,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Delete a file.
 */
export const DeleteFileContract = defineCommand({
  meta: {
    key: 'file.delete',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'delete'],
    description: 'Delete a file.',
    goal: 'Remove a file and all its versions and attachments.',
    context: 'Called when removing a file permanently.',
  },
  io: {
    input: DeleteFileInput,
    output: SuccessOutput,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get a file by ID.
 */
export const GetFileContract = defineQuery({
  meta: {
    key: 'file.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'get'],
    description: 'Get a file by ID.',
    goal: 'Retrieve file metadata.',
    context: 'Called to inspect file details.',
  },
  io: {
    input: GetFileInput,
    output: FileModel,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List files.
 */
export const ListFilesContract = defineQuery({
  meta: {
    key: 'file.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'list'],
    description: 'List files with filtering.',
    goal: 'Browse uploaded files.',
    context: 'Called to browse file library.',
  },
  io: {
    input: ListFilesInput,
    output: ListFilesOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get download URL.
 */
export const GetDownloadUrlContract = defineQuery({
  meta: {
    key: 'file.downloadUrl',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'download'],
    description: 'Get a presigned download URL.',
    goal: 'Generate a temporary URL for downloading.',
    context: 'Called when user wants to download a file.',
  },
  io: {
    input: GetDownloadUrlInput,
    output: PresignedUrlModel,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Create a file version.
 */
export const CreateVersionContract = defineCommand({
  meta: {
    key: 'file.version.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'version', 'create'],
    description: 'Create a new version of a file.',
    goal: 'Upload a new version while preserving history.',
    context: 'Called when updating a document.',
  },
  io: {
    input: CreateVersionInput,
    output: FileVersionModel,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get file versions.
 */
export const GetVersionsContract = defineQuery({
  meta: {
    key: 'file.version.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'version', 'list'],
    description: 'Get file version history.',
    goal: 'View all versions of a file.',
    context: 'Called to browse file history.',
  },
  io: {
    input: GetVersionsInput,
    output: GetVersionsOutput,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Attach a file to an entity.
 */
export const AttachFileContract = defineCommand({
  meta: {
    key: 'attachment.attach',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'attachment', 'attach'],
    description: 'Attach a file to an entity.',
    goal: 'Link a file to a business entity.',
    context: 'Called when associating files with entities.',
  },
  io: {
    input: AttachFileInput,
    output: AttachmentModel,
    errors: {
      FILE_NOT_FOUND: {
        description: 'File does not exist',
        http: 404,
        gqlCode: 'FILE_NOT_FOUND',
        when: 'File ID is invalid',
      },
      ATTACHMENT_EXISTS: {
        description: 'Attachment already exists',
        http: 409,
        gqlCode: 'ATTACHMENT_EXISTS',
        when: 'File is already attached to this entity',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Detach a file from an entity.
 */
export const DetachFileContract = defineCommand({
  meta: {
    key: 'attachment.detach',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'attachment', 'detach'],
    description: 'Detach a file from an entity.',
    goal: 'Remove a file association.',
    context: 'Called when removing file from entity.',
  },
  io: {
    input: DetachFileInput,
    output: SuccessOutput,
    errors: {
      ATTACHMENT_NOT_FOUND: {
        description: 'Attachment does not exist',
        http: 404,
        gqlCode: 'ATTACHMENT_NOT_FOUND',
        when: 'Attachment ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List attachments for an entity.
 */
export const ListAttachmentsContract = defineQuery({
  meta: {
    key: 'attachment.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'attachment', 'list'],
    description: 'List attachments for an entity.',
    goal: 'Get all files attached to an entity.',
    context: 'Called to display attached files.',
  },
  io: {
    input: ListAttachmentsInput,
    output: ListAttachmentsOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Create a presigned upload URL.
 */
export const CreatePresignedUrlContract = defineCommand({
  meta: {
    key: 'file.presignedUrl.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['files', 'presigned', 'upload'],
    description: 'Create a presigned URL for direct upload.',
    goal: 'Enable direct-to-storage uploads.',
    context: 'Called for large file uploads.',
  },
  io: {
    input: CreatePresignedUrlInput,
    output: PresignedUrlModel,
    errors: {
      FILE_TOO_LARGE: {
        description: 'File exceeds size limit',
        http: 413,
        gqlCode: 'FILE_TOO_LARGE',
        when: 'Requested file size exceeds limit',
      },
      INVALID_MIME_TYPE: {
        description: 'MIME type not allowed',
        http: 415,
        gqlCode: 'INVALID_MIME_TYPE',
        when: 'File type is not in allowed list',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});
