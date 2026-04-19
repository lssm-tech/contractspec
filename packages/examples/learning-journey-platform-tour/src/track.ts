import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

export const platformPrimitivesTourTrack: JourneyTrackSpec = {
	id: 'platform_primitives_tour',
	productId: 'contractspec-platform',
	name: 'Platform Primitives Tour',
	description:
		'Hands-on tour across identity, audit, notifications, jobs, flags, files, and metering.',
	targetUserSegment: 'platform_developer',
	targetRole: 'developer',
	totalXp: 140,
	completionRewards: { xp: 20, badgeKey: 'platform_primitives' },
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
			prerequisites: [{ kind: 'step_completed', stepId: 'identity_rbac' }],
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
			prerequisites: [{ kind: 'step_completed', stepId: 'event_bus_audit' }],
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
			prerequisites: [{ kind: 'step_completed', stepId: 'notifications' }],
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
			prerequisites: [{ kind: 'step_completed', stepId: 'jobs_scheduler' }],
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
			prerequisites: [{ kind: 'step_completed', stepId: 'feature_flags' }],
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
			prerequisites: [{ kind: 'step_completed', stepId: 'files_attachments' }],
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

export const platformLearningTracks: JourneyTrackSpec[] = [
	platformPrimitivesTourTrack,
];
