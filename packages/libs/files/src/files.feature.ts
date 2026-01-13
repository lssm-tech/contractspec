/**
 * Files Feature Module Specification
 *
 * Defines the feature module for file management capabilities.
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * Files feature module that bundles file storage,
 * attachments, and media processing capabilities.
 */
export const FilesFeature = defineFeature({
  meta: {
    key: 'files',
    version: '1.0.0',
    title: 'File Management',
    description:
      'File storage, attachments, and media processing with presigned URLs',
    domain: 'platform',
    owners: ['@platform.files'],
    tags: ['files', 'upload', 'attachments', 'storage'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // File CRUD operations
    { key: 'file.upload', version: '1.0.0' },
    { key: 'file.update', version: '1.0.0' },
    { key: 'file.delete', version: '1.0.0' },
    { key: 'file.get', version: '1.0.0' },
    { key: 'file.list', version: '1.0.0' },
    { key: 'file.downloadUrl', version: '1.0.0' },
    { key: 'file.presignedUrl.create', version: '1.0.0' },

    // Version operations
    { key: 'file.version.create', version: '1.0.0' },
    { key: 'file.version.list', version: '1.0.0' },

    // Attachment operations
    { key: 'attachment.attach', version: '1.0.0' },
    { key: 'attachment.detach', version: '1.0.0' },
    { key: 'attachment.list', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // File events
    { key: 'file.uploaded', version: '1.0.0' },
    { key: 'file.updated', version: '1.0.0' },
    { key: 'file.deleted', version: '1.0.0' },
    { key: 'file.version_created', version: '1.0.0' },

    // Attachment events
    { key: 'attachment.attached', version: '1.0.0' },
    { key: 'attachment.detached', version: '1.0.0' },

    // Upload session events
    { key: 'upload.session_started', version: '1.0.0' },
    { key: 'upload.session_completed', version: '1.0.0' },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'files', version: '1.0.0' },
      { key: 'attachments', version: '1.0.0' },
    ],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
