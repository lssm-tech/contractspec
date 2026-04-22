import {
	Code,
	H1,
	H2,
	H3,
	P,
} from '@contractspec/lib.design-system/components/typography';

export function AdvancedSpecExperimentsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<H1 className="font-bold text-4xl">Spec Experiments</H1>
				<P className="text-lg text-muted-foreground">
					Run controlled experiments on ContractSpec operations, gradually shift
					traffic, and roll back automatically when guardrails trip.
				</P>
			</div>

			<div className="space-y-3">
				<H2 className="font-bold text-2xl">Define control + variants</H2>
				<Code className="rounded-lg border bg-muted p-4 text-sm">
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
				</Code>
			</div>

			<div className="space-y-3">
				<H2 className="font-bold text-2xl">Attach to runtime</H2>
				<Code className="rounded-lg border bg-muted p-4 text-sm">
					{`import { createSpecVariantResolver } from '@contractspec/lib.growth/spec-experiments';

adapterContext.specVariantResolver = createSpecVariantResolver({
  adapter,
  resolveUserId: (ctx) => ctx.userId ?? ctx.organizationId ?? 'anon',
});`}
				</Code>
			</div>

			<div className="space-y-3">
				<H2 className="font-bold text-2xl">Track outcomes + auto-rollback</H2>
				<Code className="rounded-lg border bg-muted p-4 text-sm">
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
				</Code>
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
						<H3 className="font-semibold text-lg">{card.title}</H3>
						<P className="text-muted-foreground text-sm">{card.description}</P>
					</div>
				))}
			</div>
		</div>
	);
}
