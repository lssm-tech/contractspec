import type { PromptRegistry } from '@lssm/lib.contracts';
import { integrityFixPrompt } from './integrity-fix';
import { specsCreatePrompt } from './specs-create';
import { llmImplementPrompt } from './llm-implement';
import { llmVerifyPrompt } from './llm-verify';
import { llmFixPrompt } from './llm-fix';

export function registerMcpLocalPrompts(reg: PromptRegistry): void {
  reg.register(integrityFixPrompt());
  reg.register(specsCreatePrompt());
  reg.register(llmImplementPrompt());
  reg.register(llmVerifyPrompt());
  reg.register(llmFixPrompt());
}
