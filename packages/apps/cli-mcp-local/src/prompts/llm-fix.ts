/**
 * LLM Fix Violations Prompt
 *
 * Guides the agent through fixing spec violations after verification.
 */

import { definePrompt } from '@lssm/lib.contracts';
import z from 'zod';

export function llmFixPrompt() {
  const input = z.object({
    specPath: z.string(),
    implementationPath: z.string(),
  });

  return definePrompt({
    meta: {
      name: 'llm.fix-violations',
      version: 1,
      title: 'Fix spec violations',
      description:
        'Guide to fix violations found during implementation verification.',
      tags: ['contractspec', 'llm', 'fix'],
      stability: 'stable',
      owners: ['@contractspec'],
    },
    args: [
      {
        name: 'specPath',
        schema: z.string(),
        required: true,
        description: 'Path to the spec file',
      },
      {
        name: 'implementationPath',
        schema: z.string(),
        required: true,
        description: 'Path to the implementation file',
      },
    ],
    input,
    render: async ({ specPath, implementationPath }) => {
      const text = `# Fix Spec Violations

## Current files
- Spec: ${specPath}
- Implementation: ${implementationPath}

## Workflow

### 1. Get the spec details

\`\`\`
llm.export {
  specPath: "${specPath}",
  format: "full"
}
\`\`\`

### 2. Run verification to find issues

\`\`\`
llm.verify {
  specPath: "${specPath}",
  implementationPath: "${implementationPath}",
  tier: "2"
}
\`\`\`

### 3. Fix each issue by category

#### Type issues
- Ensure input/output types match spec schemas
- Replace \`any\` with proper types
- Add missing type definitions

#### Export issues
- Export the handler function
- Export type definitions if needed
- Check export syntax matches import expectations

#### Import issues
- Import from @lssm/lib.contracts
- Import from @lssm/lib.schema
- Import event types if emitting events

#### Scenario issues
- Review acceptance scenarios in the spec
- Implement logic to satisfy each scenario
- Add tests for each scenario

#### Error handling issues
- Implement all error cases from spec.io.errors
- Return correct error codes
- Use appropriate HTTP status codes

#### Event emission issues
- Emit events defined in spec.sideEffects.emits
- Emit under correct conditions (check "when" field)
- Include correct payload

### 4. Re-verify until passed

\`\`\`
llm.verify {
  specPath: "${specPath}",
  implementationPath: "${implementationPath}",
  tier: "2"
}
\`\`\`

## Common patterns

### Validation
\`\`\`typescript
import { inputSchema } from './types';

export async function handle(rawInput: unknown) {
  const input = inputSchema.parse(rawInput);
  // ...
}
\`\`\`

### Error handling
\`\`\`typescript
if (!user) {
  throw new Error('USER_NOT_FOUND'); // Match spec error code
}
\`\`\`

### Event emission
\`\`\`typescript
// After successful operation
await emit('user.created', {
  userId: user.id,
  email: user.email,
});
\`\`\`

### Auth check
\`\`\`typescript
if (spec.policy.auth !== 'anonymous') {
  if (!context.user) {
    throw new Error('UNAUTHORIZED');
  }
}
\`\`\`
`;
      return [{ type: 'text', text }];
    },
  });
}
