import { defineFeature } from '@contractspec/lib.contracts';

export const TeamHubFeature = defineFeature({
  meta: {
    key: 'team-hub',
    title: 'Team Hub',
    description:
      'Tasks, rituals, and announcements for internal teams with ceremonies.',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['tasks', 'rituals', 'announcements'],
    stability: 'experimental',
    version: '1.0.0',
  },
  operations: [
    { key: 'team.space.create', version: '1.0.0' },
    { key: 'team.task.create', version: '1.0.0' },
    { key: 'team.task.updateStatus', version: '1.0.0' },
    { key: 'team.task.list', version: '1.0.0' },
    { key: 'team.ritual.schedule', version: '1.0.0' },
    { key: 'team.ritual.logOccurrence', version: '1.0.0' },
    { key: 'team.announcement.post', version: '1.0.0' },
  ],
  events: [
    { key: 'team.space.created', version: '1.0.0' },
    { key: 'team.task.created', version: '1.0.0' },
    { key: 'team.task.status_changed', version: '1.0.0' },
    { key: 'team.ritual.scheduled', version: '1.0.0' },
    { key: 'team.ritual.occurred', version: '1.0.0' },
    { key: 'team.announcement.posted', version: '1.0.0' },
  ],
  presentations: [
    { key: 'team-hub.dashboard', version: '1.0.0' },
    { key: 'team-hub.space.list', version: '1.0.0' },
    { key: 'team-hub.task.board', version: '1.0.0' },
    { key: 'team-hub.task.detail', version: '1.0.0' },
    { key: 'team-hub.ritual.calendar', version: '1.0.0' },
    { key: 'team-hub.announcement.feed', version: '1.0.0' },
  ],
  presentationsTargets: [
    {
      key: 'team-hub.dashboard',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    { key: 'team-hub.task.board', version: '1.0.0', targets: ['react'] },
    { key: 'team-hub.ritual.calendar', version: '1.0.0', targets: ['react'] },
    {
      key: 'team-hub.announcement.feed',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
      { key: 'feature-flags', version: '1.0.0' },
    ],
    provides: [
      { key: 'tasks', version: '1.0.0' },
      { key: 'rituals', version: '1.0.0' },
      { key: 'announcements', version: '1.0.0' },
    ],
  },
});
