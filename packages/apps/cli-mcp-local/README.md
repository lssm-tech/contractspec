# @lssm/app.cli-mcp-local

Local MCP server for ContractSpec operations via stdio transport.

Exposes contract integrity, validation, and analysis tools to AI agents like Cursor and Claude Desktop.

## Installation

```bash
# Global install
npm install -g @lssm/app.cli-mcp-local

# Or use npx/bunx directly
npx contractspec-mcp
bunx contractspec-mcp
```

## Configuration

### Cursor IDE

Add to `.cursor/mcp.json`:

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

If you installed globally, you can also use the binary directly:

```json
{
  "mcpServers": {
    "contractspec-local": {
      "command": "contractspec-mcp",
      "args": []
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

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

## Available Tools

### `integrity.analyze`

Analyze contract integrity for orphaned specs and unresolved references.

**Input:**

- `pattern` (optional): Glob pattern for file discovery
- `featureKey` (optional): Analyze only a specific feature
- `all` (optional): Scan all packages in monorepo

**Output:** Health status, coverage metrics, issues list, orphaned specs

### `integrity.diagram`

Generate Mermaid diagrams showing contract relationships.

**Input:**

- `type`: `feature-map` | `orphans` | `dependencies` | `full`
- `featureKeys` (optional): Filter to specific features
- `showVersions` (optional): Include version numbers
- `direction` (optional): `LR` | `TB` | `RL` | `BT`
- `maxNodes` (optional): Maximum nodes to display

**Output:** Mermaid diagram code

### `specs.validate`

Validate a contract spec file for correctness.

**Input:**

- `specPath`: Path to the spec file
- `checkImplementation` (optional): Also check if handler is implemented

**Output:** Validation result with errors/warnings

### `specs.list`

List all contract specs in the workspace.

**Input:**

- `type` (optional): Filter by spec type
- `pattern` (optional): Glob pattern to filter files
- `includeUnknown` (optional): Include untyped specs

**Output:** Spec inventory with counts by type

### `specs.create`

Scaffold a new contract spec.

**Input:**

- `type`: `operation` | `event` | `presentation` | `feature`
- `name`: Spec name (e.g., "myService.createUser")
- `version` (optional): Version number
- `description` (optional): Brief description
- `kind` (optional, for operations): `command` | `query`
- `auth` (optional): `anonymous` | `user` | `admin`

**Output:** Writes the file and returns `{ filePath, wrote, code }`

### `specs.build`

Generate implementation files from a spec.

**Input:**

- `specPath`: Path to the spec file
- `targets` (optional): `handler` | `component` | `test`
- `outputDir` (optional): Override output directory
- `overwrite` (optional): Overwrite existing files
- `dryRun` (optional): Preview without writing

**Output:** Build results with generated file paths

### `deps.analyze`

Analyze contract dependencies.

**Input:**

- `pattern` (optional): Glob pattern for file discovery
- `showCycles` (optional): Detect circular dependencies
- `format` (optional): `json` | `dot`
- `specPath` (optional): Focus on a specific spec

**Output:** Dependency graph, cycles, missing dependencies

## Available Resources

### `spec://inventory`

Complete inventory of all contract specs in the workspace.

### `feature://list`

List of all features and their linked contract specs.

### `config://workspace`

ContractSpec workspace configuration (.contractsrc.json).

## Available Prompts

### `integrity.fix`

Guided prompts for fixing contract integrity issues.

**Arguments:**

- `issueType`: `orphaned` | `unresolved-ref` | `broken-link`
- `specName`: Name of the affected spec

### `specs.create`

Guided prompts for creating a new contract spec.

**Arguments:**

- `type`: Spec type
- `name`: Spec name
- `description`: Brief description

## Example Usage

### From Cursor Chat

```
Use contractspec-local integrity.analyze to check my contracts
```

```
Generate an integrity diagram with contractspec-local
```

```
Create a new operation spec called "users.createUser" using contractspec-local
```

### Programmatic

```typescript
import { createServer } from '@lssm/app.cli-mcp-local';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = createServer({ workspaceRoot: process.cwd() });
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Development

```bash
# Build
bun run build

# Dev mode (watch)
bun run dev

# Test
bun test
```

## Architecture

This package is a thin MCP adapter layer. All business logic lives in:

- `@lssm/bundle.contractspec-workspace` - Core services
- `@lssm/module.contractspec-workspace` - Analysis utilities
- `@lssm/lib.contracts` - Contract definitions
