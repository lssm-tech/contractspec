# @lssm/module.lifecycle-advisor

Guidance layer for the ContractSpec lifecycle engine. Converts assessments into recommended actions, library adoption plans, and ceremony payloads.

## Exports

- `LifecycleRecommendationEngine`
- `ContractSpecLibraryRecommender`
- `LifecycleCeremonyDesigner`

## Example

```ts
import {
  LifecycleRecommendationEngine,
  ContractSpecLibraryRecommender,
  LifecycleCeremonyDesigner,
} from '@lssm/module.lifecycle-advisor';

const recommendationEngine = new LifecycleRecommendationEngine();
const libraryRecommender = new ContractSpecLibraryRecommender();
const ceremonyDesigner = new LifecycleCeremonyDesigner();

const recommendations = recommendationEngine.generate(assessment);
const libraries = libraryRecommender.recommend(assessment.stage);
const ceremony = ceremonyDesigner.design(assessment.stage);
```

Data is stored in JSON playbooks so ContractSpec teams can update copy or mappings without redeploying code.*** End Patch





