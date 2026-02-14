import type { LanguageModel, LanguageModelUsage } from 'ai';
import { generateText } from 'ai';
import {
  type TestSpec,
  type TestTarget,
} from '@contractspec/lib.contracts-spec/tests';
import type { OperationSpec } from '@contractspec/lib.contracts-spec';
import type { LoggerAdapter } from '../../ports/logger';

export interface TestGeneratorOptions {
  model?: LanguageModel;
  maxScenarios?: number;
}

const SYSTEM_PROMPT = `
You are an expert software test engineer specializing in ContractSpec.
Your goal is to generate comprehensive test scenarios for a given ContractSpec Operation.

A TestSpec consists of:
- targeted operation
- fixtures (setup state)
- scenarios (given/when/then)

For each scenario:
1. Define 'given': initial state or data setup
2. Define 'when': the operation execution with specific input
3. Define 'then': assertions on output, error, or events

Generate scenarios covering:
- Happy path (valid input, successful execution)
- Edge cases (boundary values, optional fields)
- Error cases (invalid input, business rule violations)
`.trim();

export class TestGeneratorService {
  constructor(
    private readonly logger: LoggerAdapter,
    private readonly defaultModel?: LanguageModel
  ) {}

  async generateTests(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spec: OperationSpec<any, any>, // Use any to satisfy generics for now
    options: TestGeneratorOptions = {}
  ): Promise<TestSpec> {
    const model = options.model ?? this.defaultModel;
    if (!model) {
      throw new Error('No AI model provided for test generation');
    }

    this.logger.info(`Generating tests for operation ${spec.meta.key}...`);

    const prompt = `
Generate a TestSpec for the following Operation:

\`\`\`json
${JSON.stringify(spec, null, 2)}
\`\`\`

The output must be a valid JSON object conforming to the TestSpec interface.
Do not include markdown formatting or explanations, just the JSON.
`.trim();

    try {
      const { text, usage } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt,
      });

      this.logUsage(usage);

      const generated = this.parseResponse(text);
      return this.enrichSpec(generated, spec);
    } catch (error) {
      this.logger.error('Failed to generate tests', { error });
      throw error;
    }
  }

  private parseResponse(text: string): Partial<TestSpec> {
    try {
      // clean markdown code blocks if present
      const cleaned = text.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleaned);
    } catch (_e) {
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  private enrichSpec(
    generated: Partial<TestSpec>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: OperationSpec<any, any>
  ): TestSpec {
    const meta = {
      key: `${target.meta.key}.test`,
      version: target.meta.version ?? '0.0.1',
      owners: target.meta.owners ?? [],
    };

    const targetRef: TestTarget = {
      type: 'operation',
      operation: {
        key: target.meta.key,
        version: target.meta.version,
      },
    };

    return {
      meta,
      target: targetRef,
      fixtures: generated.fixtures ?? [],
      scenarios: generated.scenarios ?? [],
      coverage: generated.coverage,
    } as TestSpec;
  }

  private logUsage(usage: LanguageModelUsage) {
    // Cast to any to avoid type issues with different AI SDK versions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = usage as any;
    this.logger.debug(
      `AI Usage: ${u.promptTokens} prompt + ${u.completionTokens} completion = ${u.totalTokens} total tokens`
    );
  }
}
