import type { HandlerForOperationSpec } from '@contractspec/lib.contracts-spec';
import { OpenCodeEchoInputSpec } from '../contracts/open-code-echo-input.contracts';

/**
 * Handler for OpenCodeEchoInput
 */
export const openCodeEchoInputHandler: HandlerForOperationSpec<
	typeof OpenCodeEchoInputSpec
> = async (
  input
) => {
  return {
    message: input.prompt,
  };
};
