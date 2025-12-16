# Set Up ContractSpec

The setup wizard configures ContractSpec for your project with sensible defaults.

## What Gets Configured

### CLI Configuration (`.contractsrc.json`)

Creates or updates your project's ContractSpec CLI configuration:

- Output directories for generated code
- Naming conventions for specs
- Default owners and tags
- AI provider settings

### VS Code Settings (`.vscode/settings.json`)

Enables ContractSpec extension features:

- Real-time validation
- CodeLens for specs
- Integrity diagnostics

### MCP for Cursor (`.cursor/mcp.json`)

Registers the ContractSpec MCP server so AI agents can:

- Analyze contract integrity
- List and validate specs
- Generate new specs
- Understand dependencies

### MCP for Claude Desktop

Adds ContractSpec to Claude Desktop for AI-assisted development.

### Cursor AI Rules (`.cursor/rules/contractspec.mdc`)

Provides AI agents with project-specific rules:

- Spec-first development guidelines
- Contract locations and patterns
- Key commands and workflows

### Project AI Guide (`AGENTS.md`)

Creates a guide for AI agents working in your project:

- ContractSpec overview
- How to make changes correctly
- Available tools and commands

## Running Setup

**Interactive Setup**: Run "ContractSpec: Setup ContractSpec" from the command palette. You'll be prompted to select which components to configure.

**Quick Setup**: Run "ContractSpec: Quick Setup (Defaults)" to configure everything with sensible defaults.

## Next Steps

After setup:

1. Review the generated configuration files
2. Create your first spec with "ContractSpec: Create New Spec"
3. Use the Specs Explorer to navigate your contracts





