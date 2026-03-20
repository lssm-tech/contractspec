// export const metadata: Metadata = {
//   title: 'Auto-Evolution Runbook | ContractSpec',
//   description:
//     'Operate the telemetry → intent → spec pipeline with guardrails and approvals.',
// };

export function OpsAutoEvolutionPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Auto-Evolution Runbook</h1>
				<p className="text-lg text-muted-foreground">
					Configure sampling, approvals, experiments, and golden tests so your
					app keeps improving without regressions.
				</p>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Pipeline overview</h2>
				<ol className="list-decimal space-y-2 pl-6 text-muted-foreground text-sm">
					<li>
						Tracing middleware emits telemetry samples with tenant/user context.
					</li>
					<li>IntentAggregator batches samples (15m window, configurable).</li>
					<li>IntentDetector raises error/latency/throughput signals.</li>
					<li>SpecGenerator produces proposals with confidence scores.</li>
					<li>ApprovalWorkflow routes low-confidence suggestions to humans.</li>
					<li>
						SpecExperimentRegistry rolls out approved variants using guardrails.
					</li>
					<li>
						TrafficRecorder captures new traffic and GoldenTestGenerator outputs
						suites.
					</li>
				</ol>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Key environment variables</h2>
				<pre className="rounded-lg border bg-muted p-4 text-sm">
					{`# Telemetry sampling
AUTO_EVOLUTION_SAMPLE_RATE=0.02
AUTO_EVOLUTION_WINDOW_MS=900000

# Suggestion thresholds
AUTO_EVOLUTION_MIN_CONFIDENCE=0.55
AUTO_EVOLUTION_AUTO_APPROVE=0.2

# Guardrails (fallback defaults)
AUTO_EVOLUTION_MAX_ERROR_RATE=0.02
AUTO_EVOLUTION_MAX_P99_MS=500`}
				</pre>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Operations checklist</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground text-sm">
					<li>
						Review new `SpecSuggestion` records every morning (UI coming soon;
						Prisma view today).
					</li>
					<li>Keep at least one reviewer per domain on-call for approvals.</li>
					<li>
						Attach `SpecExperimentAdapter.trackOutcome` to every runtime
						adapter.
					</li>
					<li>
						Schedule `contractspec test generate` nightly (or on deploy) to
						refresh golden suites.
					</li>
					<li>
						Feed `runGoldenTests` into CI to gate merges touching evolved specs.
					</li>
				</ul>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{[
					{
						title: 'Sampling',
						description:
							'Start at 1–2% of traffic. Increase only after sanitization is verified.',
					},
					{
						title: 'Approvals',
						description:
							'High-risk ops (money, compliance) should never auto-approve. Use ApprovalWorkflow notes for audit.',
					},
					{
						title: 'On-call alerts',
						description:
							'Tie SpecExperimentController rollbacks into PagerDuty/Slack so engineers see guardrail trips immediately.',
					},
				].map((card) => (
					<div key={card.title} className="card-subtle space-y-2 p-4">
						<h3 className="font-semibold text-lg">{card.title}</h3>
						<p className="text-muted-foreground text-sm">{card.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
