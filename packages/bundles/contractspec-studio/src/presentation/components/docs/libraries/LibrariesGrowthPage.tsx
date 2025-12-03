// export const metadata: Metadata = {
//   title: 'Growth Experiments Library | ContractSpec',
//   description:
//     'Deterministic experiment registry, assignment, tracking, and stats.',
// };

export function LibrariesGrowthPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.growth</h1>
        <p className="text-muted-foreground text-lg">
          Launch experiments without third-party SDKs. Register variants, assign
          users deterministically, track exposures, and compute significance.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Register + assign</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { ExperimentRegistry, ExperimentRunner } from '@lssm/lib.growth/experiments';

const registry = new ExperimentRegistry().register({
  key: 'pricing.cta',
  version: 1,
  goal: 'Increase demo bookings',
  variants: [
    { id: 'A', weight: 1 },
    { id: 'B', weight: 1 },
  ],
  primaryMetric: 'demo_booked',
});

const runner = new ExperimentRunner();
const assignment = runner.assign(registry.get('pricing.cta')!, 'user_123');`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Track + analyze</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { ExperimentTracker } from '@lssm/lib.growth/tracker';
import { StatsEngine } from '@lssm/lib.growth/stats';

const tracker = new ExperimentTracker(new InMemoryTrackerStore());
await tracker.recordAssignment(assignment);
await tracker.recordSample({
  experimentKey: assignment.experimentKey,
  variantId: assignment.variantId,
  metric: 'demo_booked',
  value: 1,
  timestamp: new Date(),
});

const stats = new StatsEngine().summarize(
  await tracker.getSamples(assignment.experimentKey, 'demo_booked'),
  'demo_booked'
);`}
        </pre>
      </div>
    </div>
  );
}
