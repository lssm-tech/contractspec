export function AdvancedWorkflowMonitoringPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflow Monitoring</h1>
        <p className="text-muted-foreground text-lg">
          Production workflows need robust observability. ContractSpec provides
          SLA monitoring, distributed tracing, and audit logging out of the box.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">SLA Monitoring</h2>
        <p>
          Use the <code>SLAMonitor</code> to detect when workflows or individual
          steps exceed their budgeted duration.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { SLAMonitor } from '@contractspec/lib.contracts/workflow/sla-monitor';

const monitor = new SLAMonitor((event, payload) => {
  if (event === 'workflow.sla_breach') {
    console.error('SLA Breach!', payload);
    // Send to PagerDuty / Slack
  }
});

// Check periodically
monitor.check(currentState, workflowSpec);`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Telemetry & Tracing</h2>
        <p>Workflows automatically generate OpenTelemetry spans for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Overall workflow execution</li>
          <li>Individual steps</li>
          <li>Retries and compensation</li>
        </ul>
        <p>
          Configure your OpenTelemetry exporter to send traces to Jaeger,
          Datadog, or Honeycomb.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dashboarding</h2>
        <p>
          You can build a custom dashboard using <code>DataViews</code> over
          your workflow state database. See the DataViews tutorial for how to
          visualize <code>WorkflowState</code> records.
        </p>
      </div>
    </div>
  );
}
