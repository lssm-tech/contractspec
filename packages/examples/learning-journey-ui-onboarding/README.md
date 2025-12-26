# @lssm/example.learning-journey-ui-onboarding

Website: https://contractspec.io/


Developer onboarding UI with checklists and journey maps.

## Features

- **Overview**: Welcome banner with progress summary and "Get Started" CTA
- **Steps**: Accordion-style checklist with expandable instructions
- **Progress**: Circular progress indicator, XP bar, and step breakdown
- **Timeline**: Journey map with surface icons and detailed step timeline

## Usage

```tsx
import { OnboardingMiniApp } from '@lssm/example.learning-journey-ui-onboarding';
import { studioGettingStartedTrack } from '@lssm/example.learning-journey-studio-onboarding/track';

function MyApp() {
  return (
    <OnboardingMiniApp
      track={studioGettingStartedTrack}
      initialView="overview"
    />
  );
}
```

## Components

- **StepChecklist** - Expandable accordion step with completion action
- **CodeSnippet** - Inline code display with copy button
- **JourneyMap** - Horizontal connected node journey visualization
