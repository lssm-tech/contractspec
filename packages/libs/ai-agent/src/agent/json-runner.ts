import type { LanguageModel } from 'ai';
import { createProvider } from '@contractspec/lib.ai-providers/factory';
import type { ProviderConfig } from '@contractspec/lib.ai-providers/types';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { AgentSpec } from '../spec/spec';
import type { ToolHandler } from '../types';
import { createAgentI18n } from '../i18n';
import { ContractSpecAgent } from './contract-spec-agent';

function getJsonOnlyRules(locale?: string): string {
  const i18n = createAgentI18n(locale);
  return [
    i18n.t('agent.json.rules.validJsonOnly'),
    i18n.t('agent.json.rules.noMarkdownFences'),
    i18n.t('agent.json.rules.noCommentary'),
    i18n.t('agent.json.rules.doubleQuotes'),
    i18n.t('agent.json.rules.noTrailingCommas'),
  ].join('\n');
}

function getDefaultSpec(locale?: string): AgentSpec {
  const i18n = createAgentI18n(locale);
  return {
    meta: {
      key: 'agent.json-runner',
      version: '1.0.0',
      description: i18n.t('agent.json.defaultDescription'),
      stability: StabilityEnum.Experimental,
      owners: ['platform.core'],
      tags: ['json', 'agent'],
    },
    instructions: i18n.t('agent.json.systemPrompt'),
    tools: [],
  };
}

export interface AgentJsonRunnerOptions {
  spec?: AgentSpec;
  model?: LanguageModel;
  provider?: ProviderConfig;
  system?: string;
  toolHandlers?: Map<string, ToolHandler>;
  maxSteps?: number;
  temperature?: number;
  locale?: string;
}

export interface AgentJsonRunner {
  generateJson: (prompt: string) => Promise<string>;
}

function resolveModel(options: AgentJsonRunnerOptions): LanguageModel {
  if (options.model) return options.model;
  if (options.provider) {
    return createProvider(options.provider).getModel();
  }
  throw new Error(
    createAgentI18n(options.locale).t('error.jsonRunner.requiresModel')
  );
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

function buildInstructions(
  base: string,
  locale?: string,
  system?: string
): string {
  return [base, getJsonOnlyRules(locale), system].filter(Boolean).join('\n\n');
}

function ensureToolHandlers(
  spec: AgentSpec,
  handlers: Map<string, ToolHandler>,
  locale?: string
): void {
  for (const tool of spec.tools) {
    if (!handlers.has(tool.name)) {
      throw new Error(
        createAgentI18n(locale).t('error.missingToolHandler', {
          name: tool.name,
        })
      );
    }
  }
}

export async function createAgentJsonRunner(
  options: AgentJsonRunnerOptions
): Promise<AgentJsonRunner> {
  const model = applyModelSettings(resolveModel(options), {
    temperature: options.temperature ?? 0,
  });
  const baseSpec = options.spec ?? getDefaultSpec(options.locale);
  const spec: AgentSpec = {
    ...baseSpec,
    locale: options.spec?.locale ?? options.locale,
    instructions: buildInstructions(
      baseSpec.instructions,
      options.locale,
      options.system
    ),
    maxSteps: options.maxSteps ?? baseSpec.maxSteps,
  };

  const toolHandlers = options.toolHandlers ?? new Map<string, ToolHandler>();
  ensureToolHandlers(spec, toolHandlers, options.locale);

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
