/**
 * LLM Implement Feature Prompt
 *
 * Guides the agent through implementing a spec from ContractSpec.
 */

import { definePrompt } from '@lssm/lib.contracts';
import z from 'zod';

export function llmImplementPrompt() {
  const input = z.object({
    specPath: z.string(),
    agent: z.string().optional(),
    targetPath: z.string().optional(),
  });

  return definePrompt({
    meta: {
      name: 'llm.implement',
      version: 1,
      title: 'Implement a ContractSpec',
      description:
        'Step-by-step guidance to implement a ContractSpec operation using AI-assisted development.',
      tags: ['contractspec', 'llm', 'implement'],
      stability: 'stable',
      owners: ['@contractspec'],
    },
    args: [
      {
        name: 'specPath',
        schema: z.string(),
        required: true,
        description: 'Path to the spec file to implement',
      },
      {
        name: 'agent',
        schema: z.string().optional(),
        description:
          'Target agent: claude-code, cursor-cli, generic-mcp (default)',
      },
      {
        name: 'targetPath',
        schema: z.string().optional(),
        description: 'Target path for the implementation file',
      },
    ],
    input,
    render: async ({ specPath, agent, targetPath }) => {
      const agentType = agent ?? 'generic-mcp';
      const text = `# Implement ContractSpec: ${specPath}

## Step 1: Get the implementation guide

Run the llm.guide tool to get a detailed implementation plan:

\`\`\`
llm.guide {
  specPath: "${specPath}",
  agent: "${agentType}"${targetPath ? `,\n  targetPath: "${targetPath}"` : ''}
}
\`\`\`

This will return:
- A system prompt (context about ContractSpec)
- A task prompt (specific instructions for implementing this spec)
- The number of implementation steps
- Suggested files to create/modify

## Step 2: Export the full spec

For reference, export the full spec as markdown:

\`\`\`
llm.export {
  specPath: "${specPath}",
  format: "full"
}
\`\`\`

## Step 3: Implement following the guide

1. Create the files suggested in the guide
2. Implement input validation using the schema
3. Handle all error cases defined in the spec
4. Emit events as specified in sideEffects
5. Write tests covering acceptance scenarios

## Step 4: Verify the implementation

After implementation, verify against the spec:

\`\`\`
llm.verify {
  specPath: "${specPath}",
  implementationPath: "${targetPath ?? '<your-implementation-path>'}",
  tier: "2"
}
\`\`\`

This runs:
- Tier 1: Structure checks (types, exports, imports)
- Tier 2: Behavior checks (scenarios, error handling)

## Tips

- Use TypeScript with strict typing (no \`any\`)
- Follow the acceptance scenarios as your implementation guide
- Emit events in the correct conditions
- Respect policy constraints (auth, rate limits, PII handling)
`;
      return [{ type: 'text', text }];
    },
  });
}
