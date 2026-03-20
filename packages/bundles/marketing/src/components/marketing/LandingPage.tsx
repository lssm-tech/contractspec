'use client';

import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { AudienceSection } from './sections/AudienceSection';
import { CorePositioningSection } from './sections/CorePositioningSection';
import { CtaSection } from './sections/CtaSection';
import { DevelopersSection } from './sections/DevelopersSection';
import { FearsSection } from './sections/FearsSection';
import { HeroMarketingSection } from './sections/HeroMarketingSection';
import { OutputsSection } from './sections/OutputsSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { StepsSection } from './sections/StepsSection';

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
