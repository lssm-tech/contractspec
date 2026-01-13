/**
 * Built-in workflow definitions.
 *
 * These workflows are available by default in all ContractSpec projects.
 */

import type { Workflow } from './types';

export const builtinWorkflows: Workflow[] = [
  {
    id: 'brownfield.openapi-import',
    name: 'Brownfield: OpenAPI Import',
    description: 'Import OpenAPI into draft contracts, review, and apply.',
    steps: [
      {
        id: 'extract',
        label: 'Extract Drafts',
        command:
          'contractspec extract --from openapi --out .contractspec/work/openapi-import',
      },
      {
        id: 'review',
        label: 'Review Drafts',
        manualCheckpoint: true,
        manualMessage:
          'Drafts extracted to .contractspec/work/openapi-import.\nPlease review them and move selected files to contracts/ directory.\nContinue when done.',
      },
      {
        id: 'gap',
        label: 'Analyze Gaps',
        command: 'contractspec gap',
      },
      {
        id: 'apply',
        label: 'Apply Changes (Generate)',
        command: 'contractspec apply',
      },
      {
        id: 'impact',
        label: 'Check Impact',
        command: 'contractspec impact',
      },
      {
        id: 'ci',
        label: 'Run CI Checks',
        command: 'contractspec ci',
      },
      {
        id: 'clean',
        label: 'Clean Scaffolding',
        command: 'contractspec clean --work',
      },
    ],
  },
  {
    id: 'change.feature',
    name: 'Change: Feature Development',
    description: 'Routine workflow for contract edits.',
    steps: [
      {
        id: 'impact',
        label: 'Check Impact',
        command: 'contractspec impact',
      },
      {
        id: 'apply',
        label: 'Apply Changes',
        command: 'contractspec apply',
      },
      {
        id: 'ci',
        label: 'Run CI Checks',
        command: 'contractspec ci',
      },
    ],
  },
  {
    id: 'release',
    name: 'Release: Version & Publish',
    description: 'Prepare and publish a new contract version.',
    steps: [
      {
        id: 'impact',
        label: 'Verify Impact',
        command: 'contractspec impact',
      },
      {
        id: 'ci',
        label: 'CI Check',
        command: 'contractspec ci --fail-on-warnings',
      },
      {
        id: 'bump',
        label: 'Bump Version',
        command: 'contractspec version bump',
        manualCheckpoint: true,
        manualMessage: 'Review version bump. Continue to publish?',
      },
      {
        id: 'changelog',
        label: 'Generate Changelog',
        command: 'contractspec changelog',
      },
      {
        id: 'publish',
        label: 'Publish to Registry',
        command: 'echo "Publishing..." && contractspec registry publish',
        tracks: ['product', 'regulated'],
      },
    ],
  },
  {
    id: 'migration',
    name: 'Migration: Upgrades',
    description: 'Run migration scripts and verify integrity.',
    steps: [
      {
        id: 'upgrade',
        label: 'Upgrade Dependencies',
        command: 'contractspec upgrade',
      },
      {
        id: 'regenerate',
        label: 'Regenerate Artifacts',
        command: 'contractspec apply',
      },
      {
        id: 'verify',
        label: 'Verify Integrity',
        command: 'contractspec ci',
      },
    ],
  },
];
