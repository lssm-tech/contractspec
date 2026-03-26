/**
 * Impact detection service module.
 */
import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';

export const ImpactDetectionOverviewDocBlock = {
	id: 'feature.impact-detection.overview',
	title: 'Contract Impact Detection',
	kind: 'goal',
	visibility: 'public',
	route: '/docs/features/impact-detection',
	body: `
# Contract Impact Detection

Automated detection and classification of breaking changes in ContractSpec APIs.

## Features

- **Snapshot Generation**: Creates canonical, deterministic representations of contracts
- **Deep Diff Engine**: Field-level comparison of input/output schemas
- **Breaking Change Classification**: Automatic classification using 16 rules
- **Multiple Output Formats**: JSON, Markdown, Text, GitHub Check Run
- **GitHub Integration**: PR comments and check runs
- **CLI Tool**: \`contractspec impact\` command

## Quick Start

### CLI Usage

\`\`\`bash
# Basic usage
contractspec impact

# Compare against specific baseline
contractspec impact --baseline origin/main

# Get JSON output
contractspec impact --format json
\`\`\`

### GitHub Action

\`\`\`yaml
- uses: lssm-tech/contractspec-action@v1
  with:
    mode: impact
    pr-comment: true
    fail-on-breaking: true
\`\`\`

## Architecture

The system consists of three layers:

1. **Analysis Modules** (module package): Snapshot, Deep Diff, Classifier
2. **Impact Service** (bundle package): Orchestration + Formatters
3. **Integrations**: CLI command + GitHub Action
  `,
	tags: ['impact-detection', 'breaking-changes', 'ci-cd'],
} satisfies DocBlock;

export {
	formatCheckRun,
	formatJson,
	formatMinimalComment,
	formatPrComment,
} from './formatters';
export { detectImpact } from './impact-detection-service';
export * from './types';
