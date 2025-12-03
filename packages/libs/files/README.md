# @lssm/lib.files

Files, documents, and attachments module for ContractSpec applications.

## Overview

This module provides a reusable file management system that can be used across all ContractSpec applications. It supports:

- **File Storage**: Upload and manage files with multiple storage backends
- **Document Versioning**: Track file versions over time
- **Polymorphic Attachments**: Attach files to any entity type
- **Access Control**: Control who can upload, view, and delete files
- **Presigned URLs**: Direct uploads to storage backends

## Entities

### File

Core file record.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Original file name |
| mimeType | string | MIME type |
| size | int | File size in bytes |
| storageProvider | enum | Storage backend (local, s3, etc.) |
| storagePath | string | Path in storage backend |
| checksum | string | File checksum (SHA-256) |
| ownerId | string | User who uploaded |
| orgId | string | Organization scope |
| isPublic | boolean | Whether file is publicly accessible |
| metadata | json | Additional metadata |
| createdAt | datetime | Upload timestamp |
| updatedAt | datetime | Last update timestamp |

### FileVersion

Version history for documents.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| fileId | string | Parent file |
| version | int | Version number |
| size | int | Version size in bytes |
| storagePath | string | Path in storage |
| checksum | string | Version checksum |
| createdBy | string | User who created version |
| createdAt | datetime | Version timestamp |
| comment | string | Version comment |

### Attachment

Polymorphic link between files and entities.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| fileId | string | Attached file |
| entityType | string | Target entity type |
| entityId | string | Target entity ID |
| attachmentType | string | Type of attachment (document, image, etc.) |
| order | int | Display order |
| metadata | json | Attachment-specific metadata |
| createdAt | datetime | Attachment timestamp |

## Contracts

### Commands

- `file.upload` - Upload a new file
- `file.update` - Update file metadata
- `file.delete` - Delete a file
- `file.createVersion` - Create a new version
- `attachment.attach` - Attach file to entity
- `attachment.detach` - Remove attachment
- `presignedUrl.create` - Get presigned upload URL

### Queries

- `file.get` - Get file by ID
- `file.list` - List files with filtering
- `file.getVersions` - Get file version history
- `file.download` - Get download URL
- `attachment.list` - List attachments for entity

## Events

- `file.uploaded` - File was uploaded
- `file.updated` - File metadata changed
- `file.deleted` - File was deleted
- `file.version_created` - New version created
- `attachment.attached` - File attached to entity
- `attachment.detached` - File detached from entity

## Storage Adapters

### LocalStorageAdapter

For development and testing. Stores files on the local filesystem.

```typescript
import { LocalStorageAdapter } from '@lssm/lib.files/storage';

const storage = new LocalStorageAdapter({
  basePath: './uploads',
  baseUrl: 'http://localhost:3000/uploads',
});
```

### S3StorageAdapter

For production use with AWS S3 or compatible services.

```typescript
import { S3StorageAdapter } from '@lssm/lib.files/storage';

const storage = new S3StorageAdapter({
  bucket: 'my-bucket',
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
```

## Usage

```typescript
import { 
  FileEntity, 
  UploadFileContract,
  LocalStorageAdapter 
} from '@lssm/lib.files';

// Upload a file
const file = await fileService.upload({
  name: 'document.pdf',
  mimeType: 'application/pdf',
  size: 1024,
  content: buffer,
  orgId: 'org-123',
});

// Attach to an entity
await attachmentService.attach({
  fileId: file.id,
  entityType: 'deal',
  entityId: 'deal-456',
  attachmentType: 'contract',
});

// List attachments
const attachments = await attachmentService.list({
  entityType: 'deal',
  entityId: 'deal-456',
});
```

## Integration

This module integrates with:

- `@lssm/lib.identity-rbac` - Access control
- `@lssm/modules.audit-trail` - File operations audit

## Schema Contribution

```typescript
import { filesSchemaContribution } from '@lssm/lib.files';

export const schemaComposition = {
  modules: [
    filesSchemaContribution,
    // ... other modules
  ],
};
```



