# Studio Teams & Invitations

Studio uses **organization membership** as the base access model. Teams are optional and used to refine access to projects.

## Who can manage teams?

- **Admins/owners only**: create, rename, delete teams; manage project team access; issue invitations.

## Invitation data model

- `Invitation` rows are stored under an organization and target an **email** address.

- An invitation can optionally target a `teamId`, which will grant the user membership in that team upon acceptance.

Key fields:
- `email`: invited address (must match the accepting user's account email)

- `status`: `pending | accepted | declined | expired`

- `teamId?`: optional team to join

- `inviterId`: user who issued the invitation

## GraphQL surfaces

- Team CRUD (admin-only):

  - `createTeam(name)`

  - `renameTeam(teamId, name)`

  - `deleteTeam(teamId)`


- Invitations (admin-only):

  - `organizationInvitations`

  - `inviteToOrganization(email, role?, teamId?)` → returns `inviteUrl` and whether an email was sent

## Accepting an invitation

The invite link is served as:

- `/invite/{invitationId}`

Acceptance rules:
- The user must be authenticated.

- The authenticated user’s email must match `Invitation.email`.

- If not already a member, create `Member(userId, organizationId, role)`.

- If `teamId` is present, ensure `TeamMember(teamId, userId)`.

- Mark invitation `status='accepted'` and set `acceptedAt`.

- Set `activeOrganizationId` for the session so `/studio/*` routes work immediately.

## Email delivery

- If `RESEND_API_KEY` is set, the system attempts to send an email.

- Otherwise, the UI uses the returned `inviteUrl` for manual copy/share.
