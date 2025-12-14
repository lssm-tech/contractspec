import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_project_routing_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.project-routing',
    title: 'Studio Project Routing',
    summary:
      'Studio uses slugged, project-first routes: /studio/{projectSlug}/* with canonical slug redirects and soft-deleted projects hidden.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/project-routing',
    tags: ['studio', 'routing', 'projects', 'slug', 'redirects'],
    body: `# Studio Project Routing

ContractSpec Studio uses a **project-first URL scheme**:

- \`/studio/projects\` — create, select, and delete projects.
- \`/studio/{projectSlug}/*\` — project modules (canvas/specs/deploy/integrations/evolution/learning).
- \`/studio/learning\` — learning hub that does not require selecting a project.

## Studio layout shell

Studio routes are wrapped in a dedicated **Studio app shell** (header + footer) that provides in-app navigation (Projects/Learning/Teams), organization switching, and account actions.

Project module routes (\`/studio/{projectSlug}/*\`) render their own module shell (\`WorkspaceProjectShellLayout\`). When combined with the global Studio header, the project shell uses a **sticky header offset** to avoid overlapping sticky headers.

## Slug behavior (rename-safe)

- Each project has a \`slug\` stored in the database (\`StudioProject.slug\`).
- When a project name changes, Studio **updates the slug** and stores the previous slug as an alias (\`StudioProjectSlugAlias\`).
- Requests to an alias slug are **redirected to the canonical slug**.

GraphQL entrypoint:

- \`studioProjectBySlug(slug: String!)\` returns:
  - \`project\`
  - \`canonicalSlug\`
  - \`wasRedirect\`

## Deletion behavior (soft delete)

Projects are **soft-deleted**:

- \`deleteStudioProject(id: String!)\` sets \`StudioProject.deletedAt\`.
- All listings and access checks filter \`deletedAt = null\`.
- Soft-deleted projects are treated as “not found” in Studio routes and GraphQL access checks.

## Available modules for a selected project

The following project modules are expected under \`/studio/{projectSlug}\`:

- \`/canvas\` — Visual builder canvas (stored via overlays and canvas versions).
- \`/specs\` — Spec editor (stored as \`StudioSpec\`).
- \`/deploy\` — Deployments history + triggers (stored as \`StudioDeployment\`).
- \`/integrations\` — Integrations scoped to project (stored as \`StudioIntegration\`).
- \`/evolution\` — Evolution sessions (stored as \`EvolutionSession\`).
- \`/learning\` — Project learning activity.
`,
  },
];

registerDocBlocks(tech_studio_project_routing_DocBlocks);


