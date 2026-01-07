import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesObservabilityPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Observability Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.observability</code> library provides a
          thin wrapper around OpenTelemetry to simplify instrumentation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.observability" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tracing</h2>
        <CodeBlock
          language="typescript"
          code={`import { traceAsync, traceSync } from '@contractspec/lib.observability/tracing';

await traceAsync('process_order', async (span) => {
  span.setAttribute('order_id', order.id);
  await db.save(order);
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Metrics</h2>
        <CodeBlock
          language="typescript"
          code={`import { createCounter, createHistogram } from '@contractspec/lib.observability/metrics';

const ordersCounter = createCounter('orders_total');
const latencyHistogram = createHistogram('request_duration_seconds');

ordersCounter.add(1, { status: 'success' });
latencyHistogram.record(0.123);`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Middleware</h2>
        <p className="text-muted-foreground">
          Automatically instrument your HTTP handlers:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { createTracingMiddleware } from '@contractspec/lib.observability/tracing/middleware';

app.use(createTracingMiddleware());`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Anomaly Detection</h2>
        <p className="text-muted-foreground text-sm">
          Includes baseline calculation and anomaly detection helpers for
          auto-rollback without writing custom math.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { AnomalyDetector, RootCauseAnalyzer, AlertManager } from '@contractspec/lib.observability';

const detector = new AnomalyDetector({ errorRateDelta: 0.4 });
const analyzer = new RootCauseAnalyzer();
const alertManager = new AlertManager({ transport: sendOpsAlert });

const signals = detector.evaluate(point);
signals.forEach((signal) => {
  const analysis = analyzer.analyze(signal, recentDeployments);
  alertManager.notify(signal, analysis);
});`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/slo" className="btn-primary">
          Next: SLO <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
