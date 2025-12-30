'use client';

import { useMemo } from 'react';
import { GamifiedMiniApp } from '@contractspec/example.learning-journey-ui-gamified';
import { OnboardingMiniApp } from '@contractspec/example.learning-journey-ui-onboarding';
import { CoachingMiniApp } from '@contractspec/example.learning-journey-ui-coaching';
import type { LearningView } from '@contractspec/example.learning-journey-ui-shared';
import { learningJourneyTracks } from '../tracks';

/** Template IDs that map to learning journey tracks */
type LearningTemplateId =
  | 'learning-journey-duo-drills'
  | 'learning-journey-quest-challenges'
  | 'learning-journey-studio-onboarding'
  | 'learning-journey-platform-tour'
  | 'learning-journey-ambient-coach'
  | 'learning-journey-crm-onboarding';

/** Map template IDs to track IDs */
const TEMPLATE_TO_TRACK: Record<LearningTemplateId, string> = {
  'learning-journey-duo-drills': 'drills_language_basics',
  'learning-journey-quest-challenges': 'money_reset_7day',
  'learning-journey-studio-onboarding': 'studio_getting_started',
  'learning-journey-platform-tour': 'platform_tour',
  'learning-journey-ambient-coach': 'money_ambient_coach',
  'learning-journey-crm-onboarding': 'crm_first_win',
};

/** Map template IDs to mini-app type */
const TEMPLATE_TO_APP_TYPE: Record<
  LearningTemplateId,
  'gamified' | 'onboarding' | 'coaching'
> = {
  'learning-journey-duo-drills': 'gamified',
  'learning-journey-quest-challenges': 'gamified',
  'learning-journey-studio-onboarding': 'onboarding',
  'learning-journey-platform-tour': 'onboarding',
  'learning-journey-ambient-coach': 'coaching',
  'learning-journey-crm-onboarding': 'coaching',
};

interface LearningMiniAppProps {
  templateId: string;
  initialView?: LearningView;
  onViewChange?: (view: LearningView) => void;
}

/** Router component that picks the correct mini-app based on template ID */
export function LearningMiniApp({
  templateId,
  initialView = 'overview',
  onViewChange,
}: LearningMiniAppProps) {
  // Find the track for this template
  const track = useMemo(() => {
    const trackId = TEMPLATE_TO_TRACK[templateId as LearningTemplateId];
    if (!trackId) return null;
    return learningJourneyTracks.find((t) => t.id === trackId);
  }, [templateId]);

  // Determine app type
  const appType = TEMPLATE_TO_APP_TYPE[templateId as LearningTemplateId];

  if (!track) {
    return (
      <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-6 text-center">
        <p className="text-amber-500">
          Unknown learning template: {templateId}
        </p>
      </div>
    );
  }

  // Render the appropriate mini-app
  switch (appType) {
    case 'gamified':
      return (
        <GamifiedMiniApp
          track={track}
          initialView={initialView}
          onViewChange={onViewChange}
        />
      );
    case 'onboarding':
      return (
        <OnboardingMiniApp
          track={track}
          initialView={initialView}
          onViewChange={onViewChange}
        />
      );
    case 'coaching':
      return (
        <CoachingMiniApp
          track={track}
          initialView={initialView}
          onViewChange={onViewChange}
        />
      );
    default:
      return (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
          <p className="text-red-500">
            Unknown app type for template: {templateId}
          </p>
        </div>
      );
  }
}

/** Check if a template ID is a learning journey template */
export function isLearningTemplate(
  templateId: string
): templateId is LearningTemplateId {
  return templateId in TEMPLATE_TO_TRACK;
}

/** Get all learning template IDs */
export function getLearningTemplateIds(): LearningTemplateId[] {
  return Object.keys(TEMPLATE_TO_TRACK) as LearningTemplateId[];
}
