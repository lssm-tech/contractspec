## Lifecycle CLI Demo

Website: https://contractspec.lssm.tech/


Tiny script showing how to run the lifecycle managed service from a CLI (no HTTP server required). It stitches together mock analytics + questionnaire adapters, runs an assessment, and prints the resulting recommendation/libraries.

### Run

```bash
bunx tsx packages/examples/lifecycle-cli/demo.ts
```

Feel free to tweak the mock data in `demo.ts` (or `src/demo.ts`) to experiment with different lifecycle stages.

