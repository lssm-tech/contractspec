import { defineCommand } from '@contractspec/lib.contracts';
import { z } from 'zod';

export const initOperation = defineCommand({
  meta: {
    name: 'init',
    title: 'Initialize ContractSpec',
    description: 'Sets up ContractSpec in a project (config, VSCode settings, etc.)',
    version: '1.0.0',
    stability: 'stable',
    tags: ['cli', 'setup'],
  },
  input: z.object({
    yes: z.boolean().default(false).describe('Skip prompts, use defaults'),
    targets: z.array(z.enum(['cli', 'vscode', 'mcp', 'cursor', 'agents', 'github'])).optional().describe('Setup targets'),
    projectName: z.string().optional().describe('Project name for generated files'),
    owners: z.array(z.string()).optional().describe('Default code owners'),
    scope: z.enum(['workspace', 'package']).optional().describe('Configuration scope'),
  }),
  output: z.object({
    success: z.boolean(),
    files: z.array(z.object({
      filePath: z.string(),
      action: z.enum(['created', 'merged', 'skipped', 'error']),
      message: z.string(),
    })),
  }),
});
