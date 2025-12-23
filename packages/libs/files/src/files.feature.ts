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
    { name: 'file.upload', version: 1 },
    { name: 'file.update', version: 1 },
    { name: 'file.delete', version: 1 },
    { name: 'file.get', version: 1 },
    { name: 'file.list', version: 1 },
    { name: 'file.downloadUrl', version: 1 },
    { name: 'file.presignedUrl.create', version: 1 },

    // Version operations
    { name: 'file.version.create', version: 1 },
    { name: 'file.version.list', version: 1 },

    // Attachment operations
    { name: 'attachment.attach', version: 1 },
    { name: 'attachment.detach', version: 1 },
    { name: 'attachment.list', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // File events
    { name: 'file.uploaded', version: 1 },
    { name: 'file.updated', version: 1 },
    { name: 'file.deleted', version: 1 },
    { name: 'file.version_created', version: 1 },

    // Attachment events
    { name: 'attachment.attached', version: 1 },
    { name: 'attachment.detached', version: 1 },

    // Upload session events
    { name: 'upload.session_started', version: 1 },
    { name: 'upload.session_completed', version: 1 },
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
