import type {
  AgentSpec,
  AgentToolConfig,
} from '@contractspec/lib.ai-agent/spec';
import { defineAgent } from '@contractspec/lib.ai-agent/spec';
import type { SupportBotSpec } from './types';

export interface SupportBotDefinition {
  base: AgentSpec;
  tools?: AgentToolConfig[];
  autoEscalateThreshold?: number;
}

export function defineSupportBot(
  definition: SupportBotDefinition
): SupportBotSpec {
  const base = defineAgent({
    ...definition.base,
    policy: {
      ...definition.base.policy,
      confidence: {
        min: definition.base.policy?.confidence?.min ?? 0.7,
        default: definition.base.policy?.confidence?.default ?? 0.6,
      },
      escalation: {
        confidenceThreshold:
          definition.autoEscalateThreshold ??
          definition.base.policy?.escalation?.confidenceThreshold ??
          definition.base.policy?.confidence?.min ??
          0.7,
        ...definition.base.policy?.escalation,
      },
    },
    memory: definition.base.memory ?? { maxEntries: 120, ttlMinutes: 120 },
    tools: definition.tools ?? definition.base.tools,
    instructions: `${definition.base.instructions}\n\nAlways cite support knowledge sources and flag compliance/billing issues for human review when unsure.`,
  });

  return {
    ...base,
    thresholds: {
      autoResolveMinConfidence: definition.autoEscalateThreshold ?? 0.75,
      maxIterations: 6,
    },
  };
}
