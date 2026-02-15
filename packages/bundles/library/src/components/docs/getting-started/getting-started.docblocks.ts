import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

export const gettingStartedDocBlocks: DocBlock[] = [
  {
    id: 'docs.getting-started.start-here',
    title: 'Start here',
    summary: 'Fast onboarding path from install to first generated contract.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/getting-started/start-here',
    tags: ['getting-started', 'onboarding'],
    body: `# Start Here

Get ContractSpec running quickly and generate your first contract-backed code.

## 1. Install the CLI

\`\`\`bash
bun add -D contractspec
bun add @contractspec/lib.contracts-spec @contractspec/lib.schema
\`\`\`

## 2. Initialize your project

\`\`\`bash
bunx contractspec init
\`\`\`

## 3. Create your first contract

\`\`\`bash
contractspec create --type operation
\`\`\`

## 4. Generate implementation

\`\`\`bash
contractspec build src/contracts/mySpec.ts
contractspec validate src/contracts/mySpec.ts
\`\`\`

## Next steps

- Follow the Hello World tutorial for a full walkthrough.
- Install the VS Code extension for inline validation.
- Review compatibility notes before deploying to production.
`,
  },
  {
    id: 'docs.getting-started.troubleshooting',
    title: 'Troubleshooting',
    summary: 'Resolve common install, spec discovery, and build issues.',
    kind: 'faq',
    visibility: 'public',
    route: '/docs/getting-started/troubleshooting',
    tags: ['getting-started', 'troubleshooting'],
    body: `# Troubleshooting

Common issues and quick fixes when getting started with ContractSpec.

## Command not found

- Reinstall the CLI and ensure it is in your PATH.
- Confirm Node.js 20+ or Bun 1.0+ is installed.

## Specs not discovered

- Run \`contractspec list\` to see discovered specs.
- Verify your spec path conventions in \`.contractsrc.json\`.

## Build or validate fails

- Run \`contractspec validate\` to surface schema errors.
- Check that generated files were not manually edited.

## Diagnostics

\`\`\`bash
contractspec --version
contractspec list
contractspec validate src/contracts/mySpec.ts
\`\`\`

## Still blocked?

- Confirm compatibility requirements (runtime, framework, package manager).
- Re-run \`contractspec build\` with a clean working tree.
`,
  },
  {
    id: 'docs.getting-started.compatibility',
    title: 'Compatibility',
    summary: 'Supported runtimes, frameworks, package managers, and AI modes.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/getting-started/compatibility',
    tags: ['getting-started', 'compatibility'],
    body: `# Compatibility

ContractSpec supports modern TypeScript stacks with spec-first workflows.

## Runtimes

- Node.js 20+
- Bun 1.0+

## Frameworks

- Next.js 14+ (App Router preferred)
- Bun + Elysia or other HTTP servers

## Package managers

- bun (recommended)
- npm
- yarn
- pnpm

## AI agent modes

- claude-code
- openai-codex
- cursor
- opencode
- simple (direct LLM)

## Datastores

- PostgreSQL via Prisma
- Bring your own adapter for other databases
`,
  },
];

registerDocBlocks(gettingStartedDocBlocks);
