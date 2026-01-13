import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesSLOPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">SLO Library</h1>
        <p className="text-muted-foreground text-lg">
          <code>@contractspec/lib.slo</code> keeps service level objectives
          front and center—declarative definitions, rolling snapshots, burn-rate
          math, and automated incidents.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.slo" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Define Targets</h2>
        <CodeBlock
          language="typescript"
          code={`const definition: SLODefinition = {
  id: 'billing.createInvoice.availability',
  targetAvailability: 0.999,
  latencyP99TargetMs: 500,
  rollingWindowMs: 7 * 24 * 60 * 60 * 1000,
  alerts: { fastBurnThreshold: 14, slowBurnThreshold: 6 },
};`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Monitor Burn Rate</h2>
        <CodeBlock
          language="typescript"
          code={`const monitor = new SLOMonitor({ definition, incidentManager });
const { snapshot, burnRate } = monitor.recordWindow({
  good: 12500,
  bad: 3,
  latencyP99: 420,
  latencyP95: 210,
});`}
        />
        <p className="text-muted-foreground text-sm">
          When burn rate exceeds the configured thresholds the monitor calls
          your
          <code>IncidentManager</code>, providing the snapshot that triggered
          the alert.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">History & Reporting</h2>
        <p className="text-muted-foreground text-sm">
          `SLOTracker.getHistory()` returns the latest snapshots so dashboards
          can show trends without hitting a warehouse. Prisma models persist
          everything for long-term audits.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/cost-tracking" className="btn-primary">
          Next: Cost Tracking <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
