'use client';

import { ButtonLink, MarketingSection } from '@lssm/lib.design-system';
import { Box, HStack, VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { H1, Lead, Small } from '@lssm/lib.ui-kit-web/ui/typography';
import { Calendar, ChevronRight } from 'lucide-react';

const heroChips = ['Multi-Surface Sync', 'No Lock-in', 'Standard Tech'];

export function HeroMarketingSection() {
  return (
    <MarketingSection tone="gradient" padding="spacious" align="center">
      <VStack gap="lg" align="center" className="text-center">
        <H1 className="text-4xl leading-tight font-bold text-balance md:text-5xl">
          Stabilize your AI-generated code
        </H1>
        <Lead className="text-muted-foreground text-lg text-balance md:text-xl">
          ContractSpec is the compiler that keeps AI-written software coherent,
          safe, and regenerable. You keep your app. You own the code. One module
          at a time.
        </Lead>

        <HStack gap="md" justify="center" wrap="wrap">
          <ButtonLink href="/pricing#waitlist">
            Join waitlist <ChevronRight size={16} />
          </ButtonLink>
          <ButtonLink variant="ghost" href="/contact">
            <Calendar size={16} />
            Book a call
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
