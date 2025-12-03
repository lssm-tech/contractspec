// export const metadata: Metadata = {
//   title: 'SLO Library',
//   description:
//     'Define and monitor availability + latency targets with burn-rate alerts.',
// };

export function LibrariesSLOPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">SLO Library</h1>
        <p className="text-muted-foreground text-lg">
          <code>@lssm/lib.slo</code> keeps service level objectives front and
          center—declarative definitions, rolling snapshots, burn-rate math, and
          automated incidents.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Define Targets</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const definition: SLODefinition = {
  id: 'billing.createInvoice.availability',
  targetAvailability: 0.999,
  latencyP99TargetMs: 500,
  rollingWindowMs: 7 * 24 * 60 * 60 * 1000,
  alerts: { fastBurnThreshold: 14, slowBurnThreshold: 6 },
};`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Monitor Burn Rate</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const monitor = new SLOMonitor({ definition, incidentManager });
const { snapshot, burnRate } = monitor.recordWindow({
  good: 12500,
  bad: 3,
  latencyP99: 420,
  latencyP95: 210,
});`}
        </pre>
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
    </div>
  );
}
