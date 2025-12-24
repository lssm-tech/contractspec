/**
 * Files Feature Module Specification
 *
 * Defines the feature module for file management capabilities.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Files feature module that bundles file upload, versioning,
 * and attachment management capabilities.
 */
export const FilesFeature: FeatureModuleSpec = {
  meta: {
    key: 'files',
    version: 1,
    title: 'File Management',
    description:
      'File upload, versioning, and attachment management with presigned URLs',
    domain: 'platform',
    owners: ['@platform.files'],
    tags: ['files', 'upload', 'attachments', 'storage'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // File CRUD operations
    { key: 'file.upload', version: 1 },
    { key: 'file.update', version: 1 },
    { key: 'file.delete', version: 1 },
    { key: 'file.get', version: 1 },
    { key: 'file.list', version: 1 },
    { key: 'file.downloadUrl', version: 1 },
    { key: 'file.presignedUrl.create', version: 1 },

    // Version operations
    { key: 'file.version.create', version: 1 },
    { key: 'file.version.list', version: 1 },

    // Attachment operations
    { key: 'attachment.attach', version: 1 },
    { key: 'attachment.detach', version: 1 },
    { key: 'attachment.list', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // File events
    { key: 'file.uploaded', version: 1 },
    { key: 'file.updated', version: 1 },
    { key: 'file.deleted', version: 1 },
    { key: 'file.version_created', version: 1 },

    // Attachment events
    { key: 'attachment.attached', version: 1 },
    { key: 'attachment.detached', version: 1 },

    // Upload session events
    { key: 'upload.session_started', version: 1 },
    { key: 'upload.session_completed', version: 1 },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'files', version: 1 },
      { key: 'attachments', version: 1 },
    ],
    requires: [{ key: 'identity', version: 1 }],
  },
};
