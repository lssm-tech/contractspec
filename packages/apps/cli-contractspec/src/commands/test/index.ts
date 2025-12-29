import type { Config } from '../../utils/config';
import {
  runTestSpecs,
  createNodeAdapters,
} from '@contractspec/bundle.workspace';

interface TestCommandOptions {
  registry?: string;
  json?: boolean;
}

export async function testCommand(
  specFile: string,
  options: TestCommandOptions,
  _config: Config
) {
  const adapters = createNodeAdapters({
    cwd: process.cwd(),
  });

  const result = await runTestSpecs(
    [specFile], // Service supports multiple, CLI arg is single glob? Or file? Commander says: argument('<specFile>').
    // CLI 'test' command usually takes a file or glob.
    // If it's a glob, resolving it to files is better done by CLI or Service?
    // `testCommand` argument `specFile` is a string.
    // Service expects `specFiles: string[]`.
    // I will pass `[specFile]`.
    // Wait, does service handle globs?
    // My service impl: `const resolvedPath = resolve(specFile);`
    // It expects a FILE path.
    // If user passes glob, CLI should resolve it?
    // `testCommand` implementation in Step 618: `path.resolve(specFile)`.
    // It seems it handled single file?
    // `const specExports = await loadTypeScriptModule(resolvedSpecPath);`
    // Yes, single file.
    {
      registry: options.registry,
    },
    adapters
  );

  if (!result.passed) {
    process.exit(1);
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        result.results.map((r) => ({
          spec: r.spec.meta,
          passed: r.passed,
          failed: r.failed,
          scenarios: r.scenarios.map((scenario) => ({
            key: scenario.scenario.key,
            status: scenario.status,
            error: scenario.error?.message,
            assertions: scenario.assertionResults.map((assertion) => ({
              type: assertion.assertion.type,
              status: assertion.status,
              message: assertion.message,
            })),
          })),
        })),
        null,
        2
      )
    );
  }
}
