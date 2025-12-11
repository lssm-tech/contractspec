import * as React from 'react';
import { MarketingSection, ButtonLink } from '@lssm/lib.design-system';
import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { H2, Lead, Small } from '@lssm/lib.ui-kit-web/ui/typography';
import { ChevronRight } from 'lucide-react';

export function CorePositioningSection() {
  return (
    <MarketingSection tone="gradient" padding="comfortable" align="center" maxWidth="lg">
      <VStack gap="md" align="center">
        <H2 className="text-3xl font-bold md:text-4xl text-center">
          You keep your app.
          <br />
          We stabilize it, one module at a time.
        </H2>
        <Lead className="text-center">
          You own the code. It&apos;s standard tech.
          <br />
          <Small className="text-violet-400 font-semibold">
            We&apos;re the compiler, not the prison.
          </Small>
        </Lead>
        <VStack
          as="div"
          gap="sm"
          align="center"
          className="sm:flex-row sm:flex sm:flex-wrap sm:justify-center sm:items-center pt-2"
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
