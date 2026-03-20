/**
 * Spec Creation Service
 *
 * Unifies manual and AI-assisted spec creation.
 */

import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import { AIGenerator } from './ai-generator';
import * as templates from './templates';

export class SpecCreatorService {
	public readonly ai: AIGenerator;
	public readonly templates = templates;

	constructor(config: ResolvedContractsrcConfig) {
		this.ai = new AIGenerator(config);
	}
}

export * from './ai-generator';
export * from './templates';

export function createSpecCreator(
	config: ResolvedContractsrcConfig
): SpecCreatorService {
	return new SpecCreatorService(config);
}
