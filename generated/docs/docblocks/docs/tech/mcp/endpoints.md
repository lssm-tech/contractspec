# ContractSpec MCP endpoints

Three dedicated MCP servers keep AI agents efficient and scoped:

- **Docs MCP**: `/api/mcp/docs` — exposes DocBlocks as resources + presentations. Tool: `docs.search`.
- **CLI MCP**: `/api/mcp/cli` — surfaces CLI quickstart/reference/README and suggests commands. Tool: `cli.suggestCommand`.
- **Internal MCP**: `/api/mcp/internal` — internal routing hints, playbook, and example registry access. Tool: `internal.describe`.

### Usage notes
- Transports are HTTP POST (streamable HTTP); SSE is disabled.
- Resources are namespaced (`docs://*`, `cli://*`, `internal://*`) and are read-only.
- Internal MCP also exposes the examples registry via `examples://*` resources:
  - `examples://list?q=<query>`
  - `examples://example/<id>`
- Prompts mirror each surface (navigator, usage, bootstrap) for quick agent onboarding.
- GraphQL remains at `/graphql`; health at `/health`.
