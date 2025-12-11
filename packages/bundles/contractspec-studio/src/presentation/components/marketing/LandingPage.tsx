'use client';

import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { HeroMarketingSection } from './sections/HeroMarketingSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { FearsSection } from './sections/FearsSection';
import { CorePositioningSection } from './sections/CorePositioningSection';
import { AudienceSection } from './sections/AudienceSection';
import { OutputsSection } from './sections/OutputsSection';
import { StepsSection } from './sections/StepsSection';
import { DevelopersSection } from './sections/DevelopersSection';
import { CtaSection } from './sections/CtaSection';

export function LandingPage() {
  return (
    <VStack as="main" gap="none">
      <HeroMarketingSection />
      <ProblemSection />
      <SolutionSection />
      <FearsSection />
      <CorePositioningSection />
      <AudienceSection />
      <OutputsSection />
      <StepsSection />
      <DevelopersSection />
      <CtaSection />
    </VStack>
  );
}
