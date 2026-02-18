'use client';

import { ButtonLink, MarketingSection } from '@contractspec/lib.design-system';
import {
  analyticsEventNames,
  captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
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
          className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase"
        >
          Open Source Core
        </Box>
        <H1 className="text-4xl leading-tight font-bold text-balance md:text-5xl">
          Stabilize your AI-generated code
        </H1>
        <Lead className="text-muted-foreground text-lg text-balance md:text-xl">
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
              className="border-border text-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm"
            >
              <Small className="font-medium">{chip}</Small>
            </Box>
          ))}
        </HStack>
      </VStack>
    </MarketingSection>
  );
}
