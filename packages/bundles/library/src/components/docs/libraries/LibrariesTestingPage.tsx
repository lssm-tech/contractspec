import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesTestingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.testing</h1>
        <p className="text-muted-foreground text-lg">
          Golden tests ensure new rollouts behave exactly like the traffic that
          inspired them. Record requests in production, replay them locally, and
          ship with confidence.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.testing" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Record traffic</h2>
        <CodeBlock
          language="typescript"
          code={`import {
  TrafficRecorder,
  InMemoryTrafficStore,
} from '@contractspec/lib.testing/recorder';

const recorder = new TrafficRecorder({
  store: new InMemoryTrafficStore(),
  sampleRate: 0.02,
  sanitize: (snapshot) => ({
    ...snapshot,
    input: { ...snapshot.input, secret: undefined },
  }),
});

await recorder.record({
  operation: { name: 'orders.create', version: 6 },
  input: payload,
  output,
  success: true,
  tenantId: ctx.organizationId ?? undefined,
});`}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Generate suites</h2>
        <CodeBlock
          language="typescript"
          code={`import { GoldenTestGenerator } from '@contractspec/lib.testing';

const generator = new GoldenTestGenerator();
const code = generator.generate(snapshots, {
  suiteName: 'orders.create golden path',
  runnerImport: './tests/run-operation',
  runnerFunction: 'runOrdersCommand',
  framework: 'vitest',
});`}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CLI workflow</h2>
        <CodeBlock
          language="bash"
          code={`contractspec test generate \\
  --operation orders.create \\
  --output tests/orders.create.golden.test.ts \\
  --runner-import ./tests/run-operation \\
  --runner-fn runOrdersCommand \\
  --from-production \\
  --days 7 \\
  --sample-rate 0.05`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'Framework agnostic',
            description:
              'Vitest by default, Jest via `generateJestSuite`, or call `runGoldenTests` manually inside CI.',
          },
          {
            title: 'Sanitize & sample',
            description:
              'Scrub payloads before persistence and control sample rates per operation to stay within compliance limits.',
          },
        ].map((card) => (
          <div key={card.title} className="card-subtle space-y-2 p-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-muted-foreground text-sm">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/resilience" className="btn-primary">
          Next: Resilience <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
