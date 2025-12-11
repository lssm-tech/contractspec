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
  {
    id: 'docs.examples.team-hub.goal',
    title: 'Team Hub — Goal',
    summary: 'Why this collaboration hub exists and outcomes it targets.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/team-hub/goal',
    tags: ['collaboration', 'goal'],
    body: `## Why it matters
- Provides a regenerable hub for spaces, tasks, rituals, and announcements.
- Keeps ceremonies and task flows consistent across UI/API/events.

## Business/Product goal
- Support team rituals with reminders, visibility, and auditability.
- Enable staged rollouts of new rituals/boards via feature flags.

## Success criteria
- Tasks/rituals/announcements regenerate safely from spec updates.
- Notifications and audit hooks fire for key transitions.`,
  },
  {
    id: 'docs.examples.team-hub.usage',
    title: 'Team Hub — Usage',
    summary: 'How to set up spaces, tasks, and rituals and regenerate safely.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/team-hub/usage',
    tags: ['collaboration', 'usage'],
    body: `## Setup
1) Seed (if available) or create a space; add members and tasks; schedule rituals.
2) Configure Notifications for rituals/reminders and announcements; use Jobs for scheduling.

## Extend & regenerate
1) Adjust schemas: task priority/status, ritual cadence/attendance, announcement targeting.
2) Regenerate to update boards/calendars/feeds; mark PII paths as needed.
3) Use Feature Flags to trial new rituals or task views.

## Guardrails
- Emit events for task/ritual/announcement changes; log in Audit Trail.
- Keep ritual cadence declarative; avoid hardcoded schedules.
- Ensure announcements carry title/description for accessibility.`,
  },
];

registerDocBlocks(teamHubDocBlocks);
