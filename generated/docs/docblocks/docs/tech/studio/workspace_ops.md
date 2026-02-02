## API surface (api-contractspec)

Base: `/api/workspace-ops`

These endpoints are **read-only** in v1 and never push to git:

- `GET /api/workspace-ops/:integrationId/config?organizationId=`
- `GET /api/workspace-ops/:integrationId/specs?organizationId=`
- `POST /api/workspace-ops/:integrationId/validate` (body: organizationId, files?, pattern?)
- `POST /api/workspace-ops/:integrationId/deps` (body: organizationId, pattern?)
- `POST /api/workspace-ops/:integrationId/diff` (body: organizationId, specPath, baseline?, breakingOnly?)

## Repo resolution

- The repo root is resolved from the Studio Integration (`IntegrationProvider.GITHUB`) config:
  - `config.repoCachePath` (preferred) or `config.localPath`
- Resolution is constrained to `CONTRACTSPEC_REPO_CACHE_DIR` (default: `/tmp/contractspec-repos`)

## Intended UX

- Studio Assistant can run these checks and present results as suggestions.
- Users can copy equivalent CLI commands for local runs:
  - `contractspec validate`
  - `contractspec deps`
  - `contractspec diff --baseline <ref>`
