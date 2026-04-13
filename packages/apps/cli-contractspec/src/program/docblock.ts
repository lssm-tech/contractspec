import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';

export const ContractSpecCliDocBlock = {
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

## Installation

\`\`\`bash
bun add -D @contractspec/app.cli-contractspec
\`\`\`

## Quick Start

\`\`\`bash
contractspec create
contractspec build contracts/users.create.contracts.ts
contractspec generate
contractspec validate packages/bundles/workspace/src/bundles/WorkspaceBundle.ts
\`\`\`

## Operator Flows

### \`control-plane\`

Use the CLI to inspect approvals, traces, and deterministic replay state.

\`\`\`bash
contractspec control-plane approval list --workspace-id workspace-1
contractspec control-plane approval approve <decisionId> --actor-id operator-1 --capability-grants control-plane.execution.approve
contractspec control-plane trace list --workspace-id workspace-1 --provider-key messaging.slack
contractspec control-plane trace replay <decisionId>
\`\`\`

Environment:

- \`CHANNEL_RUNTIME_STORAGE\` defaults to \`postgres\`
- Supported storage modes are \`memory\` and \`postgres\`; invalid values fail fast
- \`CHANNEL_RUNTIME_DATABASE_URL\` or \`DATABASE_URL\` is required for postgres-backed flows

## Core Commands

- \`create\` — author runtime specs and package-oriented targets such as module bundles and builder/provider specs
- \`build\` — materialize runtime artifacts or package scaffolds from one authored target
- \`generate\` — generate docs and derived artifacts across the workspace
- \`validate\` — validate authored targets, package scaffolds, and runtime implementations
- \`impact\` — breaking-change detection against a baseline
- \`doctor\` and \`ci\` — repository health and CI-oriented checks

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
`,
} satisfies DocBlock;
