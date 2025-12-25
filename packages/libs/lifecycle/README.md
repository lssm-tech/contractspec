# @lssm/lib.lifecycle

Website: https://contractspec.lssm.tech/


Canonical lifecycle vocabulary for ContractSpec. This package exposes stage enums, axis types, signal contracts, milestone/action shapes, and formatting helpers used by the lifecycle modules, bundles, and Studio apps.

## Install

```bash
npm install @lssm/lib.lifecycle
```

## Usage

```ts
import {
  LifecycleStage,
  LIFECYCLE_STAGE_META,
  LifecycleAssessment,
  formatStageSummary,
} from '@lssm/lib.lifecycle';

const assessment: LifecycleAssessment = {
  stage: LifecycleStage.MvpEarlyTraction,
  confidence: 0.72,
  axes: {
    product: 'MVP',
    company: 'TinyTeam',
    capital: 'Seed',
  },
  signals: [],
  gaps: ['Retention', 'Onboarding'],
};

const summary = formatStageSummary(assessment.stage, assessment);
console.log(summary.title); // "Stage 2 · MVP & Early Traction"
```

## Contents

- `LifecycleStage` enum and metadata map (`LIFECYCLE_STAGE_META`)
- 3-axis definitions: `ProductPhase`, `CompanyPhase`, `CapitalPhase`
- Signal + metric contracts (sources, quality, payloads)
- Milestone + action data shapes
- Formatting helpers (`formatStageSummary`, `summarizeAxes`, `rankStageCandidates`)

This library intentionally ships no IO logic so it can run in browsers, Node runtimes, and design tools.*** End Patch































