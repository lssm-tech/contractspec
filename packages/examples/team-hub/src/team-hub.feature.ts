import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const TeamHubFeature: FeatureModuleSpec = {
  meta: {
    key: 'team-hub',
    title: 'Team Hub',
    description:
      'Tasks, rituals, and announcements for internal teams with ceremonies.',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['tasks', 'rituals', 'announcements'],
    stability: 'experimental',
  },
  operations: [
    { name: 'team.space.create', version: 1 },
    { name: 'team.task.create', version: 1 },
    { name: 'team.task.updateStatus', version: 1 },
    { name: 'team.task.list', version: 1 },
    { name: 'team.ritual.schedule', version: 1 },
    { name: 'team.ritual.logOccurrence', version: 1 },
    { name: 'team.announcement.post', version: 1 },
  ],
  events: [
    { name: 'team.space.created', version: 1 },
    { name: 'team.task.created', version: 1 },
    { name: 'team.task.status_changed', version: 1 },
    { name: 'team.ritual.scheduled', version: 1 },
    { name: 'team.ritual.occurred', version: 1 },
    { name: 'team.announcement.posted', version: 1 },
  ],
  presentations: [
    { name: 'team-hub.dashboard', version: 1 },
    { name: 'team-hub.space.list', version: 1 },
    { name: 'team-hub.task.board', version: 1 },
    { name: 'team-hub.task.detail', version: 1 },
    { name: 'team-hub.ritual.calendar', version: 1 },
    { name: 'team-hub.announcement.feed', version: 1 },
  ],
  presentationsTargets: [
    { name: 'team-hub.dashboard', version: 1, targets: ['react', 'markdown'] },
    { name: 'team-hub.task.board', version: 1, targets: ['react'] },
    { name: 'team-hub.ritual.calendar', version: 1, targets: ['react'] },
    {
      name: 'team-hub.announcement.feed',
      version: 1,
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'feature-flags', version: 1 },
    ],
    provides: [
      { key: 'tasks', version: 1 },
      { key: 'rituals', version: 1 },
      { key: 'announcements', version: 1 },
    ],
  },
};
