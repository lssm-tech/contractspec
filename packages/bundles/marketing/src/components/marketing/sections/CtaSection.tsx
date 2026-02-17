import * as React from 'react';
import { MarketingSection, ButtonLink } from '@contractspec/lib.design-system';
import {
  analyticsEventNames,
  captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { H2, Lead } from '@contractspec/lib.ui-kit-web/ui/typography';

export function CtaSection() {
  return (
    <MarketingSection
      tone="gradient"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="md" align="center" className="text-center">
        <H2 className="text-4xl font-bold md:text-5xl">
          Ready to stabilize your codebase?
        </H2>
        <Lead className="text-muted-foreground text-lg">
          Start with one module. See the difference. Expand at your own pace.
        </Lead>
        <VStack
          as="div"
          gap="sm"
          align="center"
          className="pt-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <ButtonLink
            href="https://app.contractspec.studio"
            onClick={() =>
              captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
                surface: 'cta-section',
              })
            }
          >
            Try Studio
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            href="/contact"
            onClick={() =>
              captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
                surface: 'cta-section',
                variant: 'contact',
              })
            }
          >
            Book a call
          </ButtonLink>
        </VStack>
      </VStack>
    </MarketingSection>
  );
}
