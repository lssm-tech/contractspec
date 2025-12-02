import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evolution Library | ContractSpec',
  description:
    'Adaptive spec suggestions, approvals, and variant orchestration for auto-evolving apps.',
};

export default function EvolutionLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.evolution</h1>
        <p className="text-muted-foreground text-lg">
          Analyze production telemetry, surface anomalies, and turn them into
          AI-reviewed spec proposals that can be approved, rolled out, or
          reverted.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">From telemetry to intent</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { SpecAnalyzer } from '@lssm/lib.evolution/analyzer';
import { EvolutionPipeline } from '@lssm/lib.observability';

const analyzer = new SpecAnalyzer();
const pipeline = new EvolutionPipeline({
  onIntent: (intent) => console.log('[intent]', intent),
});

// feed telemetry samples from tracing middleware
pipeline.ingest({
  operation: { name: 'billing.createInvoice', version: 4 },
  durationMs: 612,
  success: false,
  timestamp: new Date(),
  errorCode: 'VALIDATION_FAILED',
});`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Generate & approve suggestions</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import {
  SpecGenerator,
  SpecSuggestionOrchestrator,
  InMemorySpecSuggestionRepository,
} from '@lssm/lib.evolution';

const generator = new SpecGenerator();
const repository = new InMemorySpecSuggestionRepository();
const orchestrator = new SpecSuggestionOrchestrator({ repository });

const suggestion = generator.generateFromIntent(intentPattern, {
  summary: 'Add PO number requirement for acme.corp',
});

await orchestrator.submit(suggestion, sessionState);`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Write approved specs back to git</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { FileSystemSuggestionWriter } from '@lssm/lib.evolution/approval';

const writer = new FileSystemSuggestionWriter({
  outputDir:
    'packages/libs/contracts/src/generated',
});

await writer.write({
  ...suggestion,
  status: 'approved',
  approvals: { reviewer: 'ops@contractspec', decidedAt: new Date() },
});`}
        </pre>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'Approvals by default',
            description:
              'Every suggestion flows through @lssm/lib.ai-agent’s ApprovalWorkflow. Tune auto-approval thresholds per environment.',
          },
          {
            title: 'Pluggable storage',
            description:
              'Use the Prisma repository in production, in-memory for tests, or stream serialized suggestions into your own queue.',
          },
        ].map((card) => (
          <div key={card.title} className="card-subtle space-y-2 p-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-muted-foreground text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
