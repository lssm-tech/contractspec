import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_platform_admin_panel_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.platform-admin-panel',
    title: 'Studio Platform Admin Panel',
    summary:
      'How PLATFORM_ADMIN organizations manage tenant orgs and integration connections without session switching.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/platform-admin-panel',
    tags: ['studio', 'admin', 'multi-tenancy', 'integrations', 'better-auth'],
    body: `# Studio Platform Admin Panel

ContractSpec Studio exposes a dedicated **Platform Admin Panel** for users whose **active organization** has:

- \`Organization.type = PLATFORM_ADMIN\`

The UI route is:

- \`/studio/admin\`

## Authorization model (no org switching)

Platform admins **remain in their own organization**. Cross-tenant actions are always explicit and scoped:

- Admin operations require an explicit \`targetOrganizationId\`.
- No session / activeOrganizationId switching is performed as part of admin operations.

## Integrations management

The admin panel manages the full ContractSpec Integrations system:

- Lists all shipped \`IntegrationSpec\` entries (registry built via \`createDefaultIntegrationSpecRegistry()\`).
- CRUD \`IntegrationConnection\` records for a selected tenant org.

### Secrets (reference-only + write-only)

The admin UI supports two modes:

- **Reference-only (BYOK)**: store only \`secretProvider\` + \`secretRef\`.
- **Write-only provisioning/rotation**: paste a raw secret payload; server writes to the selected backend and stores the resulting reference. The secret value is **never returned or displayed**.

Supported backends:

- Env overrides (\`env://...\`)
- Google Cloud Secret Manager (\`gcp://...\`)
- AWS Secrets Manager (\`aws://secretsmanager/...\`)
- Scaleway Secret Manager (\`scw://secret-manager/...\`)

## Better Auth Admin plugin

The panel uses the Better Auth **Admin plugin** for user operations (list users, impersonation):

- Client calls use \`authClient.admin.*\`.
- Server-side, ContractSpec enforces that users in a PLATFORM_ADMIN active org have \`User.role\` containing \`admin\` so Better Auth Admin endpoints authorize.

## GraphQL surface

The platform-admin GraphQL operations are guarded by the active org type and include:

- \`platformAdminOrganizations(search, limit, offset)\`
- \`platformAdminIntegrationSpecs\`
- \`platformAdminIntegrationConnections(input: { targetOrganizationId, category?, status? })\`
- \`platformAdminIntegrationConnectionCreate(input)\`
- \`platformAdminIntegrationConnectionUpdate(input)\`
- \`platformAdminIntegrationConnectionDelete(targetOrganizationId, connectionId)\`

## Key implementation files

- Auth + role enforcement: \`packages/bundles/contractspec-studio/src/application/services/auth.ts\`
- Admin GraphQL module: \`packages/bundles/contractspec-studio/src/infrastructure/graphql/modules/platform-admin.ts\`
- Integrations admin service: \`packages/bundles/contractspec-studio/src/modules/platform-integrations/index.ts\`
- Web route: \`packages/apps/web-landing/src/app/(app-customer)/studio/admin/*\`
`,
  },
];

registerDocBlocks(tech_studio_platform_admin_panel_DocBlocks);
