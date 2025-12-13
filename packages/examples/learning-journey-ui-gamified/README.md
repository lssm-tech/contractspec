# @lssm/example.learning-journey-ui-gamified

Duolingo-style gamified learning UI for drills and quests.

## Features

- **Overview**: Hero card with XP, streak, and next challenge preview
- **Steps**: Interactive flashcard-style step cards
- **Progress**: Mastery rings, XP bar, and badge display
- **Timeline**: Day calendar for quests, step timeline for drills

## Usage

```tsx
import { GamifiedMiniApp } from '@lssm/example.learning-journey-ui-gamified';
import { drillsLanguageBasicsTrack } from '@lssm/example.learning-journey-duo-drills/track';

function MyApp() {
  return (
    <GamifiedMiniApp track={drillsLanguageBasicsTrack} initialView="overview" />
  );
}
```

## Components

- **FlashCard** - Tappable card that reveals action on flip
- **MasteryRing** - Circular progress indicator
- **DayCalendar** - 7-day grid for quest progress
