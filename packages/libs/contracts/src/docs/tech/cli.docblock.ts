import type { DocBlock } from '../types';
import { registerDocBlocks } from '../registry';

export const tech_cli_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.cli.contractspec',
    title: 'ContractSpec CLI',
    summary:
      'The command-line interface for creating, building, and validating contract specifications.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/cli/contractspec',
    tags: ['cli', 'tooling', 'reference'],
    owners: ['@contractspec/app.cli-contractspec'],
    body: `# ContractSpec CLI

The \`@contractspec/app.cli-contractspec\` package provides the command-line interface for the ContractSpec ecosystem.

It is also exposed via \`@contractspec/apps-registry/contractspec\` for convenience.

## Installation

\`\`\`bash
bun add -D @contractspec/app.cli-contractspec
\`\`\`

## Quick Start

\`\`\`bash
# Create a new contract spec interactively
contractspec create

# Create with AI assistance
contractspec create --ai

# Build implementation from spec
contractspec build src/contracts/mySpec.ts

# Validate a spec
contractspec validate src/contracts/mySpec.ts
\`\`\`

## Core Commands

### \`create\`

Interactive wizard to create contract specifications.

\`\`\`bash
contractspec create --type operation --ai
\`\`\`

### \`build\`

Generate implementation code from contract specs using AI agents or templates.

\`\`\`bash
contractspec build src/contracts/signup.contracts.ts --agent-mode claude-code
\`\`\`

### \`validate\`

Validate contract specifications and verify implementations.

\`\`\`bash
contractspec validate src/contracts/signup.contracts.ts --check-implementation
\`\`\`

### \`watch\`

Watch contract specifications and auto-regenerate on changes.

\`\`\`bash
contractspec watch --build --validate
\`\`\`

### \`list\`

List all contract specifications in the project.

\`\`\`bash
contractspec list --owner @team-platform
\`\`\`

### \`cleanup\` / \`clean\`

Clean generated files and build artifacts.

\`\`\`bash
contractspec clean
\`\`\`

### \`deps\`

Analyze contract dependencies and relationships (circular dependencies, missing refs).

\`\`\`bash
contractspec deps --circular
\`\`\`

### \`diff\`

Compare contract specifications and show differences (breaking changes, semantic diff).

\`\`\`bash
contractspec diff spec1.ts spec2.ts --breaking
\`\`\`

### \`ci\`

Run all validation checks for CI/CD pipelines (structure, integrity, deps, doctor, handlers, tests).

\`\`\`bash
contractspec ci --format sarif --output results.sarif
\`\`\`

## Configuration

The CLI is configured via \`.contractsrc.json\` in your project root.

\`\`\`json
{
  "aiProvider": "claude",
  "aiModel": "claude-3-7-sonnet-20250219",
  "agentMode": "claude-code",
  "outputDir": "./src"
}
\`\`\`

For full documentation, refer to the [package README](https://github.com/contractspec/monorepo/tree/main/packages/apps/cli-contractspec).
`,
  },
];

registerDocBlocks(tech_cli_DocBlocks);
