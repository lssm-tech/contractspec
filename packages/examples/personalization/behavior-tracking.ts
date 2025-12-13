import { runBehaviorTrackingExample } from './src/behavior-tracking';

void runBehaviorTrackingExample().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});






















