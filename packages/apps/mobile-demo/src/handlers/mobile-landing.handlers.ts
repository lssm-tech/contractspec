import {
	CONTRACTSPEC_SITE_BASE_URL,
	contractspecLandingStory,
	findContractspecLandingCtaById,
	findContractspecLandingPage,
	type LandingNavigationItem,
	type LandingPageContent,
	listContractspecLandingNavigation,
	resolveContractspecLandingCta,
} from '@contractspec/bundle.marketing/content';
import { installOp } from '@contractspec/lib.contracts-spec/install';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import { listExamplePreviewSurfaces } from '@contractspec/module.examples/catalog';
import {
	MobileLandingCtaResolveCommand,
	MobileLandingExamplesListQuery,
	MobileLandingNavigationListQuery,
	MobileLandingPageGetQuery,
	MobileLandingStoryGetQuery,
} from '../contracts';

export interface LandingStoryResult {
	story: Record<string, unknown>;
}

export interface LandingNavigationResult {
	navigation: { items: LandingNavigationItem[] };
}

export interface LandingPageResult {
	page: LandingPageContent;
}

export interface MobileExamplePreviewItem {
	key: string;
	title: string;
	summary: string;
	tags: readonly string[];
	visibility: string;
	stability: string;
	packageName: string;
	docsUrl: string;
	sandboxUrl: string | null;
	llmsUrl: string | null;
	sourceUrl: string | null;
	supportsInlinePreview: boolean;
}

export interface MobileExamplesListResult {
	examples: MobileExamplePreviewItem[];
}

export interface LandingCtaResolveResult {
	id: string;
	label: string;
	href: string;
	url: string;
	kind: 'native' | 'internal' | 'external';
	route?: string;
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
		MobileLandingNavigationListQuery,
		async (_input, _ctx: HandlerCtx) => {
			return {
				navigation: listContractspecLandingNavigation() as unknown as Record<
					string,
					unknown
				>,
			};
		}
	);

	installOp(
		reg,
		MobileLandingPageGetQuery,
		async (input: { key: string }, _ctx: HandlerCtx) => {
			const page = findContractspecLandingPage(input.key);
			if (!page) {
				throw new Error(`Unknown landing page: ${input.key}`);
			}
			return {
				page: page as unknown as Record<string, unknown>,
			};
		}
	);

	installOp(
		reg,
		MobileLandingExamplesListQuery,
		async (_input, _ctx: HandlerCtx) => {
			return {
				examples: listExamplePreviewSurfaces().map((surface) => ({
					key: surface.key,
					title: surface.title,
					summary: surface.description,
					tags: surface.tags,
					visibility: surface.visibility,
					stability: surface.stability,
					packageName: surface.packageName,
					docsUrl: buildSiteUrl(surface.docsHref),
					sandboxUrl: surface.sandboxHref
						? buildSiteUrl(surface.sandboxHref)
						: null,
					llmsUrl: surface.llmsHref ? buildSiteUrl(surface.llmsHref) : null,
					sourceUrl: surface.sourceHref,
					supportsInlinePreview: surface.supportsInlinePreview,
				})),
			} satisfies MobileExamplesListResult;
		}
	);

	installOp(
		reg,
		MobileLandingCtaResolveCommand,
		async (input: { id: string }, _ctx: HandlerCtx) => {
			const cta = findContractspecLandingCtaById(input.id);
			if (!cta) {
				throw new Error(`Unknown landing CTA: ${input.id}`);
			}
			return resolveContractspecLandingCta(
				cta
			) satisfies LandingCtaResolveResult;
		}
	);

	return reg;
}

export const mobileLandingRegistry = createMobileLandingRegistry();

function buildSiteUrl(path: string): string {
	return new URL(path, CONTRACTSPEC_SITE_BASE_URL).toString();
}
