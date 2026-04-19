import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import { learningJourneyTracks } from '../tracks';

export type LearningTemplateId =
	| 'learning-journey-duo-drills'
	| 'learning-journey-quest-challenges'
	| 'learning-journey-studio-onboarding'
	| 'learning-journey-platform-tour'
	| 'learning-journey-ambient-coach'
	| 'learning-journey-crm-onboarding';

export const LEARNING_TEMPLATE_TO_TRACK: Record<LearningTemplateId, string> = {
	'learning-journey-duo-drills': 'drills_language_basics',
	'learning-journey-quest-challenges': 'money_reset_7day',
	'learning-journey-studio-onboarding': 'studio_getting_started',
	'learning-journey-platform-tour': 'platform_primitives_tour',
	'learning-journey-ambient-coach': 'money_ambient_coach',
	'learning-journey-crm-onboarding': 'crm_first_win',
};

export const LEARNING_TEMPLATE_TO_APP_TYPE: Record<
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

export function isLearningTemplate(
	templateId: string
): templateId is LearningTemplateId {
	return templateId in LEARNING_TEMPLATE_TO_TRACK;
}

export function getLearningTemplateIds(): LearningTemplateId[] {
	return Object.keys(LEARNING_TEMPLATE_TO_TRACK) as LearningTemplateId[];
}

export function getLearningTrackId(templateId: string): string | undefined {
	if (!isLearningTemplate(templateId)) return undefined;
	return LEARNING_TEMPLATE_TO_TRACK[templateId];
}

export function getLearningAppType(
	templateId: string
): 'coaching' | 'gamified' | 'onboarding' | undefined {
	if (!isLearningTemplate(templateId)) return undefined;
	return LEARNING_TEMPLATE_TO_APP_TYPE[templateId];
}

export function getLearningTrack(
	templateId: string
): JourneyTrackSpec | undefined {
	const trackId = getLearningTrackId(templateId);
	if (!trackId) return undefined;
	return learningJourneyTracks.find((track) => track.id === trackId);
}
