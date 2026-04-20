import {
	contractspecLandingStory,
	findContractspecLandingCta,
	resolveContractspecLandingCtaUrl,
} from '@contractspec/bundle.marketing/content';
import { installOp } from '@contractspec/lib.contracts-spec/install';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import {
	MobileLandingCtaResolveCommand,
	MobileLandingStoryGetQuery,
} from '../contracts';

export interface LandingStoryResult {
	story: Record<string, unknown>;
}

export interface LandingCtaResolveResult {
	id: string;
	label: string;
	url: string;
	kind: 'internal' | 'external';
}

export function createMobileLandingRegistry(): OperationSpecRegistry {
	const reg = new OperationSpecRegistry();

	installOp(
		reg,
		MobileLandingStoryGetQuery,
		async (_input, _ctx: HandlerCtx) => {
			return {
				story: contractspecLandingStory as unknown as Record<string, unknown>,
			} satisfies LandingStoryResult;
		}
	);

	installOp(
		reg,
		MobileLandingCtaResolveCommand,
		async (input: { id: string }, _ctx: HandlerCtx) => {
			const cta = findContractspecLandingCta(input.id);
			if (!cta) {
				throw new Error(`Unknown landing CTA: ${input.id}`);
			}
			return {
				id: cta.id,
				label: cta.label,
				url: resolveContractspecLandingCtaUrl(cta),
				kind: cta.kind,
			} satisfies LandingCtaResolveResult;
		}
	);

	return reg;
}

export const mobileLandingRegistry = createMobileLandingRegistry();
