import type { LanguageModel } from 'ai';
import { createProvider } from '@contractspec/lib.ai-providers/factory';
import type { ProviderConfig } from '@contractspec/lib.ai-providers/types';
import { StabilityEnum } from '@contractspec/lib.contracts/ownership';
import type { AgentSpec } from '../spec/spec';
import type { ToolHandler } from '../types';
import { ContractSpecAgent } from './contract-spec-agent';

const JSON_ONLY_RULES = [
  'You MUST output valid JSON ONLY.',
  'Do not wrap the output in markdown fences.',
  'Do not include commentary or explanation.',
  'Use double quotes for all keys and string values.',
  'Do not include trailing commas.',
].join('\n');

const DEFAULT_SPEC: AgentSpec = {
  meta: {
    key: 'agent.json-runner',
    version: '1.0.0',
    description: 'JSON-only agent runner for deterministic pipelines.',
    stability: StabilityEnum.Experimental,
    owners: ['platform.core'],
    tags: ['json', 'agent'],
  },
  instructions: 'You are a precise JSON generator.',
  tools: [],
};

export interface AgentJsonRunnerOptions {
  spec?: AgentSpec;
  model?: LanguageModel;
  provider?: ProviderConfig;
  system?: string;
  toolHandlers?: Map<string, ToolHandler>;
  maxSteps?: number;
  temperature?: number;
}

export interface AgentJsonRunner {
  generateJson: (prompt: string) => Promise<string>;
}

function resolveModel(options: AgentJsonRunnerOptions): LanguageModel {
  if (options.model) return options.model;
  if (options.provider) {
    return createProvider(options.provider).getModel();
  }
  throw new Error('createAgentJsonRunner requires a model or provider config');
}

function applyModelSettings(
  model: LanguageModel,
  settings: { temperature?: number }
): LanguageModel {
  const { temperature } = settings;
  if (temperature === undefined) return model;
  const withSettings = model as LanguageModel & {
    withSettings?: (settings: Record<string, unknown>) => LanguageModel;
  };
  if (typeof withSettings.withSettings === 'function') {
    return withSettings.withSettings({ temperature });
  }
  return model;
}

function buildInstructions(base: string, system?: string): string {
  return [base, JSON_ONLY_RULES, system].filter(Boolean).join('\n\n');
}

function ensureToolHandlers(
  spec: AgentSpec,
  handlers: Map<string, ToolHandler>
): void {
  for (const tool of spec.tools) {
    if (!handlers.has(tool.name)) {
      throw new Error(`Missing handler for tool: ${tool.name}`);
    }
  }
}

export async function createAgentJsonRunner(
  options: AgentJsonRunnerOptions
): Promise<AgentJsonRunner> {
  const model = applyModelSettings(resolveModel(options), {
    temperature: options.temperature ?? 0,
  });
  const baseSpec = options.spec ?? DEFAULT_SPEC;
  const spec: AgentSpec = {
    ...baseSpec,
    instructions: buildInstructions(baseSpec.instructions, options.system),
    maxSteps: options.maxSteps ?? baseSpec.maxSteps,
  };

  const toolHandlers = options.toolHandlers ?? new Map<string, ToolHandler>();
  ensureToolHandlers(spec, toolHandlers);

  const agent = await ContractSpecAgent.create({
    spec,
    model,
    toolHandlers,
  });

  return {
    async generateJson(prompt: string) {
      const result = await agent.generate({ prompt });
      return result.text;
    },
  };
}
