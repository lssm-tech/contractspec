import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_team_invitations_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.team-invitations',
    title: 'Studio Teams & Invitations',
    summary:
      'Admin-only team management and email invitation flow to join an organization and optionally a team.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/team-invitations',
    tags: ['studio', 'teams', 'invitations', 'access-control', 'onboarding'],
    body: `# Studio Teams & Invitations

Studio uses **organization membership** as the base access model. Teams are optional and used to refine access to projects.

## Who can manage teams?

- **Admins/owners only**: create, rename, delete teams; manage project team access; issue invitations.

## Invitation data model

- \`Invitation\` rows are stored under an organization and target an **email** address.\n
- An invitation can optionally target a \`teamId\`, which will grant the user membership in that team upon acceptance.

Key fields:
- \`email\`: invited address (must match the accepting user's account email)\n
- \`status\`: \`pending | accepted | declined | expired\`\n
- \`teamId?\`: optional team to join\n
- \`inviterId\`: user who issued the invitation

## GraphQL surfaces

- Team CRUD (admin-only):\n
  - \`createTeam(name)\`\n
  - \`renameTeam(teamId, name)\`\n
  - \`deleteTeam(teamId)\`\n

- Invitations (admin-only):\n
  - \`organizationInvitations\`\n
  - \`inviteToOrganization(email, role?, teamId?)\` → returns \`inviteUrl\` and whether an email was sent

## Accepting an invitation

The invite link is served as:\n
- \`/invite/{invitationId}\`

Acceptance rules:
- The user must be authenticated.\n
- The authenticated user’s email must match \`Invitation.email\`.\n
- If not already a member, create \`Member(userId, organizationId, role)\`.\n
- If \`teamId\` is present, ensure \`TeamMember(teamId, userId)\`.\n
- Mark invitation \`status='accepted'\` and set \`acceptedAt\`.\n
- Set \`activeOrganizationId\` for the session so \`/studio/*\` routes work immediately.

## Email delivery

- If \`RESEND_API_KEY\` is set, the system attempts to send an email.\n
- Otherwise, the UI uses the returned \`inviteUrl\` for manual copy/share.
`,
  },
];

registerDocBlocks(tech_studio_team_invitations_DocBlocks);


