// export const metadata: Metadata = {
//   title: 'Spec Experiments | ContractSpec',
//   description:
//     'Deterministic rollouts, guardrails, and automatic rollback for ContractSpec operations.',
// };

export function AdvancedSpecExperimentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Spec Experiments</h1>
        <p className="text-muted-foreground text-lg">
          Run controlled experiments on ContractSpec operations, gradually shift
          traffic, and roll back automatically when guardrails trip.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Define control + variants</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { SpecExperimentRegistry } from '@contractspec/lib.growth/spec-experiments';

const registry = new SpecExperimentRegistry().register({
  target: { name: 'billing.createInvoice', version: 4 },
  experiment: {
    key: 'billing.createInvoice.evolution',
    version: '1.0.0',
    goal: 'Reduce PO validation failures',
    primaryMetric: 'latency_ms',
    variants: [
      { id: 'control' },
      { id: 'po-required', description: 'Force PO field', weight: 1 },
    ],
  },
  control: BillingCreateInvoiceV4,
  variants: [
    { id: 'po-required', spec: BillingCreateInvoiceForAcme },
  ],
  rolloutStages: [0.01, 0.1, 0.5, 1],
  guardrails: { errorRateThreshold: 0.02, latencyP99ThresholdMs: 500 },
});`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Attach to runtime</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createSpecVariantResolver } from '@contractspec/lib.growth/spec-experiments';

adapterContext.specVariantResolver = createSpecVariantResolver({
  adapter,
  resolveUserId: (ctx) => ctx.userId ?? ctx.organizationId ?? 'anon',
});`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Track outcomes + auto-rollback</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import {
  SpecExperimentAnalyzer,
  SpecExperimentController,
} from '@contractspec/lib.growth/spec-experiments';

const analyzer = new SpecExperimentAnalyzer(tracker);
const controller = new SpecExperimentController({
  registry,
  analyzer,
  onRollback: (target, evaluation) => notifyOps(target, evaluation.reasons),
});`}
        </pre>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'Deterministic bucketing',
            description:
              'ExperimentRunner reuses the same hashing logic as growth experiments—every user sticks to a variant.',
          },
          {
            title: 'Multi-stage rollouts',
            description:
              'Use `rolloutStages` to shift 1% → 10% → 50% → 100%. Guardrails trigger rollbacks automatically.',
          },
        ].map((card) => (
          <div key={card.title} className="card-subtle space-y-2 p-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-muted-foreground text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
