import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const teamHubDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.team-hub',
    title: 'Team Hub',
    summary:
      'Internal collaboration hub with spaces, tasks, rituals, and announcements.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/team-hub',
    tags: ['tasks', 'rituals', 'announcements', 'collaboration'],
    body: `## Domains

- Spaces/projects with members and roles.
- Tasks with status, priority, assignees, due dates.
- Rituals (standups/retros/planning) with cadence and attendance.
- Announcements targeted by space or role.

## Modules reused
- Identity/RBAC for roles and membership
- Notifications for reminders and announcements
- Jobs for scheduling rituals/reminders
- Audit trail for state changes

## Presentations
- Dashboard, space list, task board/detail, ritual calendar, announcement feed.
`,
  },
];

registerDocBlocks(teamHubDocBlocks);
