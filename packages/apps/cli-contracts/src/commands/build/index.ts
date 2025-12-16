import { buildCommand } from './build-command';
import { detectSpecType } from './spec-detect';
import { ensureTrailingNewline, stripCode } from './agent-generation';

export { buildCommand };

export const __buildInternals = {
  detectSpecType,
  stripCode,
  ensureTrailingNewline,
};

