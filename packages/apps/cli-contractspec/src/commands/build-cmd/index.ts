import { ensureTrailingNewline, stripCode } from './agent-generation';
import { buildCommand } from './build-command';
import { detectSpecType } from './spec-detect';

export { buildCommand };

export const __buildInternals = {
	detectSpecType,
	stripCode,
	ensureTrailingNewline,
};
