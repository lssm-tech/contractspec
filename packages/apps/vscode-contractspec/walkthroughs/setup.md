# Set Up ContractSpec

The setup wizard is preset-driven. It configures ContractSpec for your project with one of these presets:

- `core`
- `connect`
- `builder-managed`
- `builder-local`
- `builder-hybrid`

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

**Interactive Setup**: Run "ContractSpec: Setup ContractSpec" from the command palette. You'll first choose the initialization preset, then only the preset-relevant fields and generated files.

**Quick Setup**: Run "ContractSpec: Quick Setup (Defaults)" to apply the `core` preset non-interactively.

## Next Steps

After setup:

1. Review the generated configuration files and preset-specific next steps in the output channel.
2. Create your first spec with "ContractSpec: Create New Spec".
3. If you chose a Builder preset, run the suggested `contractspec builder ...` bootstrap command from the setup output.
4. Use the Specs Explorer to navigate your contracts.





