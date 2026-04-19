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
		description:
			'Import OpenAPI into draft contracts, review, and generate artifacts.',
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
				id: 'generate',
				label: 'Generate Artifacts',
				command: 'contractspec generate',
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
				id: 'generate',
				label: 'Generate Artifacts',
				command: 'contractspec generate',
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
				id: 'release',
				label: 'Prepare Release',
				command: 'contractspec release prepare',
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
				id: 'generate',
				label: 'Regenerate Artifacts',
				command: 'contractspec generate',
			},
			{
				id: 'verify',
				label: 'Verify Integrity',
				command: 'contractspec ci',
			},
		],
	},
];
