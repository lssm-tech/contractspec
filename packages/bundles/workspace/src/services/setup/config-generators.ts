/**
 * Config generators for setup targets.
 *
 * Each generator returns the default configuration for a target.
 */

import type { SetupOptions } from './types';

/**
 * Generate .contractsrc.json content.
 *
 * Adapts defaults based on monorepo scope.
 */
export function generateContractsrcConfig(options: SetupOptions): object {
  // For package-level config in monorepo, use simpler relative paths
  const isPackageLevel = options.isMonorepo && options.scope === 'package';

  return {
    $schema: 'https://api.contractspec.io/schemas/contractsrc.json',
    aiProvider: 'claude',
    aiModel: 'claude-sonnet-4-20250514',
    agentMode: 'claude-code',
    // outputDir is relative to the config file location
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
    // Versioning configuration
    versioning: {
      autoBump: false,
      bumpStrategy: 'impact',
      changelogTiers: ['spec', 'library', 'monorepo'],
      format: 'keep-a-changelog',
      commitChanges: false,
      createTags: false,
      integrateWithChangesets: true, // Enable changesets integration by default
    },
    // Git hooks configuration (Husky compatible)
    hooks: {
      'pre-commit': [
        'contractspec validate **/*.operation.ts',
        'contractspec integrity check',
      ],
    },
    // Add monorepo hint if at package level
    ...(isPackageLevel && options.packageName
      ? { package: options.packageName }
      : {}),
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
 *
 * Adapts paths based on monorepo scope.
 */
export function generateCursorRules(options: SetupOptions): string {
  const projectName = options.projectName ?? 'this project';
  const isPackageLevel = options.isMonorepo && options.scope === 'package';

  // Base contract path depends on scope
  const basePath =
    isPackageLevel && options.packageRoot
      ? `${options.packageRoot.split('/').slice(-2).join('/')}/src/contracts`
      : 'src/contracts';

  const monorepoNote = options.isMonorepo
    ? `\n## Monorepo Structure\n\nThis is a monorepo. Contracts may exist at:\n- Package level: \`packages/*/src/contracts/\`\n- Workspace level: \`src/contracts/\`\n\nCheck the appropriate level based on the feature scope.\n`
    : '';

  return `# ContractSpec Development Rules

This project uses ContractSpec for spec-first development. Follow these guidelines when working with AI agents.

## Spec-First Principle

- **Always update contracts first** before changing implementation code.
- Contracts are the source of truth for operations, events, and presentations.
- Implementation code should be generated or derived from contracts.
${monorepoNote}
## Contract Locations

Contracts are located in:
- \`${basePath}/operations/\` - Command and query specs
- \`${basePath}/events/\` - Event specs
- \`${basePath}/presentations/\` - UI presentation specs
- \`${basePath}/features/\` - Feature module specs

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
  meta: { name: 'service.action', version: '1.0.0', ... },
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
 *
 * Adapts paths and instructions based on monorepo scope.
 */
export function generateAgentsMd(options: SetupOptions): string {
  const projectName = options.projectName ?? 'This Project';
  const isPackageLevel = options.isMonorepo && options.scope === 'package';

  // Contract path depends on scope
  const contractPath = 'src/contracts/';

  const monorepoSection = options.isMonorepo
    ? `
## Monorepo Structure

This is a monorepo. Contracts can exist at multiple levels:

| Level | Location | Use Case |
|-------|----------|----------|
| Package | \`packages/*/src/contracts/\` | Package-specific contracts |
| Workspace | \`src/contracts/\` | Shared cross-package contracts |

When adding a contract, consider:
- Is this specific to one package? → Add at package level
- Is this shared across packages? → Add at workspace level

### Current Scope

${isPackageLevel ? `You are working at the **package level**: \`${options.packageName ?? options.packageRoot}\`` : 'You are working at the **workspace level**.'}
`
    : '';

  return `# AI Agent Guide

This repository uses **ContractSpec** for spec-first development. AI agents should follow these guidelines.

## Project: ${projectName}

## ContractSpec Overview

ContractSpec is a deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.

### Key Principles

1. **Contracts are the source of truth** - Always check/update contracts before modifying implementation.
2. **Safe regeneration** - Code can be regenerated from specs without breaking invariants.
3. **Multi-surface consistency** - API, events, and UI stay in sync via shared contracts.
${monorepoSection}
## Working in This Repository

### Before Making Changes

1. Check for existing contracts in \`${contractPath}\`
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
| Operations | \`${contractPath}operations/\` |
| Events | \`${contractPath}events/\` |
| Presentations | \`${contractPath}presentations/\` |
| Features | \`${contractPath}features/\` |

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
