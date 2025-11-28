import { generateText, Output } from 'ai';
import type { LanguageModel } from 'ai';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import type {
  IntentPattern,
  SpecSuggestion,
  SpecSuggestionProposal,
  SuggestionStatus,
  EvolutionConfig,
} from '../types';

/**
 * Zod schema for AI-generated spec suggestions.
 */
const SpecSuggestionProposalSchema = z.object({
  summary: z.string().describe('Brief summary of the proposed change'),
  rationale: z
    .string()
    .describe('Detailed explanation of why this change is needed'),
  changeType: z
    .enum(['new-spec', 'revision', 'policy-update', 'schema-update'])
    .describe('Type of change being proposed'),
  recommendedActions: z
    .array(z.string())
    .describe('List of specific actions to implement the change'),
  estimatedImpact: z
    .enum(['low', 'medium', 'high'])
    .describe('Estimated impact of implementing this change'),
  riskLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('Risk level associated with this change'),
  diff: z
    .string()
    .optional()
    .describe('Optional diff or code snippet showing the change'),
});

type AIGeneratedProposal = z.infer<typeof SpecSuggestionProposalSchema>;

/**
 * Configuration for the AI-powered spec generator.
 */
export interface AISpecGeneratorConfig {
  /** AI SDK language model */
  model: LanguageModel;
  /** Evolution configuration */
  evolutionConfig?: EvolutionConfig;
  /** Custom system prompt */
  systemPrompt?: string;
}

/**
 * AI-powered spec generator using AI SDK v6.
 *
 * Uses structured output (Output.object) to generate
 * well-formed spec suggestions from intent patterns.
 */
export class AISpecGenerator {
  private readonly model: LanguageModel;
  private readonly config: EvolutionConfig;
  private readonly systemPrompt: string;

  constructor(options: AISpecGeneratorConfig) {
    this.model = options.model;
    this.config = options.evolutionConfig ?? {};
    this.systemPrompt =
      options.systemPrompt ??
      `You are a ContractSpec evolution expert. Your role is to analyze telemetry data, anomalies, and usage patterns to suggest improvements to API contracts and specifications.

When generating suggestions:
1. Be specific and actionable
2. Consider backwards compatibility
3. Prioritize stability and reliability
4. Explain the rationale clearly
5. Estimate impact and risk accurately`;
  }

  /**
   * Generate a spec suggestion from an intent pattern using AI.
   */
  async generateFromIntent(
    intent: IntentPattern,
    options: {
      additionalContext?: string;
      existingSpec?: Record<string, unknown>;
    } = {}
  ): Promise<SpecSuggestion> {
    const prompt = this.buildPrompt(intent, options);

    // AI SDK v6: Output.object() only takes { schema }
    const { output } = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      output: Output.object({
        schema: SpecSuggestionProposalSchema,
      }),
    });

    return this.buildSuggestion(intent, output);
  }

  /**
   * Generate multiple suggestions for a batch of intents.
   */
  async generateBatch(
    intents: IntentPattern[],
    options: { maxConcurrent?: number } = {}
  ): Promise<SpecSuggestion[]> {
    const maxConcurrent = options.maxConcurrent ?? 3;
    const results: SpecSuggestion[] = [];

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < intents.length; i += maxConcurrent) {
      const batch = intents.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(
        batch.map((intent) => this.generateFromIntent(intent))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Validate and enhance an existing suggestion using AI.
   */
  async enhanceSuggestion(
    suggestion: SpecSuggestion
  ): Promise<SpecSuggestion> {
    const prompt = `Review and enhance this spec suggestion:

Intent: ${suggestion.intent.type} - ${suggestion.intent.description}
Current Summary: ${suggestion.proposal.summary}
Current Rationale: ${suggestion.proposal.rationale}

Evidence:
${suggestion.evidence.map((e) => `- ${e.type}: ${e.description}`).join('\n')}

Please provide an improved version with more specific recommendations.`;

    // AI SDK v6: Output.object() only takes { schema }
    const { output } = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      output: Output.object({
        schema: SpecSuggestionProposalSchema,
      }),
    });

    return {
      ...suggestion,
      proposal: {
        ...suggestion.proposal,
        summary: output.summary,
        rationale: output.rationale,
        changeType: output.changeType,
        diff: output.diff,
        metadata: {
          ...suggestion.proposal.metadata,
          aiEnhanced: true,
          recommendedActions: output.recommendedActions,
          estimatedImpact: output.estimatedImpact,
          riskLevel: output.riskLevel,
        },
      },
    };
  }

  private buildPrompt(
    intent: IntentPattern,
    options: {
      additionalContext?: string;
      existingSpec?: Record<string, unknown>;
    }
  ): string {
    const parts = [
      `Analyze this intent pattern and generate a spec suggestion:`,
      ``,
      `Intent Type: ${intent.type}`,
      `Description: ${intent.description}`,
      `Confidence: ${(intent.confidence.score * 100).toFixed(0)}% (sample size: ${intent.confidence.sampleSize})`,
    ];

    if (intent.operation) {
      parts.push(
        `Operation: ${intent.operation.name} v${intent.operation.version}`
      );
    }

    if (intent.evidence.length > 0) {
      parts.push(``, `Evidence:`);
      for (const evidence of intent.evidence) {
        parts.push(`- [${evidence.type}] ${evidence.description}`);
      }
    }

    if (intent.metadata) {
      parts.push(``, `Metadata: ${JSON.stringify(intent.metadata, null, 2)}`);
    }

    if (options.existingSpec) {
      parts.push(
        ``,
        `Existing Spec:`,
        '```json',
        JSON.stringify(options.existingSpec, null, 2),
        '```'
      );
    }

    if (options.additionalContext) {
      parts.push(``, `Additional Context:`, options.additionalContext);
    }

    return parts.join('\n');
  }

  private buildSuggestion(
    intent: IntentPattern,
    aiOutput: AIGeneratedProposal
  ): SpecSuggestion {
    const now = new Date();

    const proposal: SpecSuggestionProposal = {
      summary: aiOutput.summary,
      rationale: aiOutput.rationale,
      changeType: aiOutput.changeType,
      diff: aiOutput.diff,
      metadata: {
        aiGenerated: true,
        recommendedActions: aiOutput.recommendedActions,
        estimatedImpact: aiOutput.estimatedImpact,
        riskLevel: aiOutput.riskLevel,
      },
    };

    return {
      id: randomUUID(),
      intent,
      target: intent.operation,
      proposal,
      confidence: intent.confidence.score,
      priority: this.calculatePriority(intent, aiOutput),
      createdAt: now,
      createdBy: 'ai-spec-generator',
      status: this.determineInitialStatus(intent),
      evidence: intent.evidence,
      tags: ['ai-generated', intent.type],
    };
  }

  private calculatePriority(
    intent: IntentPattern,
    aiOutput: AIGeneratedProposal
  ): 'low' | 'medium' | 'high' {
    // Combine AI assessment with intent severity
    const impactScore =
      aiOutput.estimatedImpact === 'high'
        ? 1
        : aiOutput.estimatedImpact === 'medium'
          ? 0.5
          : 0.25;

    const intentScore = intent.confidence.score;
    const urgency =
      intent.type === 'error-spike' ? 0.3 : intent.type === 'latency-regression' ? 0.2 : 0;

    const combined = impactScore * 0.4 + intentScore * 0.4 + urgency;

    if (combined >= 0.7) return 'high';
    if (combined >= 0.4) return 'medium';
    return 'low';
  }

  private determineInitialStatus(intent: IntentPattern): SuggestionStatus {
    // Auto-approve high-confidence, low-risk suggestions if configured
    if (
      this.config.autoApproveThreshold &&
      intent.confidence.score >= this.config.autoApproveThreshold &&
      !this.config.requireApproval
    ) {
      return 'approved';
    }
    return 'pending';
  }
}

/**
 * Create an AI-powered spec generator.
 */
export function createAISpecGenerator(
  config: AISpecGeneratorConfig
): AISpecGenerator {
  return new AISpecGenerator(config);
}

