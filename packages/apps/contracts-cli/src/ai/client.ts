import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';
import { getAIProvider } from './providers';
import type { Config } from '../utils/config';
import {
  buildOperationSpecPrompt,
  buildEventSpecPrompt,
  buildPresentationSpecPrompt,
  getSystemPrompt,
} from './prompts/spec-creation';
import {
  buildHandlerPrompt,
  buildComponentPrompt,
  buildFormPrompt,
  buildTestPrompt,
  getCodeGenSystemPrompt,
} from './prompts/code-generation';
import type { OpKind, PresentationKind } from '../types';

/**
 * AI Client for spec creation and code generation
 */
export class AIClient {
  constructor(private config: Config) {}

  /**
   * Generate operation spec from natural language description
   */
  async generateOperationSpec(description: string, kind: OpKind) {
    const model = getAIProvider(this.config);

    const schema = z.object({
      name: z.string().describe('Dot notation name like "domain.operation"'),
      version: z.number().int().positive().default(1),
      description: z.string().describe('Clear, concise summary'),
      goal: z.string().describe('Business purpose'),
      context: z.string().describe('Background and constraints'),
      stability: z.enum(['experimental', 'beta', 'stable', 'deprecated']).default('beta'),
      owners: z.array(z.string()).describe('Team/person owners with @ prefix'),
      tags: z.array(z.string()).describe('Categorization tags'),
      auth: z.enum(['anonymous', 'user', 'admin']).describe('Required auth level'),
      inputShape: z.string().describe('Description of input structure'),
      outputShape: z.string().describe('Description of output structure'),
      flags: z.array(z.string()).describe('Feature flags').default([]),
      possibleEvents: z.array(z.string()).describe('Events this may emit').default([]),
      analytics: z.array(z.string()).describe('Analytics events to track').default([]),
    });

    const prompt = buildOperationSpecPrompt(description, kind);

    const result = await generateObject({
      model,
      schema,
      prompt,
      system: getSystemPrompt(),
    });

    return result.object;
  }

  /**
   * Generate event spec from description
   */
  async generateEventSpec(description: string) {
    const model = getAIProvider(this.config);

    const schema = z.object({
      name: z.string().describe('Dot notation name like "domain.event_name"'),
      version: z.number().int().positive().default(1),
      description: z.string().describe('When this event is emitted'),
      stability: z.enum(['experimental', 'beta', 'stable', 'deprecated']).default('beta'),
      owners: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      payloadShape: z.string().describe('Description of event payload'),
      piiFields: z.array(z.string()).describe('PII field paths').default([]),
    });

    const prompt = buildEventSpecPrompt(description);

    const result = await generateObject({
      model,
      schema,
      prompt,
      system: getSystemPrompt(),
    });

    return result.object;
  }

  /**
   * Generate presentation spec from description
   */
  async generatePresentationSpec(description: string, kind: PresentationKind) {
    const model = getAIProvider(this.config);

    const schema = z.object({
      name: z.string(),
      version: z.number().int().positive().default(1),
      description: z.string(),
      stability: z.enum(['experimental', 'beta', 'stable', 'deprecated']).default('beta'),
      owners: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      componentKey: z.string().optional(),
      propsShape: z.string().optional(),
      content: z.string().optional(),
      mimeType: z.string().optional(),
      dataShape: z.string().optional(),
    });

    const prompt = buildPresentationSpecPrompt(description, kind);

    const result = await generateObject({
      model,
      schema,
      prompt,
      system: getSystemPrompt(),
    });

    return result.object;
  }

  /**
   * Generate handler implementation from spec
   */
  async generateHandler(specCode: string): Promise<string> {
    const model = getAIProvider(this.config);

    const result = await generateText({
      model,
      prompt: buildHandlerPrompt(specCode),
      system: getCodeGenSystemPrompt(),
    });

    return result.text;
  }

  /**
   * Generate React component from presentation spec
   */
  async generateComponent(specCode: string): Promise<string> {
    const model = getAIProvider(this.config);

    const result = await generateText({
      model,
      prompt: buildComponentPrompt(specCode),
      system: getCodeGenSystemPrompt(),
    });

    return result.text;
  }

  /**
   * Generate form component from form spec
   */
  async generateForm(specCode: string): Promise<string> {
    const model = getAIProvider(this.config);

    const result = await generateText({
      model,
      prompt: buildFormPrompt(specCode),
      system: getCodeGenSystemPrompt(),
    });

    return result.text;
  }

  /**
   * Generate tests for implementation
   */
  async generateTests(
    specCode: string,
    implementationCode: string,
    testType: 'handler' | 'component'
  ): Promise<string> {
    const model = getAIProvider(this.config);

    const result = await generateText({
      model,
      prompt: buildTestPrompt(specCode, implementationCode, testType),
      system: getCodeGenSystemPrompt(),
    });

    return result.text;
  }

  /**
   * Stream code generation for better UX
   */
  async streamCodeGeneration(prompt: string, onChunk: (text: string) => void): Promise<string> {
    const model = getAIProvider(this.config);

    const result = await streamText({
      model,
      prompt,
      system: getCodeGenSystemPrompt(),
    });

    let fullText = '';
    
    for await (const chunk of result.textStream) {
      fullText += chunk;
      onChunk(chunk);
    }

    return fullText;
  }
}

