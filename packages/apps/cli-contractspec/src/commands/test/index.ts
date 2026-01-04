import { resolve } from 'path';
import chalk from 'chalk';
import type { Config } from '../../utils/config';
import {
  runTestSpecs,
  createNodeAdapters,
  TestGeneratorService,
  listTests,
} from '@contractspec/bundle.workspace';
import { generateText } from '@contractspec/lib.ai-agent';
import { OperationSpecRegistry } from '@contractspec/lib.contracts';
import { loadTypeScriptModule } from '../../utils/module-loader';
import type { OperationSpec } from '@contractspec/lib.contracts';

interface TestCommandOptions {
  registry?: string;
  json?: boolean;
  generate?: boolean;
  list?: boolean;
}

export async function testCommand(
  specFile: string,
  options: TestCommandOptions,
  _config: Config
) {
  const adapters = createNodeAdapters({
    cwd: process.cwd(),
    silent: options.json,
  });

  if (options.list) {
    const specs = await listTests([specFile], adapters); // TODO: Support glob expansion if specFile is pattern
    if (options.json) {
      console.log(JSON.stringify(specs, null, 2));
    } else {
      console.log(chalk.blue(`Found ${specs.length} tests:`));
      for (const spec of specs) {
        console.log(`- ${spec.meta.key} (v${spec.meta.version})`);
      }
    }
    return;
  }

  if (options.generate) {
    // Generate tests logic
    adapters.logger.info(`Generating tests for ${specFile}...`);
    
    // 1. Load the spec file to find TARGET operations
    // This is basic implementation: specific file -> generate test for it
    try {
        const resolvedPath = resolve(specFile);
        const exports = await loadTypeScriptModule(resolvedPath);
        
        // Find OperationSpecs
        const operations: OperationSpec<any, any>[] = [];
        for (const value of Object.values(exports)) {
            if (isOperationSpec(value)) {
                operations.push(value);
            }
        }
        
        if (operations.length === 0) {
            adapters.logger.warn('No operations found in file to generate tests for.');
            return;
        }

        // 2. Initialize Generator
        // For AI provider, we reuse config or default to OpenAI/Anthropic env vars
        // In real app, we'd load provider from config
        // Here we pass a dummy model for now or ensure one is configured in workspace services
        // BUT TestGeneratorService needs a model.
        // We'll throw if no model configured?
        // Let's assume user HAS configured it.
        // We need to construct LanguageModel.
        // For this iteration, I'll log a todo/warning if model creation isn't fully wired,
        // or instantiate a default one if key is present.
        
        // Temporary: rely on environment or throw
        const { createOpenAI } = await import('@ai-sdk/openai');
        const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const model = openai('gpt-4-turbo'); 

        const generator = new TestGeneratorService(adapters.logger, model);

        for (const op of operations) {
            adapters.logger.info(`Generating test for ${op.key}...`);
            const testSpec = await generator.generateTests(op);
            
            if (options.json) {
                console.log(JSON.stringify(testSpec, null, 2));
            } else {
                console.log(chalk.green(`Generated test for ${op.key}`));
                console.log(JSON.stringify(testSpec, null, 2)); // Print to stdout for pipe
            }
        }

    } catch (error) {
        adapters.logger.error(`Generation failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
    return;
  }

  // Run tests
  const result = await runTestSpecs(
    [specFile], 
    {
      registry: options.registry,
      pattern: undefined, // Could add pattern option to CLI later
    },
    adapters
  );

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

  if (!result.passed) {
    process.exit(1);
  }
}

function isOperationSpec(value: unknown): value is OperationSpec<any, any> {
    return (
        typeof value === 'object' &&
        value !== null &&
        (value as any).kind === 'operation'
    );
}

