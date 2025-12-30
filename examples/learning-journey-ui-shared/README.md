# @contractspec/example.learning-journey-ui-shared

Website: https://contractspec.io/


Shared UI components and hooks for learning journey mini-apps.

## Components

- **XpBar** - Progress bar showing XP earned vs total
- **StreakCounter** - Display streak days with fire icon
- **BadgeDisplay** - Grid of earned badges
- **ViewTabs** - Tab navigation between views

## Hooks

- **useLearningProgress** - Manage learning progress state for a track

## Usage

```tsx
import {
  XpBar,
  StreakCounter,
  BadgeDisplay,
  ViewTabs,
  useLearningProgress,
} from '@contractspec/example.learning-journey-ui-shared';

function MyLearningApp({ track }) {
  const { progress, stats, completeStep } = useLearningProgress(track);

  return (
    <div>
      <XpBar current={progress.xpEarned} max={stats.totalXp} />
      <StreakCounter days={progress.streakDays} />
      <BadgeDisplay badges={progress.badges} />
    </div>
  );
}
```

