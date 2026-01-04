
import type { LanguageModel, LanguageModelUsage } from '@contractspec/lib.ai-agent';
import { generateText } from '@contractspec/lib.ai-agent';
import {
  type TestSpec,
  type TestTarget,
  type TestScenario,
  type Fixture,
  makeTestKey,
} from '@contractspec/lib.contracts/tests';
import type { OperationSpec } from '@contractspec/lib.contracts';
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
    spec: OperationSpec,
    options: TestGeneratorOptions = {}
  ): Promise<TestSpec> {
    const model = options.model ?? this.defaultModel;
    if (!model) {
      throw new Error('No AI model provided for test generation');
    }

    this.logger.info(`Generating tests for operation ${spec.key}...`);

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
      this.logger.error('Failed to generate tests', error);
      throw error;
    }
  }

  private parseResponse(text: string): Partial<TestSpec> {
    try {
      // clean markdown code blocks if present
      const cleaned = text.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleaned);
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  private enrichSpec(
    generated: Partial<TestSpec>,
    target: OperationSpec
  ): TestSpec {
    const meta = {
      key: `${target.key}.test`,
      version: target.version ?? '0.0.1',
      owners: target.owners ?? [],
    };

    const targetRef: TestTarget = {
      type: 'operation',
      operation: {
        key: target.key,
        version: target.version,
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
    this.logger.debug(
      `AI Usage: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total tokens`
    );
  }
}
