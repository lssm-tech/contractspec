# @lssm/lib.evolution

Website: https://contractspec.lssm.tech/


**Safe regeneration for ContractSpec** — Evolve specs automatically while preserving invariants.

Auto-evolution utilities that analyze telemetry, suggest spec improvements, and route changes through approval workflows. Regenerate code safely, one module at a time.

## Capabilities:

- Analyze telemetry to find anomalous specs
- Convert detected intent into spec suggestions
- Route suggestions through the AI approval workflow
- Persist approved specs back into the codebase

> Phase 3 anchor library – pairs with `@lssm/lib.observability` and `@lssm/lib.growth`.

## Usage

```ts
import {
  SpecAnalyzer,
  SpecGenerator,
  SpecSuggestionOrchestrator,
} from '@lssm/lib.evolution';

const analyzer = new SpecAnalyzer();
const stats = analyzer.analyzeSpecUsage(samples);
const anomalies = analyzer.detectAnomalies(stats);

const generator = new SpecGenerator({ getSpec });
const suggestion = generator.generateFromIntent(anomalies[0]);

await orchestrator.submit(suggestion, { agent: 'auto-evolve' });
```

See `app/docs/libraries/evolution` in `@lssm/app.web-contractspec-landing` for full docs.















