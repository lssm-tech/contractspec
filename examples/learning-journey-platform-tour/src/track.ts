import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

export const platformPrimitivesTourTrack: LearningJourneyTrackSpec = {
  id: 'platform_primitives_tour',
  productId: 'contractspec-platform',
  name: 'Platform Primitives Tour',
  description:
    'Hands-on tour across identity, audit, notifications, jobs, flags, files, and metering.',
  targetUserSegment: 'platform_developer',
  targetRole: 'developer',
  totalXp: 140,
  completionRewards: { xpBonus: 20, badgeKey: 'platform_primitives' },
  steps: [
    {
      id: 'identity_rbac',
      title: 'Create org and member',
      description: 'Create an org and add at least one member.',
      order: 1,
      completion: {
        eventName: 'org.member.added',
        sourceModule: '@contractspec/lib.identity-rbac',
      },
      xpReward: 20,
      metadata: { surface: 'identity' },
    },
    {
      id: 'event_bus_audit',
      title: 'Emit an auditable event',
      description: 'Emit an event that lands in the audit log.',
      order: 2,
      completion: {
        eventName: 'audit_log.created',
        sourceModule: '@contractspec/module.audit-trail',
      },
      xpReward: 20,
      metadata: { surface: 'bus+audit' },
    },
    {
      id: 'notifications',
      title: 'Send a notification',
      description: 'Send yourself a notification and verify delivery.',
      order: 3,
      completion: {
        eventName: 'notification.sent',
        sourceModule: '@contractspec/module.notifications',
      },
      xpReward: 20,
      metadata: { surface: 'notifications' },
    },
    {
      id: 'jobs_scheduler',
      title: 'Schedule and run a job',
      description: 'Schedule a background job and let it run once.',
      order: 4,
      completion: {
        eventName: 'job.completed',
        sourceModule: '@contractspec/lib.jobs',
      },
      xpReward: 20,
      metadata: { surface: 'jobs' },
    },
    {
      id: 'feature_flags',
      title: 'Create and toggle a feature flag',
      description: 'Create a feature flag and toggle it at least once.',
      order: 5,
      completion: {
        eventName: 'flag.toggled',
        sourceModule: '@contractspec/lib.feature-flags',
      },
      xpReward: 20,
      metadata: { surface: 'feature-flags' },
    },
    {
      id: 'files_attachments',
      title: 'Attach a file',
      description: 'Upload and attach a file to any entity.',
      order: 6,
      completion: {
        eventName: 'attachment.attached',
        sourceModule: '@contractspec/lib.files',
      },
      xpReward: 20,
      metadata: { surface: 'files' },
    },
    {
      id: 'usage_metering',
      title: 'Record usage',
      description: 'Emit a usage metric (regeneration, agent run, or similar).',
      order: 7,
      completion: {
        eventName: 'usage.recorded',
        sourceModule: '@contractspec/lib.metering',
      },
      xpReward: 20,
      metadata: { surface: 'metering' },
    },
  ],
  metadata: {
    surfacedIn: ['studio/learning', 'platform/dev-center'],
  },
};

export const platformLearningTracks: LearningJourneyTrackSpec[] = [
  platformPrimitivesTourTrack,
];
