import * as React from 'react';
import { MarketingSection, ButtonLink } from '@lssm/lib.design-system';
import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { H2, Lead } from '@lssm/lib.ui-kit-web/ui/typography';

export function CtaSection() {
  return (
    <MarketingSection tone="gradient" padding="comfortable" align="center" maxWidth="lg">
      <VStack gap="md" align="center" className="text-center">
        <H2 className="text-4xl font-bold md:text-5xl">
          Ready to stabilize your codebase?
        </H2>
        <Lead className="text-lg text-muted-foreground">
          Start with one module. See the difference. Expand at your own pace.
        </Lead>
        <VStack
          as="div"
          gap="sm"
          align="center"
          className="sm:flex-row sm:flex sm:flex-wrap sm:justify-center sm:items-center pt-2"
        >
          <ButtonLink href="/pricing#waitlist">Join waitlist</ButtonLink>
          <ButtonLink variant="ghost" href="/contact">
            Book a call
          </ButtonLink>
        </VStack>
      </VStack>
    </MarketingSection>
  );
}
