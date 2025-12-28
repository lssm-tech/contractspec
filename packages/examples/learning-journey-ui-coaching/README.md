# @contractspec/example.learning-journey-ui-coaching

Website: https://contractspec.io/


Contextual coaching UI with tip cards and engagement tracking.

## Features

- **Overview**: Active tips carousel with quick stats
- **Steps**: Stacked tip cards with action/dismiss buttons
- **Progress**: Engagement donut chart, streak counter, XP bar
- **Timeline**: Reverse-chronological feed of tip activity

## Usage

```tsx
import { CoachingMiniApp } from '@contractspec/example.learning-journey-ui-coaching';
import { moneyAmbientCoachTrack } from '@contractspec/example.learning-journey-ambient-coach/track';

function MyApp() {
  return (
    <CoachingMiniApp track={moneyAmbientCoachTrack} initialView="overview" />
  );
}
```

## Components

- **TipCard** - Individual coaching tip with action/dismiss options
- **EngagementMeter** - Donut chart showing actioned/acknowledged/pending
- **TipFeed** - Timeline feed of tip activity
