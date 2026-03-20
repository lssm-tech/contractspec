'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import { ButtonLink, MarketingSection } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H1, Lead, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import { ChevronRight } from 'lucide-react';

const heroChips = ['Multi-Surface Sync', 'No Lock-in', 'Standard Tech'];

export function HeroMarketingSection() {
	return (
		<MarketingSection tone="gradient" padding="spacious" align="center">
			<VStack gap="lg" align="center" className="text-center">
				<Box
					as="div"
					role="presentation"
					className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider"
				>
					Open Source Core
				</Box>
				<H1 className="text-balance font-bold text-4xl leading-tight md:text-5xl">
					Stabilize your AI-generated code
				</H1>
				<Lead className="text-balance text-lg text-muted-foreground md:text-xl">
					ContractSpec is the compiler that keeps AI-written software coherent,
					safe, and regenerable. You keep your app. You own the code. One module
					at a time.
				</Lead>

				<HStack gap="md" justify="center" wrap="wrap">
					<ButtonLink
						href="/install"
						onClick={() =>
							captureAnalyticsEvent(analyticsEventNames.CTA_INSTALL_CLICK, {
								surface: 'hero',
							})
						}
					>
						Install OSS <ChevronRight size={16} />
					</ButtonLink>
					<ButtonLink
						variant="ghost"
						href="https://www.contractspec.studio"
						onClick={() =>
							captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
								surface: 'hero',
							})
						}
					>
						Try Studio
					</ButtonLink>
				</HStack>

				<HStack gap="sm" justify="center" wrap="wrap" className="pt-2">
					{heroChips.map((chip) => (
						<Box
							key={chip}
							as="div"
							role="presentation"
							className="inline-flex items-center rounded-full border border-border px-3 py-1 text-foreground text-sm"
						>
							<Small className="font-medium">{chip}</Small>
						</Box>
					))}
				</HStack>
			</VStack>
		</MarketingSection>
	);
}
