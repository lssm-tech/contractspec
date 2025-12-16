import type { PromptRegistry } from '@lssm/lib.contracts';
import { integrityFixPrompt } from './integrity-fix';
import { specsCreatePrompt } from './specs-create';

export function registerMcpLocalPrompts(reg: PromptRegistry): void {
  reg.register(integrityFixPrompt());
  reg.register(specsCreatePrompt());
}
