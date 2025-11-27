import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Distributed Tracing Operations | ContractSpec',
  description: 'Running and configuring distributed tracing in production.',
};

export default function DistributedTracingOpsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Distributed Tracing</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec uses OpenTelemetry (OTel) for distributed tracing. This
          guide explains how to configure exporters and collectors.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuration</h2>
        <p>Configure the OTel SDK via environment variables:</p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`OTEL_SERVICE_NAME=my-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Exporters</h2>
        <p>By default, the OTLP exporter is used. You can point it to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Jaeger</li>
          <li>Tempo (Grafana)</li>
          <li>Honeycomb</li>
          <li>Datadog (via OTel Collector)</li>
        </ul>
      </div>
    </div>
  );
}



















