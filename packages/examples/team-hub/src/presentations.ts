import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

export const TeamDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.dashboard',
    version: 1,
    description: 'Team hub dashboard with activity overview',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TeamDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['team.dashboard.enabled'],
  },
};

export const SpaceListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.space.list',
    version: 1,
    description: 'List of team spaces',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'spaces', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SpaceList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['team.spaces.enabled'],
  },
};

export const TaskBoardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.task.board',
    version: 1,
    description: 'Task board with kanban view',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'tasks', 'board', 'kanban'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TaskBoard',
  },
  targets: ['react'],
  policy: {
    flags: ['team.tasks.enabled'],
  },
};

export const TaskDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.task.detail',
    version: 1,
    description: 'Task detail with comments and history',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'task', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TaskDetail',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['team.tasks.enabled'],
  },
};

export const RitualCalendarPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.ritual.calendar',
    version: 1,
    description: 'Calendar view of team rituals',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'rituals', 'calendar'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RitualCalendar',
  },
  targets: ['react'],
  policy: {
    flags: ['team.rituals.enabled'],
  },
};

export const AnnouncementFeedPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'team-hub.announcement.feed',
    version: 1,
    description: 'Feed of team announcements',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'announcements', 'feed'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AnnouncementFeed',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['team.announcements.enabled'],
  },
};

