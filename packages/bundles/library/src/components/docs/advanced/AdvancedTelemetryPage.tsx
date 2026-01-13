import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function AdvancedTelemetryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Telemetry</h1>
        <p className="text-muted-foreground">
          A <strong>TelemetrySpec</strong> defines what metrics, logs, and
          traces to collect for observability. ContractSpec automatically
          instruments your application based on these specs, ensuring you have
          the visibility you need to monitor, debug, and optimize your system.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why telemetry matters</h2>
        <p className="text-muted-foreground">
          You can't fix what you can't see. Telemetry provides visibility into
          how your application is performing, where errors are occurring, and
          how users are interacting with your system. Without proper
          instrumentation, you're flying blind in production.
        </p>
        <p className="text-muted-foreground">
          ContractSpec takes a spec-first approach to telemetry: you declare
          what you want to observe, and runtime adapters instrument operations
          automatically. This ensures consistent, comprehensive coverage without
          manual effort.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Three pillars of observability</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Metrics</h3>
            <p className="text-muted-foreground">
              Numerical measurements collected over time. Examples: request
              count, error rate, latency percentiles, active users, queue depth.
              Metrics are cheap to collect and store, making them ideal for
              high-level monitoring and alerting.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Logs</h3>
            <p className="text-muted-foreground">
              Timestamped text records of events. Examples: "User 123 logged
              in", "Payment failed for order 456", "Database connection pool
              exhausted". Logs provide detailed context for debugging specific
              issues.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Traces</h3>
            <p className="text-muted-foreground">
              Records of requests as they flow through your system. A trace
              shows the complete path of a request—which services it touched,
              how long each step took, and where errors occurred. Traces are
              essential for debugging distributed systems.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example TelemetrySpec</h2>
        <p className="text-muted-foreground">
          Here's how telemetry is configured in TypeScript:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineTelemetry } from '@contractspec/lib.contracts';

export const OrderProcessingTelemetry = defineTelemetry({
  meta: {
    key: 'order.processing.observability',
    version: '1.0.0',
  },
  metrics: [
    {
      name: 'orders_created_total',
      type: 'counter',
      description: 'Total number of orders created',
      labels: ['status', 'payment_method'],
    },
    {
      name: 'order_processing_duration_seconds',
      type: 'histogram',
      description: 'Time to process an order',
      buckets: [0.1, 0.5, 1.0, 2.0, 5.0, 10.0],
      labels: ['status'],
    },
  ],
  traces: [
    {
      operation: 'createOrder',
      sampleRate: 1.0, // Trace 100% of requests
      includeInputs: true,
      includeOutputs: true,
      redactFields: ['creditCard', 'ssn'],
    },
    {
      operation: 'processPayment',
      sampleRate: 0.1, // Trace 10% of requests
      includeInputs: false, // Don't log payment details
    },
  ],
  alerts: [
    {
      name: 'high-error-rate',
      condition: 'error_rate > 0.05',
      duration: '5m',
      severity: 'critical',
      notify: ['pagerduty', 'slack'],
    },
  ],
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Automatic instrumentation</h2>
        <p className="text-muted-foreground">
          ContractSpec automatically instruments:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>All operations</strong> – Request count, latency, error rate
            per Command/Query
          </li>
          <li>
            <strong>All workflows</strong> – Step execution time, retry counts,
            compensation events
          </li>
          <li>
            <strong>All data views</strong> – Query execution time, result set
            size
          </li>
          <li>
            <strong>All policy decisions</strong> – Decision time, permit/deny
            ratio
          </li>
          <li>
            <strong>System resources</strong> – CPU, memory, disk, network usage
          </li>
        </ul>
        <p className="text-muted-foreground">
          You don't need to add instrumentation code manually—the runtime
          handles it based on your specs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Integration with observability platforms
        </h2>
        <p className="text-muted-foreground">
          ContractSpec supports multiple observability backends:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Prometheus</strong> – For metrics collection and alerting
          </li>
          <li>
            <strong>Grafana</strong> – For dashboards and visualization
          </li>
          <li>
            <strong>Jaeger / Tempo</strong> – For distributed tracing
          </li>
          <li>
            <strong>Loki</strong> – For log aggregation
          </li>
          <li>
            <strong>Datadog</strong> – All-in-one observability platform
          </li>
          <li>
            <strong>New Relic</strong> – Application performance monitoring
          </li>
          <li>
            <strong>Honeycomb</strong> – Observability for complex systems
          </li>
        </ul>
        <p className="text-muted-foreground">
          You can configure multiple backends and send telemetry to all of them
          simultaneously.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sampling and performance</h2>
        <p className="text-muted-foreground">
          Collecting telemetry has a cost—CPU, memory, network bandwidth, and
          storage. ContractSpec provides several mechanisms to control overhead:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Sampling</strong> – Trace only a percentage of requests
            (e.g., 10%)
          </li>
          <li>
            <strong>Adaptive sampling</strong> – Automatically reduce sampling
            rate under high load
          </li>
          <li>
            <strong>Tail-based sampling</strong> – Keep traces for failed
            requests, sample successful ones
          </li>
          <li>
            <strong>Field redaction</strong> – Remove sensitive data from traces
            and logs
          </li>
          <li>
            <strong>Aggregation</strong> – Pre-aggregate metrics before sending
            to reduce network traffic
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Start with high-level metrics (request rate, error rate, latency)
            and add more detailed instrumentation as needed.
          </li>
          <li>
            Use structured logging—log events with structured fields, not
            free-form text.
          </li>
          <li>
            Set up alerts for critical metrics so you're notified when things go
            wrong.
          </li>
          <li>
            Use traces to debug complex issues—they show the complete picture of
            a request.
          </li>
          <li>
            Redact sensitive data from logs and traces to comply with privacy
            regulations.
          </li>
          <li>
            Review dashboards regularly to understand normal behavior—this makes
            anomalies easier to spot.
          </li>
          <li>
            Use sampling to control costs, but always trace errors and slow
            requests.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/advanced/mcp" className="btn-ghost">
          Previous: MCP Adapters
        </Link>
        <Link href="/docs/comparison" className="btn-primary">
          Next: Comparison <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
