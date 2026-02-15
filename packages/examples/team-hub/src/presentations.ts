import type { PresentationSpec } from '@contractspec/lib.contracts-spec';
import { StabilityEnum } from '@contractspec/lib.contracts-spec';

export const TeamDashboardPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.dashboard',
    version: '1.0.0',
    title: 'Team Dashboard',
    description: 'Team hub dashboard with activity overview',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'dashboard'],
    stability: StabilityEnum.Experimental,
    goal: 'High-level overview of team activity',
    context: 'Team home page',
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

export const SpaceListPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.space.list',
    version: '1.0.0',
    title: 'Space List',
    description: 'List of team spaces',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'spaces', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Browse and manage team spaces',
    context: 'Team navigation',
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

export const TaskBoardPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.task.board',
    version: '1.0.0',
    title: 'Task Board',
    description: 'Task board with kanban view',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'tasks', 'board', 'kanban'],
    stability: StabilityEnum.Experimental,
    goal: 'Visual task management',
    context: 'Team task workflows',
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

export const TaskDetailPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.task.detail',
    version: '1.0.0',
    title: 'Task Details',
    description: 'Task detail with comments and history',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'task', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Detailed task view with collaboration',
    context: 'Task inspection and updates',
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

export const RitualCalendarPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.ritual.calendar',
    version: '1.0.0',
    title: 'Ritual Calendar',
    description: 'Calendar view of team rituals',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'rituals', 'calendar'],
    stability: StabilityEnum.Experimental,
    goal: 'Plan and view recurring team rituals',
    context: 'Team scheduling',
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

export const AnnouncementFeedPresentation: PresentationSpec = {
  meta: {
    key: 'team-hub.announcement.feed',
    version: '1.0.0',
    title: 'Announcement Feed',
    description: 'Feed of team announcements',
    domain: 'collaboration',
    owners: ['@team-hub'],
    tags: ['team', 'announcements', 'feed'],
    stability: StabilityEnum.Experimental,
    goal: 'Communicate updates to the team',
    context: 'Team communication',
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
