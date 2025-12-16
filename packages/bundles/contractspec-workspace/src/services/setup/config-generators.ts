/**
 * Config generators for setup targets.
 *
 * Each generator returns the default configuration for a target.
 */

import type { SetupOptions } from './types';

/**
 * Generate .contractsrc.json content.
 */
export function generateContractsrcConfig(options: SetupOptions): object {
  return {
    $schema: 'https://contractspec.dev/schemas/contractsrc.json',
    aiProvider: 'claude',
    aiModel: 'claude-sonnet-4-20250514',
    agentMode: 'claude-code',
    outputDir: './src',
    conventions: {
      operations: 'contracts/operations',
      events: 'contracts/events',
      presentations: 'contracts/presentations',
      forms: 'contracts/forms',
      features: 'contracts/features',
    },
    defaultOwners: options.defaultOwners ?? ['@team'],
    defaultTags: [],
  };
}

/**
 * Generate .vscode/settings.json ContractSpec settings.
 */
export function generateVscodeSettings(): object {
  return {
    'contractspec.validation.enabled': true,
    'contractspec.validation.validateOnSave': true,
    'contractspec.validation.validateOnOpen': true,
    'contractspec.codeLens.enabled': true,
    'contractspec.diagnostics.showWarnings': true,
    'contractspec.diagnostics.showHints': true,
    'contractspec.integrity.enabled': true,
    'contractspec.integrity.checkOnSave': true,
  };
}

/**
 * Generate .cursor/mcp.json content.
 */
export function generateCursorMcpConfig(): object {
  return {
    mcpServers: {
      'contractspec-local': {
        command: 'bunx',
        args: ['contractspec-mcp'],
      },
    },
  };
}

/**
 * Generate Claude Desktop MCP config.
 * Returns the mcpServers section to merge into claude_desktop_config.json.
 */
export function generateClaudeMcpConfig(): object {
  return {
    mcpServers: {
      'contractspec-local': {
        command: 'bunx',
        args: ['contractspec-mcp'],
      },
    },
  };
}

/**
 * Generate .cursor/rules/contractspec.mdc content.
 */
export function generateCursorRules(options: SetupOptions): string {
  const projectName = options.projectName ?? 'this project';

  return `# ContractSpec Development Rules

This project uses ContractSpec for spec-first development. Follow these guidelines when working with AI agents.

## Spec-First Principle

- **Always update contracts first** before changing implementation code.
- Contracts are the source of truth for operations, events, and presentations.
- Implementation code should be generated or derived from contracts.

## Contract Locations

Contracts are located in:
- \`src/contracts/operations/\` - Command and query specs
- \`src/contracts/events/\` - Event specs
- \`src/contracts/presentations/\` - UI presentation specs
- \`src/contracts/features/\` - Feature module specs

## When Making Changes

1. **Before coding**: Check if a contract exists for the feature.
2. **If contract exists**: Update the contract first, then regenerate code.
3. **If no contract**: Create a new contract using \`contractspec create\`.
4. **After changes**: Validate with \`contractspec validate\`.

## Key Commands

- \`contractspec create\` - Scaffold new specs
- \`contractspec validate\` - Validate specs
- \`contractspec build\` - Generate implementation code
- \`contractspec integrity\` - Check contract health

## Contract Structure

Operations follow this pattern:
\`\`\`typescript
defineCommand({
  meta: { name: 'service.action', version: 1, ... },
  io: { input: InputSchema, output: OutputSchema },
  policy: { auth: 'user', ... },
  handler: async (args, ctx) => { ... }
});
\`\`\`

## Rules for ${projectName}

- All API endpoints must have a corresponding operation contract.
- Events must be declared in contracts before being emitted.
- UI components should reference presentation contracts.
- Feature flags should be defined in feature modules.
`;
}

/**
 * Generate AGENTS.md content.
 */
export function generateAgentsMd(options: SetupOptions): string {
  const projectName = options.projectName ?? 'This Project';

  return `# AI Agent Guide

This repository uses **ContractSpec** for spec-first development. AI agents should follow these guidelines.

## Project: ${projectName}

## ContractSpec Overview

ContractSpec is a deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.

### Key Principles

1. **Contracts are the source of truth** - Always check/update contracts before modifying implementation.
2. **Safe regeneration** - Code can be regenerated from specs without breaking invariants.
3. **Multi-surface consistency** - API, events, and UI stay in sync via shared contracts.

## Working in This Repository

### Before Making Changes

1. Check for existing contracts in \`src/contracts/\`
2. If a contract exists, update it first
3. Regenerate implementation with \`contractspec build\`
4. Validate with \`contractspec validate\`

### Creating New Features

1. Create a feature spec: \`contractspec create --type=feature\`
2. Add operations: \`contractspec create --type=operation\`
3. Add events if needed: \`contractspec create --type=event\`
4. Build implementation: \`contractspec build\`

### Contract Locations

| Type | Location |
|------|----------|
| Operations | \`src/contracts/operations/\` |
| Events | \`src/contracts/events/\` |
| Presentations | \`src/contracts/presentations/\` |
| Features | \`src/contracts/features/\` |

## MCP Tools Available

The ContractSpec MCP server provides these tools:

- \`integrity.analyze\` - Check contract health
- \`specs.list\` - List all specs
- \`specs.validate\` - Validate a spec file
- \`specs.create\` - Create new specs
- \`deps.analyze\` - Analyze dependencies

## Common Tasks

### Add a new API endpoint

\`\`\`bash
contractspec create --type=operation --name=myService.newAction
\`\`\`

### Add a new event

\`\`\`bash
contractspec create --type=event --name=entity.changed
\`\`\`

### Check contract integrity

\`\`\`bash
contractspec integrity
\`\`\`

## Nested AGENTS.md

More specific instructions may exist in subdirectories. Check for \`AGENTS.md\` files in the relevant package or module.
`;
}

/**
 * Get the file path for Claude Desktop config based on platform.
 */
export function getClaudeDesktopConfigPath(): string {
  const platform = process.platform;
  const homeDir = process.env['HOME'] ?? process.env['USERPROFILE'] ?? '';

  switch (platform) {
    case 'darwin':
      return `${homeDir}/Library/Application Support/Claude/claude_desktop_config.json`;
    case 'win32':
      return `${process.env['APPDATA'] ?? homeDir}/Claude/claude_desktop_config.json`;
    default:
      // Linux and others
      return `${homeDir}/.config/claude/claude_desktop_config.json`;
  }
}


