
import { 
    createNodeAdapters, 
    extractContracts, 
    analyzeGap, 
    generateArtifacts,
    // analyzeImpact, // Check if exported
    // runCiChecks, // Check if exported
} from '@contractspec/bundle.workspace';
import { resolve, join } from 'node:path';
import type { Workflow, WorkflowContext } from './types';
import chalk from 'chalk';

// We import these just to typescript check or we can shell out.
// For P0 reliability and simplicity, given the time, I will use SHELL OUT for complex commands 
// that have heavy CLI logic (like CI printing many things).
// But for extract/generate which return results, I can use them.

// However, to keep it simple and consistent:
// I will use shell commands where possible to allow "dry-run" to show exact commands.
// If I use internal functions, dry-run only shows "Internal execution".
// The plan says: "If not feasible, shell out...".
// Shelling out is easier to visualize for the user in dry-run.

export const workflows: Workflow[] = [
  {
    id: 'brownfield.openapi-import',
    name: 'Brownfield: OpenAPI Import',
    description: 'Import OpenAPI into draft contracts, review, and apply.',
    steps: [
      {
        id: 'extract',
        label: 'Extract Drafts',
        command: 'contractspec extract --from openapi --out .contractspec/work/openapi-import',
        // We can optimize this by checking if user config has openapi source
      },
      {
        id: 'review',
        label: 'Review Drafts',
        manualCheckpoint: true,
        manualMessage: `Drafts extracted to .contractspec/work/openapi-import.\nPlease review them and move selected files to contracts/ directory.\nContinue when done.`,
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
        // track: run on all by default
      }
    ]
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
      }
    ]
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
          command: 'contractspec version bump', // Assuming version bump command exists or similar
          manualCheckpoint: true,
          manualMessage: 'Review version bump. Continue to publish?'
      },
      {
          id: 'changelog',
          label: 'Generate Changelog',
          command: 'contractspec changelog', 
      },
      {
          id: 'publish', // Placeholder for actual publish
          label: 'Publish to Registry',
          command: 'echo "Publishing..." && contractspec registry publish',
          tracks: ['product', 'regulated'] 
      }
    ]
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
          }
      ]
  }
];

export function getWorkflow(id: string): Workflow | undefined {
    return workflows.find(w => w.id === id);
}
