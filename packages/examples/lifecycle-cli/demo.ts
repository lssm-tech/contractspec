import { runLifecycleCliDemo } from './src/demo';

void runLifecycleCliDemo().catch((error) => {
  // Keep console usage limited to this demo entrypoint only.
  // Prefer structured logging within the library (see src/demo.ts).
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});

/*

bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server src/index.ts
 */
