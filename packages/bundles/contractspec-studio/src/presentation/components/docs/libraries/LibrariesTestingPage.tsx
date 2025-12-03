// export const metadata: Metadata = {
//   title: 'Testing Library | ContractSpec',
//   description:
//     'Capture production traffic and generate golden tests from real requests.',
// };

export function LibrariesTestingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.testing</h1>
        <p className="text-muted-foreground text-lg">
          Golden tests ensure new rollouts behave exactly like the traffic that
          inspired them. Record requests in production, replay them locally, and
          ship with confidence.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Record traffic</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import {
  TrafficRecorder,
  InMemoryTrafficStore,
} from '@lssm/lib.testing/recorder';

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
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Generate suites</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { GoldenTestGenerator } from '@lssm/lib.testing';

const generator = new GoldenTestGenerator();
const code = generator.generate(snapshots, {
  suiteName: 'orders.create golden path',
  runnerImport: './tests/run-operation',
  runnerFunction: 'runOrdersCommand',
  framework: 'vitest',
});`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CLI workflow</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`contractspec test generate \\
  --operation orders.create \\
  --output tests/orders.create.golden.test.ts \\
  --runner-import ./tests/run-operation \\
  --runner-fn runOrdersCommand \\
  --from-production \\
  --days 7 \\
  --sample-rate 0.05`}
        </pre>
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
    </div>
  );
}
