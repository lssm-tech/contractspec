// ---------------------------------------------------------------------------
// Sample CLI Tutorials for Terminal Demo Video Generation
// ---------------------------------------------------------------------------

import type { TerminalLine } from '@contractspec/lib.video-gen/compositions/primitives/terminal';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

/**
 * A CLI tutorial definition combining terminal lines with a content brief
 * for narration generation.
 */
export interface CliTutorial {
  /** Tutorial identifier */
  id: string;
  /** Display title for the scene */
  title: string;
  /** Subtitle shown below the title */
  subtitle?: string;
  /** Terminal window title */
  terminalTitle: string;
  /** Terminal lines (commands + output) */
  lines: TerminalLine[];
  /** Summary text shown after the terminal completes */
  summary?: string;
  /** Content brief used for narration generation */
  brief: ContentBrief;
}

// -- Init Tutorial ----------------------------------------------------------

/**
 * Tutorial: Initialize a new ContractSpec project.
 */
export const initTutorial: CliTutorial = {
  id: 'init',
  title: 'Initialize a Project',
  subtitle: 'Set up a new ContractSpec workspace in seconds',
  terminalTitle: '~/projects',
  lines: [
    { text: 'contractspec init my-api', type: 'command' },
    { text: 'Creating project my-api...', type: 'output', delay: 15 },
    { text: '  ├── contracts/', type: 'output', delay: 5 },
    { text: '  ├── generated/', type: 'output', delay: 5 },
    { text: '  ├── contractspec.config.ts', type: 'output', delay: 5 },
    { text: '  └── package.json', type: 'output', delay: 5 },
    { text: '✓ Project initialized', type: 'success', delay: 10 },
    { text: 'cd my-api', type: 'command', delay: 15 },
    { text: 'contractspec status', type: 'command', delay: 15 },
    {
      text: '0 contracts · 0 generated files · ready',
      type: 'output',
      delay: 10,
    },
  ],
  summary: 'Your project is ready. Define contracts next.',
  brief: {
    title: 'Initialize a ContractSpec Project',
    summary:
      'The init command scaffolds a new workspace with contracts, generated output, and configuration.',
    problems: [
      'Setting up API projects manually is tedious and error-prone',
      'Teams need a consistent project structure from day one',
    ],
    solutions: [
      'One command creates the entire project scaffold',
      'Standard structure ensures consistency across teams',
    ],
    audience: {
      role: 'Developer',
      painPoints: ['Manual project setup', 'Inconsistent project structure'],
    },
    callToAction: 'Run contractspec init to get started.',
  },
};

// -- Build Tutorial ---------------------------------------------------------

/**
 * Tutorial: Build and generate code from contracts.
 */
export const buildTutorial: CliTutorial = {
  id: 'build',
  title: 'Build from Contracts',
  subtitle: 'Generate all surfaces from a single spec',
  terminalTitle: '~/projects/my-api',
  lines: [
    { text: '# Define a contract first', type: 'comment' },
    { text: 'contractspec build', type: 'command', delay: 15 },
    { text: 'Building 3 contracts...', type: 'output', delay: 15 },
    { text: '  → CreateUser   REST + GraphQL + DB', type: 'output', delay: 8 },
    { text: '  → ListUsers    REST + GraphQL', type: 'output', delay: 8 },
    { text: '  → DeleteUser   REST + GraphQL + DB', type: 'output', delay: 8 },
    { text: '✓ 18 files generated in 0.4s', type: 'success', delay: 12 },
    { text: 'contractspec status', type: 'command', delay: 15 },
    {
      text: '3 contracts · 18 generated files · all up to date',
      type: 'output',
      delay: 10,
    },
  ],
  summary: '3 contracts → 18 files. One spec, every surface.',
  brief: {
    title: 'Build from Contracts',
    summary:
      'The build command reads your contract definitions and generates REST, GraphQL, DB schemas, and more.',
    problems: [
      'Manually writing the same logic across REST, GraphQL, and DB',
      'Generated code drifts out of sync with the spec',
    ],
    solutions: [
      'Deterministic build: same spec always produces the same output',
      'All surfaces generated in a single pass',
    ],
    metrics: [
      '18 files from 3 contracts in 0.4 seconds',
      'Zero manual synchronization',
    ],
    audience: {
      role: 'Developer',
      painPoints: ['Cross-surface code duplication', 'Schema drift'],
    },
    callToAction: 'Run contractspec build after defining your contracts.',
  },
};

// -- Validate Tutorial ------------------------------------------------------

/**
 * Tutorial: Validate contracts before building.
 */
export const validateTutorial: CliTutorial = {
  id: 'validate',
  title: 'Validate Contracts',
  subtitle: 'Catch errors before they reach production',
  terminalTitle: '~/projects/my-api',
  lines: [
    { text: 'contractspec validate', type: 'command' },
    { text: 'Validating 3 contracts...', type: 'output', delay: 15 },
    { text: '  ✓ CreateUser   schema valid', type: 'success', delay: 8 },
    { text: '  ✓ ListUsers    schema valid', type: 'success', delay: 8 },
    {
      text: '  ✗ DeleteUser   missing required field "reason"',
      type: 'error',
      delay: 8,
    },
    { text: '', type: 'output', delay: 5 },
    { text: '2 passed · 1 failed', type: 'output', delay: 10 },
    { text: '# Fix the contract and re-validate', type: 'comment', delay: 15 },
    { text: 'contractspec validate', type: 'command', delay: 15 },
    { text: '  ✓ CreateUser   schema valid', type: 'success', delay: 8 },
    { text: '  ✓ ListUsers    schema valid', type: 'success', delay: 8 },
    { text: '  ✓ DeleteUser   schema valid', type: 'success', delay: 8 },
    { text: '✓ All 3 contracts valid', type: 'success', delay: 10 },
  ],
  summary: 'Validate early, validate often.',
  brief: {
    title: 'Validate Contracts',
    summary:
      'The validate command checks all contracts against their schemas before generating code.',
    problems: [
      'Invalid schemas slip through to production',
      'Catching errors late in the pipeline costs time',
    ],
    solutions: [
      'Pre-build validation catches schema errors instantly',
      'Clear error messages pinpoint exactly what needs fixing',
    ],
    audience: {
      role: 'Developer',
      painPoints: ['Invalid schemas in production', 'Late error detection'],
    },
    callToAction: 'Run contractspec validate as part of your CI pipeline.',
  },
};

// -- Deploy Tutorial --------------------------------------------------------

/**
 * Tutorial: Deploy generated artifacts.
 */
export const deployTutorial: CliTutorial = {
  id: 'deploy',
  title: 'Deploy Artifacts',
  subtitle: 'Ship generated code to production',
  terminalTitle: '~/projects/my-api',
  lines: [
    { text: 'contractspec build --production', type: 'command' },
    {
      text: '✓ 18 files generated (production mode)',
      type: 'success',
      delay: 15,
    },
    { text: 'contractspec publish --dry-run', type: 'command', delay: 15 },
    {
      text: 'Publishing @my-api/contracts v1.2.0...',
      type: 'output',
      delay: 12,
    },
    { text: '  → npm pack (dry run)', type: 'output', delay: 8 },
    { text: '  → 3 contracts, 18 generated files', type: 'output', delay: 8 },
    { text: '  → Package size: 24.3 KB', type: 'output', delay: 8 },
    {
      text: '✓ Dry run complete -- ready to publish',
      type: 'success',
      delay: 10,
    },
    { text: 'contractspec publish', type: 'command', delay: 15 },
    { text: '✓ Published @my-api/contracts@1.2.0', type: 'success', delay: 15 },
  ],
  summary: 'From spec to production in one pipeline.',
  brief: {
    title: 'Deploy Artifacts',
    summary:
      'Build in production mode and publish your generated contracts as an npm package.',
    problems: [
      'Deploying hand-written API code is risky and manual',
      'Teams need confidence that generated code matches the spec',
    ],
    solutions: [
      'Production builds are deterministic and reproducible',
      'Dry-run publishing catches packaging issues before release',
    ],
    metrics: [
      '24.3 KB package with 3 contracts and 18 files',
      'Entire pipeline runs in seconds',
    ],
    audience: {
      role: 'DevOps Engineer',
      painPoints: ['Manual deployment processes', 'Spec-to-production drift'],
    },
    callToAction: 'Add contractspec publish to your CI/CD pipeline.',
  },
};

/** All sample tutorials in recommended presentation order. */
export const allTutorials: CliTutorial[] = [
  initTutorial,
  buildTutorial,
  validateTutorial,
  deployTutorial,
];
