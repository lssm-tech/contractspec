import type { HandlerForOperationSpec } from '@contractspec/lib.contracts';
import { OpenCodeEchoCommand } from '../contracts/opencode.contracts';

/**
 * Handler for OpenCodeEchoCommand
 */
export const openCodeEchoInputHandler: HandlerForOperationSpec<
  typeof OpenCodeEchoCommand
> = async (input, _context) => {
  return {
    message: input.prompt,
  };
};
