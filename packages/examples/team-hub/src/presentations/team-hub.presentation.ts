/**
 * Team Hub Presentations
 */
import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';

const OWNERS = ['@team-hub'] as const;

export const TeamDashboardPresentation = definePresentation({
  meta: {
    key: 'team-hub.dashboard',
    version: '1.0.0',
    title: 'Team Dashboard',
    description: 'Main team hub dashboard.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'Central hub for team activity.',
    context: 'Landing page for team members.',
    tags: ['dashboard', 'team'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TeamDashboard',
  },
  targets: ['react'],
});

export const SpaceListPresentation = definePresentation({
  meta: {
    key: 'team-hub.space.list',
    version: '1.0.0',
    title: 'Space List',
    description: 'List of team spaces.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'Navigate between team spaces.',
    context: 'Sidebar or spaces hub.',
    tags: ['space', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SpaceList',
  },
  targets: ['react'],
});

export const TaskBoardPresentation = definePresentation({
  meta: {
    key: 'team-hub.task.board',
    version: '1.0.0',
    title: 'Task Board',
    description: 'Kanban board for team tasks.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'Visualize task progress.',
    context: 'Project management view.',
    tags: ['task', 'board'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TaskBoard',
  },
  targets: ['react'],
});

export const TaskDetailPresentation = definePresentation({
  meta: {
    key: 'team-hub.task.detail',
    version: '1.0.0',
    title: 'Task Detail',
    description: 'Detailed view of a task.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'View and edit task details.',
    context: 'Task modal or page.',
    tags: ['task', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'TaskDetail',
  },
  targets: ['react'],
});

export const RitualCalendarPresentation = definePresentation({
  meta: {
    key: 'team-hub.ritual.calendar',
    version: '1.0.0',
    title: 'Ritual Calendar',
    description: 'Calendar of team rituals and events.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'Schedule and view team events.',
    context: 'Calendar view.',
    tags: ['ritual', 'calendar'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'RitualCalendar',
  },
  targets: ['react'],
});

export const AnnouncementFeedPresentation = definePresentation({
  meta: {
    key: 'team-hub.announcement.feed',
    version: '1.0.0',
    title: 'Announcement Feed',
    description: 'Feed of team announcements.',
    domain: 'team-hub',
    owners: [...OWNERS],
    stability: StabilityEnum.Experimental,
    goal: 'Broadcast important team news.',
    context: 'Dashboard widget or dedicated page.',
    tags: ['announcement', 'feed'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AnnouncementFeed',
  },
  targets: ['react'],
});
