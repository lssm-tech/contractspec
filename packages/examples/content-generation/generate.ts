import { runContentGenerationExample } from './src/generate';

void runContentGenerationExample().catch((error) => {
  // Keep console usage limited to this demo entrypoint only.
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
