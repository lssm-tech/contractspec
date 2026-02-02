## Concepts

- **Organization**: the primary grouping boundary for Studio projects.
- **Project**: one application (specs, overlays, deployments, integrations, evolution, learning).
- **Team**: refines who can see/edit a project within an organization.
- **Environment**: deployment target (Development / Staging / Production).

## Project access (teams + admin override)

Studio uses multi-team sharing to refine access:

- **Admins/owners** can access all projects.
- If a project is shared with **no teams**, it is **org-wide** (all org members).
- If a project is shared with **one or more teams**, it is visible to:
  - admins/owners, and
  - members of any linked team.

## Current persistence (DB + GraphQL)

- DB (Prisma): `StudioProject`, `Team`, `TeamMember`, `StudioProjectTeam`
- GraphQL:
  - `myStudioProjects`
  - `createStudioProject(input.teamIds?)`
  - `myTeams`
  - `projectTeams(projectId)`
  - `setProjectTeams(projectId, teamIds)`

## UI shell behavior

Studio and Sandbox both use a shared shell:

- Project selector → Module navigation → Environment selector
- Always-on Assistant button (floating)
- Learning journey progress (Studio persists learning events; Sandbox stays local-only)

## Routing

- `/studio/projects`: create/select/delete projects (organization-first).
- `/studio/{projectSlug}/*`: project modules (canvas/specs/deploy/integrations/evolution/learning).
- `/studio/learning`: learning hub without selecting a project.
