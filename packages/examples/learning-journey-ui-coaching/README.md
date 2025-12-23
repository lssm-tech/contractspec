# @lssm/example.learning-journey-ui-coaching

Contextual coaching UI with tip cards and engagement tracking.

## Features

- **Overview**: Active tips carousel with quick stats
- **Steps**: Stacked tip cards with action/dismiss buttons
- **Progress**: Engagement donut chart, streak counter, XP bar
- **Timeline**: Reverse-chronological feed of tip activity

## Usage

```tsx
import { CoachingMiniApp } from '@lssm/example.learning-journey-ui-coaching';
import { moneyAmbientCoachTrack } from '@lssm/example.learning-journey-ambient-coach/track';

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
