# @lssm/lib.testing

Website: https://contractspec.io/


**Safe regeneration verification** — Capture production traffic and generate golden tests automatically.

Golden-test utilities that record real requests/responses and generate runnable test suites. Prove that regenerated code behaves identically to the original.

- **TrafficRecorder** captures production requests/responses with sampling + sanitization.
- **GoldenTestGenerator** converts snapshots into runnable suites.
- **Adapters** output Vitest or Jest files and helper runners.

### Usage

```ts
import {
  TrafficRecorder,
  InMemoryTrafficStore,
} from '@lssm/lib.testing/recorder';

const recorder = new TrafficRecorder({
  store: new InMemoryTrafficStore(),
  sampleRate: 0.01,
});

await recorder.record({
  operation: { name: 'orders.create', version: 3 },
  input: payload,
  output,
  success: true,
  timestamp: new Date(),
});
```

See `GoldenTestGenerator` for generating suites and CLI in `@lssm/app.contracts-cli`.















