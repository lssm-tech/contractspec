import * as React from 'react';
import { MarketingSection, ButtonLink } from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H2, Lead, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import { ChevronRight } from 'lucide-react';

export function CorePositioningSection() {
  return (
    <MarketingSection
      tone="gradient"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="md" align="center">
        <H2 className="text-center text-3xl font-bold md:text-4xl">
          You keep your app.
          <br />
          We stabilize it, one module at a time.
        </H2>
        <Lead className="text-center">
          You own the code. It&apos;s standard tech.
          <br />
          <Small className="font-semibold text-violet-400">
            We&apos;re the compiler, not the prison.
          </Small>
        </Lead>
        <VStack
          as="div"
          gap="sm"
          align="center"
          className="pt-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <ButtonLink href="/pricing#waitlist">
            Join waitlist <ChevronRight size={16} />
          </ButtonLink>
          <ButtonLink variant="ghost" href="/contact">
            Book a call
          </ButtonLink>
        </VStack>
      </VStack>
    </MarketingSection>
  );
}
