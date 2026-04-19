# contractspec-adoption Cursor Plugin

Consumer-facing plugin for the ContractSpec Adoption Engine.

It focuses on:

- reusing existing workspace code before inventing new local surfaces,
- preferring ContractSpec OSS packages by family,
- running Connect-based adoption hooks before risky file edits and shell commands.

## Included workflows

- `adoption-resolve`
- `adoption-sync`

## Included MCP servers

- `contractspec-docs` -> `https://api.contractspec.io/api/mcp/docs`
- `contractspec-cli` -> `https://api.contractspec.io/api/mcp/cli`
- `contractspec-contracts` -> `https://api.contractspec.io/api/mcp/contracts`
