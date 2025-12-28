import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_project_access_teams_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.project-access-teams',
    title: 'Studio Project Access via Teams',
    summary:
      'Projects live under organizations; team sharing refines access with an admin/owner override.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/project-access-teams',
    tags: ['studio', 'projects', 'teams', 'rbac', 'access-control'],
    body: `# Studio Project Access via Teams

Studio access control is **organization-first** with optional **team-based sharing**.

## Data model

- \`Team\` and \`TeamMember\` define team membership inside an organization.
- \`StudioProject\` is owned by an organization.
- \`StudioProjectTeam\` links projects to 0..N teams.

## Access rules

- **Admins/owners**: always have access to all projects in the organization.
- **Org-wide projects**: if a project has **no team links**, all organization members can access it.
- **Team-scoped projects**: if a project has **one or more team links**, a user must be a member of at least one linked team.

## GraphQL surfaces

- Read:\n  - \`myStudioProjects\` (returns only projects you can access)\n  - \`studioProjectBySlug(slug)\` (enforces the same access rules)\n  - \`myTeams\`\n  - \`projectTeams(projectId)\`\n\n- Write:\n  - \`createStudioProject(input.teamIds?)\` (teamIds optional)\n  - \`setProjectTeams(projectId, teamIds)\` (admin-only)\n
## Related\n+\n+- Team administration + invitations: see \`/docs/tech/studio/team-invitations\`.\n+
## Notes

Payloads and events must avoid secrets/PII. For Sandbox, the model remains local-first and unlogged.
`,
  },
];

registerDocBlocks(tech_studio_project_access_teams_DocBlocks);
