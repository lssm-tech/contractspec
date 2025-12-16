/**
 * Jobs Feature Module Specification
 *
 * Defines the feature module for background job processing and scheduling.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Jobs feature module that bundles job queue management,
 * background processing, and scheduled task capabilities.
 */
export const JobsFeature: FeatureModuleSpec = {
  meta: {
    key: 'jobs',
    title: 'Background Jobs',
    description:
      'Background job processing, scheduling, and queue management',
    domain: 'platform',
    owners: ['@platform.jobs'],
    tags: ['jobs', 'queue', 'background', 'scheduler'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // Job operations
    { name: 'jobs.enqueue', version: 1 },
    { name: 'jobs.cancel', version: 1 },
    { name: 'jobs.get', version: 1 },
    { name: 'jobs.stats', version: 1 },

    // Schedule operations
    { name: 'jobs.schedule.create', version: 1 },
    { name: 'jobs.schedule.toggle', version: 1 },
    { name: 'jobs.schedule.list', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Job lifecycle events
    { name: 'job.enqueued', version: 1 },
    { name: 'job.started', version: 1 },
    { name: 'job.completed', version: 1 },
    { name: 'job.failed', version: 1 },
    { name: 'job.retrying', version: 1 },
    { name: 'job.dead_lettered', version: 1 },
    { name: 'job.cancelled', version: 1 },

    // Scheduler events
    { name: 'scheduler.job_triggered', version: 1 },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'jobs', version: 1 },
      { key: 'scheduler', version: 1 },
    ],
    requires: [],
  },
};

