# Studio Project Access via Teams

Studio access control is **organization-first** with optional **team-based sharing**.

## Data model

- `Team` and `TeamMember` define team membership inside an organization.
- `StudioProject` is owned by an organization.
- `StudioProjectTeam` links projects to 0..N teams.

## Access rules

- **Admins/owners**: always have access to all projects in the organization.
- **Org-wide projects**: if a project has **no team links**, all organization members can access it.
- **Team-scoped projects**: if a project has **one or more team links**, a user must be a member of at least one linked team.

## GraphQL surfaces

- Read:
  - `myStudioProjects` (returns only projects you can access)
  - `studioProjectBySlug(slug)` (enforces the same access rules)
  - `myTeams`
  - `projectTeams(projectId)`

- Write:
  - `createStudioProject(input.teamIds?)` (teamIds optional)
  - `setProjectTeams(projectId, teamIds)` (admin-only)


## Related
+
+- Team administration + invitations: see `/docs/tech/studio/team-invitations`.
+
## Notes

Payloads and events must avoid secrets/PII. For Sandbox, the model remains local-first and unlogged.
