import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesGrowthPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.growth</h1>
        <p className="text-muted-foreground text-lg">
          Launch experiments without third-party SDKs. Register variants, assign
          users deterministically, track exposures, and compute significance.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.growth" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Register + assign</h2>
        <CodeBlock
          language="typescript"
          code={`import { ExperimentRegistry, ExperimentRunner } from '@contractspec/lib.growth/experiments';

const registry = new ExperimentRegistry().register({
  key: 'pricing.cta',
  version: '1.0.0',
  goal: 'Increase demo bookings',
  variants: [
    { id: 'A', weight: 1 },
    { id: 'B', weight: 1 },
  ],
  primaryMetric: 'demo_booked',
});

const runner = new ExperimentRunner();
const assignment = runner.assign(registry.get('pricing.cta')!, 'user_123');`}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Track + analyze</h2>
        <CodeBlock
          language="typescript"
          code={`import { ExperimentTracker } from '@contractspec/lib.growth/tracker';
import { StatsEngine } from '@contractspec/lib.growth/stats';

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
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/analytics" className="btn-primary">
          Next: Analytics <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
