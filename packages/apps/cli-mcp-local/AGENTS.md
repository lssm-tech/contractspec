# AI Agent Guide — `@lssm/app.cli-mcp-local`

Scope: `packages/apps/cli-mcp-local/*`

This is the ContractSpec local MCP server (`contractspec-mcp`), exposing contract operations to AI agents via stdio transport.

## Architecture

The MCP server is a **thin adapter** around business logic in `@lssm/bundle.contractspec-workspace`. It follows the same separation as the CLI:

### MCP Layer (this package)

- **CLI Entry** (`src/cli.ts`) - Stdio transport bootstrap (~40 lines)
- **Server Setup** (`src/server.ts`) - MCP server wiring (~80 lines)
- **Tools** (`src/tools/`) - Thin wrappers exposing bundle services as MCP tools
- **Resources** (`src/resources/`) - MCP resources for spec/feature/config data
- **Prompts** (`src/prompts/`) - Guided prompts for fixing issues

### Business Logic (bundle)

All analysis, validation, and generation logic lives in `@lssm/bundle.contractspec-workspace`:

- `analyzeIntegrity()` - Contract integrity analysis
- `generateMermaidDiagram()` - Visual diagrams
- `analyzeDeps()` - Dependency analysis
- `validateSpec()` - Spec validation
- `listSpecs()` - Spec discovery

## MCP Tools

| Tool                | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `integrity.analyze` | Analyze contract integrity for orphaned specs and unresolved refs |
| `integrity.diagram` | Generate Mermaid diagram (feature-map, orphans, dependencies)     |
| `specs.validate`    | Validate a spec file                                              |
| `specs.list`        | List all specs in workspace                                       |
| `specs.create`      | Scaffold a new spec                                               |
| `specs.build`       | Generate code from spec                                           |
| `deps.analyze`      | Analyze spec dependencies                                         |

## ContractSpec Patterns

Tools are defined using ContractSpec patterns:

- `defineCommand` from `@lssm/lib.contracts` for tool specs
- `SpecRegistry` for tool registration
- `createMcpServer` for MCP server setup

## Local Commands

- **Build**: `bun run build` - Bundle for Node.js
- **Dev**: `bun run dev` - Watch mode
- **Test**: `bun test` - Run tests

## Integration

Configure in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "contractspec-local": {
      "command": "bunx",
      "args": ["contractspec-mcp"]
    }
  }
}
```

Or for Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "contractspec-local": {
      "command": "npx",
      "args": ["contractspec-mcp"]
    }
  }
}
```
