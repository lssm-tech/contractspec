export const LEARNING_EVENTS = {
  DRILL_CARD_ANSWERED: 'drill.card.answered',
  DRILL_SESSION_COMPLETED: 'drill.session.completed',
  DRILL_CARD_MASTERED: 'drill.card.mastered',

  COACH_TIP_TRIGGERED: 'coach.tip.triggered',
  COACH_TIP_SHOWN: 'coach.tip.shown',
  COACH_TIP_ACKNOWLEDGED: 'coach.tip.acknowledged',
  COACH_TIP_ACTION_TAKEN: 'coach.tip.actionTaken',

  QUEST_STARTED: 'quest.started',
  QUEST_STEP_COMPLETED: 'quest.step.completed',
} as const;

export type LearningEventName =
  (typeof LEARNING_EVENTS)[keyof typeof LEARNING_EVENTS];


