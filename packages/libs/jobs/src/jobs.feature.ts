/**
 * Jobs Feature Module Specification
 *
 * Defines the feature module for background job processing and scheduling.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec';

/**
 * Jobs feature module that bundles background job processing,
 * queues, and scheduling capabilities.
 */
export const JobsFeature = defineFeature({
  meta: {
    key: 'jobs',
    title: 'Background Jobs',
    description: 'Background job processing, scheduling, and queue management',
    domain: 'platform',
    owners: ['@platform.jobs'],
    tags: ['jobs', 'queue', 'background', 'scheduler'],
    stability: 'stable',
    version: '1.0.0',
  },

  // All contract operations included in this feature
  operations: [
    // Job operations
    { key: 'jobs.enqueue', version: '1.0.0' },
    { key: 'jobs.cancel', version: '1.0.0' },
    { key: 'jobs.get', version: '1.0.0' },
    { key: 'jobs.stats', version: '1.0.0' },

    // Schedule operations
    { key: 'jobs.schedule.create', version: '1.0.0' },
    { key: 'jobs.schedule.toggle', version: '1.0.0' },
    { key: 'jobs.schedule.list', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // Job lifecycle events
    { key: 'job.enqueued', version: '1.0.0' },
    { key: 'job.started', version: '1.0.0' },
    { key: 'job.completed', version: '1.0.0' },
    { key: 'job.failed', version: '1.0.0' },
    { key: 'job.retrying', version: '1.0.0' },
    { key: 'job.dead_lettered', version: '1.0.0' },
    { key: 'job.cancelled', version: '1.0.0' },

    // Scheduler events
    { key: 'scheduler.job_triggered', version: '1.0.0' },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'jobs', version: '1.0.0' },
      { key: 'scheduler', version: '1.0.0' },
    ],
    requires: [],
  },
});
