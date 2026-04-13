import type { FormatterType } from '@contractspec/lib.contracts-spec';
import type { AuthoringTargetId } from '@contractspec/module.workspace';

export interface CreateOptions {
	type?: AuthoringTargetId;
	ai?: boolean;
	provider?: string;
	model?: string;
	outputDir?: string;
	/** Skip formatting generated files */
	noFormat?: boolean;
	/** Override formatter type */
	formatter?: FormatterType;
}
