/**
 * Agent Guide Service
 *
 * Generates implementation plans and prompts for AI coding agents.
 * Bridges ContractSpec specifications with agent-specific formats.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import type { FeatureModuleSpec } from '@lssm/lib.contracts/features';
import type {
  SpecRegistry,
  PresentationRegistry,
  FeatureRegistry,
} from '@lssm/lib.contracts';
import type { AgentType, ImplementationPlan } from '@lssm/lib.contracts/llm';
import {
  generateImplementationPlan,
  specToFullMarkdown,
  specToAgentPrompt,
  featureToMarkdown,
  exportSpec,
} from '@lssm/lib.contracts/llm';
import { getAgentAdapter, listAgentTypes } from './adapters';
import type { AgentGuideConfig, GuideOptions, GuideResult } from './types';

const DEFAULT_CONFIG: AgentGuideConfig = {
  defaultAgent: 'generic-mcp',
  verbose: false,
};

/**
 * Agent Guide Service
 *
 * Main service for generating implementation guidance for AI coding agents.
 */
export class AgentGuideService {
  private config: AgentGuideConfig;

  constructor(config: Partial<AgentGuideConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate an implementation guide for a spec.
   */
  generateGuide(
    spec: AnyContractSpec,
    options: GuideOptions = {}
  ): GuideResult {
    const agent = options.agent ?? this.config.defaultAgent;
    const adapter = getAgentAdapter(agent);

    // Generate the implementation plan
    const plan = generateImplementationPlan(spec, {
      projectRoot: this.config.projectRoot,
      existingFiles: options.targetPath ? [options.targetPath] : undefined,
    });

    // Format for the target agent
    const prompt = adapter.formatPlan(plan);

    // Generate raw markdown for clipboard/export
    const markdown = specToFullMarkdown(spec);

    return {
      plan,
      prompt,
      markdown,
    };
  }

  /**
   * Generate a guide for a feature (includes all related specs).
   */
  generateFeatureGuide(
    feature: FeatureModuleSpec,
    deps: {
      specs?: SpecRegistry;
      presentations?: PresentationRegistry;
    },
    options: GuideOptions = {}
  ): GuideResult {
    const agent = options.agent ?? this.config.defaultAgent;
    const adapter = getAgentAdapter(agent);

    // Create a composite plan for the feature
    const firstOp = feature.operations?.[0];
    const spec = firstOp
      ? deps.specs?.getSpec(firstOp.name, firstOp.version)
      : undefined;

    // Generate base plan from first spec or create feature-level plan
    let plan: ImplementationPlan;
    if (spec) {
      plan = generateImplementationPlan(spec, {
        projectRoot: this.config.projectRoot,
      });
      // Override target to indicate it's a feature
      plan.target = {
        type: 'feature',
        name: feature.meta.key,
        version: 1,
      };
      plan.context.goal = feature.meta.description ?? plan.context.goal;
    } else {
      // Create a minimal plan for features without specs
      plan = {
        target: {
          type: 'feature',
          name: feature.meta.key,
          version: 1,
        },
        context: {
          goal:
            feature.meta.description ?? `Implement feature ${feature.meta.key}`,
          description: feature.meta.title ?? feature.meta.key,
          background: '',
        },
        specMarkdown: featureToMarkdown(feature, deps),
        fileStructure: [],
        steps: [
          {
            order: 1,
            title: 'Implement Feature',
            description: `Implement the ${feature.meta.key} feature`,
            acceptanceCriteria: [],
          },
        ],
        constraints: { policy: [], security: [], pii: [] },
        verificationChecklist: [],
      };
    }

    // Enhance spec markdown with full feature context
    plan.specMarkdown = featureToMarkdown(feature, deps, {
      format: 'full',
      includeRelatedSpecs: true,
      includeRelatedEvents: true,
      includeRelatedPresentations: true,
    });

    // Add steps for each operation
    if (feature.operations?.length) {
      plan.steps = feature.operations.map((op, idx) => ({
        order: idx + 1,
        title: `Implement ${op.name}`,
        description: `Implement operation ${op.name}.v${op.version}`,
        acceptanceCriteria: [`Operation ${op.name} works as specified`],
      }));
    }

    const prompt = adapter.formatPlan(plan);
    const markdown = featureToMarkdown(feature, deps);

    return {
      plan,
      prompt,
      markdown,
    };
  }

  /**
   * Generate agent-specific configuration (e.g., cursor rules).
   */
  generateAgentConfig(
    spec: AnyContractSpec,
    agent?: AgentType
  ): string | undefined {
    const adapter = getAgentAdapter(agent ?? this.config.defaultAgent);
    return adapter.generateConfig?.(spec);
  }

  /**
   * Export a spec in a specific format for an agent.
   */
  exportForAgent(
    spec: AnyContractSpec,
    agent: AgentType,
    taskType: 'implement' | 'test' | 'refactor' | 'review' = 'implement',
    existingCode?: string
  ): string {
    return specToAgentPrompt(spec, { taskType, existingCode });
  }

  /**
   * List available agent types.
   */
  listAgentTypes(): AgentType[] {
    return listAgentTypes();
  }

  /**
   * Get the default agent type.
   */
  getDefaultAgent(): AgentType {
    return this.config.defaultAgent;
  }

  /**
   * Update configuration.
   */
  configure(config: Partial<AgentGuideConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Create a new AgentGuideService instance.
 */
export function createAgentGuideService(
  config?: Partial<AgentGuideConfig>
): AgentGuideService {
  return new AgentGuideService(config);
}

/** Default singleton instance */
export const agentGuideService = new AgentGuideService();
