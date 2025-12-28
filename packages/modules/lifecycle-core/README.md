# @contractspec/module.lifecycle-core

Website: https://contractspec.io/


Signal collection + scoring module for ContractSpec lifecycle assessments. It wraps analytics/questionnaire adapters, applies weighting logic, and produces normalized `LifecycleAssessment` objects.

## Features

- Adapter-driven signal collector (analytics, questionnaires, intent logs)
- Configurable stage scoring weights
- Milestone planner backed by JSON catalog
- Lifecycle orchestrator that returns assessments + scorecards

## Usage

```ts
import {
  LifecycleOrchestrator,
  StageSignalCollector,
  StageScorer,
  LifecycleMilestonePlanner,
} from '@contractspec/module.lifecycle-core';

const collector = new StageSignalCollector({
  analyticsAdapter,
  questionnaireAdapter,
});

const scorer = new StageScorer();
const planner = new LifecycleMilestonePlanner();

const orchestrator = new LifecycleOrchestrator({
  collector,
  scorer,
  planner,
});

const assessment = await orchestrator.run({
  questionnaireAnswers: answers,
});

console.log(assessment.stage, assessment.confidence);
```

Adapters are interfaces—you can implement them inside bundles, Studio services, or examples without touching this module.*** End Patch































