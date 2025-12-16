/**
 * LLM Verify Implementation Prompt
 * 
 * Guides the agent through verifying and fixing spec violations.
 */

import { definePrompt } from '@lssm/lib.contracts';
import z from 'zod';

export function llmVerifyPrompt() {
  const input = z.object({
    specPath: z.string(),
    implementationPath: z.string(),
  });

  return definePrompt({
    meta: {
      name: 'llm.verify-implementation',
      version: 1,
      title: 'Verify implementation against spec',
      description:
        'Verify that an implementation correctly follows its ContractSpec and fix any violations.',
      tags: ['contractspec', 'llm', 'verify'],
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
        description: 'Path to the implementation file to verify',
      },
    ],
    input,
    render: async ({ specPath, implementationPath }) => {
      const text = `# Verify Implementation: ${implementationPath}

## Step 1: Run tiered verification

Run verification to check compliance:

\`\`\`
llm.verify {
  specPath: "${specPath}",
  implementationPath: "${implementationPath}",
  tier: "2"
}
\`\`\`

## Understanding verification tiers

### Tier 1: Structure (Fast)
Checks TypeScript structure:
- ✓ Handler function is exported
- ✓ Types match spec I/O schemas
- ✓ Required imports present
- ✓ No \`any\` types
- ✓ Error codes are referenced

### Tier 2: Behavior (Comprehensive)
Checks implementation coverage:
- ✓ Acceptance scenarios are likely covered
- ✓ Error cases are handled
- ✓ Events are emitted with correct conditions
- ✓ Idempotency is respected (if required)

### Tier 3: AI Review (Deep)
AI-powered semantic analysis:
- ✓ Implementation fulfills spec intent
- ✓ Edge cases considered
- ✓ Code quality assessment

## Step 2: Review the results

The verification returns:
- **passed**: Overall pass/fail
- **score**: 0-100 score
- **issues**: Array of problems found
- **suggestions**: Recommended fixes

## Step 3: Fix violations

For each issue:

1. **Severity: error** - Must fix before deployment
2. **Severity: warning** - Should fix, may affect quality
3. **Severity: info** - Nice to fix, low priority

Common fixes:

### Missing error handling
\`\`\`typescript
if (condition) {
  throw new Error('ERROR_CODE');  // Use error code from spec
}
\`\`\`

### Missing event emission
\`\`\`typescript
await eventBus.emit('event.name', { ...payload });
\`\`\`

### Missing input validation
\`\`\`typescript
const validated = inputSchema.parse(input);
\`\`\`

## Step 4: Re-verify

After fixes, run verification again to confirm:

\`\`\`
llm.verify {
  specPath: "${specPath}",
  implementationPath: "${implementationPath}",
  tier: "2"
}
\`\`\`

Target: score >= 80, passed: true
`;
      return [{ type: 'text', text }];
    },
  });
}

