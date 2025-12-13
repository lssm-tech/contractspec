import { runAiSupportBotExample } from './src/setup';

void runAiSupportBotExample().catch((error) => {
  // Keep console usage limited to this demo entrypoint only.
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
