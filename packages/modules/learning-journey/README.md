# @lssm/modules.learning-journey

Comprehensive learning journey engine for ContractSpec applications.

## Overview

This module provides a complete learning platform engine that supports multiple use cases:

- **Product Onboarding**: Event-driven completion tied to product actions
- **Learning Management System (LMS)**: Courses, modules, lessons, certifications
- **Flashcards & Spaced Repetition (SRS)**: SM-2 algorithm for optimal retention
- **Quizzes & Assessments**: Multiple question types, skill tracking
- **Gamification**: XP, streaks, achievements, leaderboards (Duolingo-style)
- **AI-Powered Personalization**: Adaptive paths, recommendations, gap detection

## Features

### Core Learning Structure

- **Courses**: Structured learning content with prerequisites and difficulty levels
- **Modules**: Groups of related lessons within a course
- **Lessons**: Individual learning units (content, video, interactive, quiz)
- **Progress Tracking**: Track completion, time spent, scores

### Product Onboarding

- **Onboarding Tracks**: Product-specific onboarding journeys
- **Event-Driven Completion**: Steps auto-complete when product events fire
- **Example**: "Create your first project" completes on `ProjectCreated` event

### Flashcards & Spaced Repetition

- **Decks & Cards**: Organize flashcards by topic
- **SM-2 Algorithm**: Optimized review scheduling
- **Review Sessions**: Get cards due for review
- **Retention Metrics**: Track long-term retention

### Quizzes & Assessments

- **Question Types**: Multiple choice, true/false, fill-in-blank, matching
- **Timed Quizzes**: Optional time limits
- **Skill Assessment**: Map quiz performance to skills

### Gamification

- **Experience Points (XP)**: Earn XP for completing activities
- **Streaks**: Maintain daily learning streaks
- **Achievements**: Unlock achievements for milestones
- **Leaderboards**: Compete with others (daily/weekly/monthly)
- **Lives System**: Optional hearts/lives for quiz attempts

### AI Personalization

- **Learner Profiles**: Track learning style, preferences, goals
- **Skill Maps**: Map proficiency across skills
- **Adaptive Paths**: Generate personalized learning sequences
- **Recommendations**: AI-powered content suggestions
- **Gap Detection**: Identify and address learning gaps

## Entities

### Course Structure
- `Course`, `Module`, `Lesson`, `LessonContent`

### Learner & Progress
- `Learner`, `Enrollment`, `LessonProgress`, `ModuleCompletion`, `Certificate`

### Onboarding
- `OnboardingTrack`, `OnboardingStep`, `OnboardingProgress`

### Flashcards
- `Deck`, `Card`, `CardReview`, `CardSchedule`

### Quizzes
- `Quiz`, `Question`, `QuestionOption`, `QuizAttempt`, `SkillAssessment`

### Gamification
- `Achievement`, `LearnerAchievement`, `Streak`, `DailyGoal`, `LeaderboardEntry`, `Heart`

### AI
- `LearnerProfile`, `SkillMap`, `LearningPath`, `Recommendation`

## Engines

### Spaced Repetition Engine (SRS)

```typescript
import { SRSEngine } from '@lssm/modules.learning-journey/engines/srs';

const engine = new SRSEngine();
const nextReview = engine.calculateNextReview({
  rating: 'good', // again, hard, good, easy
  currentInterval: 1,
  easeFactor: 2.5,
  repetitions: 3,
});
```

### XP Engine

```typescript
import { XPEngine } from '@lssm/modules.learning-journey/engines/xp';

const engine = new XPEngine();
const xp = engine.calculate({
  activity: 'lesson_complete',
  score: 95,
  streakBonus: true,
});
```

### Streak Engine

```typescript
import { StreakEngine } from '@lssm/modules.learning-journey/engines/streak';

const engine = new StreakEngine();
const streak = engine.update({
  lastActivityAt: new Date('2024-01-14'),
  currentStreak: 5,
});
```

## Usage

```typescript
import { 
  CourseEntity,
  LearnerEntity,
  SRSEngine,
} from '@lssm/modules.learning-journey';

// Enroll learner in course
await enrollmentService.enroll({
  learnerId: 'learner-123',
  courseId: 'course-456',
});

// Complete a lesson
await progressService.completeLesson({
  learnerId: 'learner-123',
  lessonId: 'lesson-789',
  score: 95,
});

// Get flashcards due for review
const cards = await flashcardService.getDueCards({
  learnerId: 'learner-123',
  limit: 20,
});

// Submit flashcard review
await flashcardService.submitReview({
  learnerId: 'learner-123',
  cardId: 'card-abc',
  rating: 'good',
});
```

## Integration

This module integrates with:

- `@lssm/lib.identity-rbac` - Learner identity
- `@lssm/lib.files` - Media attachments
- `@lssm/lib.jobs` - Scheduled reminders, streak checks
- `@lssm/lib.ai-agent` - AI-powered features
- `@lssm/modules.notifications` - Learning reminders

## Schema Contribution

```typescript
import { learningJourneySchemaContribution } from '@lssm/modules.learning-journey';

export const schemaComposition = {
  modules: [
    learningJourneySchemaContribution,
    // ... other modules
  ],
};
```





