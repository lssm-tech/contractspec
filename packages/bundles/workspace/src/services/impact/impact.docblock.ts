/**
 * DocBlock for Contract Impact Detection feature.
 *
 * Colocated documentation following the DocBlock pattern.
 */

import type { DocBlock } from '@contractspec/lib.contracts/docs/types';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs/registry';

export const ImpactDetectionOverviewDoc: DocBlock = {
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
};

export const ImpactDetectionRulesDoc: DocBlock = {
  id: 'feature.impact-detection.rules',
  title: 'Breaking Change Classification Rules',
  kind: 'reference',
  visibility: 'public',
  route: '/docs/features/impact-detection/rules',
  body: `
# Breaking Change Classification Rules

## 🔴 Breaking Changes (10 rules)

1. **endpoint-removed**: Endpoint/operation was removed
2. **method-changed**: HTTP method was changed
3. **path-changed**: HTTP path was changed
4. **field-removed**: Response field was removed
5. **field-type-changed**: Field type was changed
6. **field-made-required**: Optional field became required
7. **enum-value-removed**: Enum value was removed
8. **nullable-removed**: Field is no longer nullable
9. **required-field-added-to-input**: Required field was added to input
10. **event-payload-field-removed**: Event payload field was removed

## 🟡 Non-Breaking Changes (4 rules)

1. **optional-field-added**: Optional field was added
2. **endpoint-added**: New endpoint/operation was added
3. **enum-value-added**: Enum value was added
4. **field-made-optional**: Required field became optional

## 🔵 Info-Level Changes (4 rules)

1. **stability-changed**: Stability level was changed
2. **description-changed**: Description was changed
3. **owners-changed**: Owners were changed
4. **tags-changed**: Tags were changed

## Rule Evaluation

Rules are evaluated in order (breaking → non-breaking → info). The first matching rule determines the severity.
  `,
  tags: ['impact-detection', 'breaking-changes', 'rules'],
};

export const ImpactDetectionUsageDoc: DocBlock = {
  id: 'cli.impact',
  title: 'contractspec impact Command',
  kind: 'usage',
  visibility: 'public',
  route: '/docs/cli/impact',
  body: `
# contractspec impact

Detect breaking and non-breaking contract changes.

## Usage

\`\`\`bash
contractspec impact [options]
\`\`\`

## Options

- \`-b, --baseline <ref>\` - Git ref to compare against (branch, tag, commit)
- \`-f, --format <format>\` - Output format: text, json, markdown, check-run (default: text)
- \`--fail-on-breaking\` - Exit with error code if breaking changes detected
- \`-p, --pattern <glob>\` - Glob pattern for spec discovery
- \`-q, --quiet\` - Minimal output

## Examples

\`\`\`bash
# Compare against main branch
contractspec impact --baseline origin/main

# Get JSON output for CI integration
contractspec impact --format json > impact.json

# Fail build on breaking changes
contractspec impact --fail-on-breaking

# Custom spec pattern
contractspec impact --pattern "src/**/*.operation.ts"
\`\`\`

## Output Formats

### Text (default)
Human-readable console output with icons and summary.

### JSON
Machine-readable JSON with full impact result including deltas, summaries, and metadata.

### Markdown
GitHub-flavored markdown suitable for PR comments.

### Check Run
GitHub Check Run payload format for API integration.

## Exit Codes

- \`0\` - Success (no breaking changes, or breaking changes allowed)
- \`1\` - Failure (breaking changes detected with --fail-on-breaking, or error)
  `,
  tags: ['cli', 'impact-detection'],
};

registerDocBlocks([
  ImpactDetectionOverviewDoc,
  ImpactDetectionRulesDoc,
  ImpactDetectionUsageDoc,
]);
