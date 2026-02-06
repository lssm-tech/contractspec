import type { LanguageModel } from 'ai';
import { generateText } from 'ai';
import type { ProductIntentModelRunner } from '@contractspec/module.product-intent-core';

export interface AiProductIntentRunnerOptions {
  model: LanguageModel;
  system?: string;
  generateTextFn?: AiGenerateTextFn;
}

export type AiGenerateTextFn = (params: {
  model: LanguageModel;
  system?: string;
  prompt: string;
}) => Promise<{ text: string }>;

export const createAiProductIntentRunner = (
  options: AiProductIntentRunnerOptions
): ProductIntentModelRunner => {
  const generate: AiGenerateTextFn =
    options.generateTextFn ?? (async (params) => generateText(params));
  return {
    async generateJson(prompt: string) {
      const result = await generate({
        model: options.model,
        system: options.system,
        prompt,
      });
      return result.text;
    },
  };
};
