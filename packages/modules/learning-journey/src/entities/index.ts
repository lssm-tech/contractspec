import type { ModuleSchemaContribution } from '@lssm/lib.schema';

// Course entities
export * from './course';
import { courseEntities, courseEnums } from './course';

// Learner entities
export * from './learner';
import { learnerEntities, learnerEnums } from './learner';

// Onboarding entities
export * from './onboarding';
import { onboardingEntities, onboardingEnums } from './onboarding';

// Flashcard entities
export * from './flashcard';
import { flashcardEntities, flashcardEnums } from './flashcard';

// Quiz entities
export * from './quiz';
import { quizEntities, quizEnums } from './quiz';

// Gamification entities
export * from './gamification';
import { gamificationEntities, gamificationEnums } from './gamification';

// AI entities
export * from './ai';
import { aiEntities, aiEnums } from './ai';

/**
 * All learning journey entities for schema composition.
 */
export const learningJourneyEntities = [
  ...courseEntities,
  ...learnerEntities,
  ...onboardingEntities,
  ...flashcardEntities,
  ...quizEntities,
  ...gamificationEntities,
  ...aiEntities,
];

/**
 * All learning journey enums.
 */
export const learningJourneyEnums = [
  ...courseEnums,
  ...learnerEnums,
  ...onboardingEnums,
  ...flashcardEnums,
  ...quizEnums,
  ...gamificationEnums,
  ...aiEnums,
];

/**
 * Module schema contribution for learning journey.
 */
export const learningJourneySchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/module.learning-journey',
  entities: learningJourneyEntities,
  enums: learningJourneyEnums,
};
