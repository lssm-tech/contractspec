import { ambientCoachTracks } from '@contractspec/example.learning-journey-ambient-coach/track';
import { crmLearningTracks } from '@contractspec/example.learning-journey-crm-onboarding/track';
import { drillTracks } from '@contractspec/example.learning-journey-duo-drills/track';
import { platformLearningTracks } from '@contractspec/example.learning-journey-platform-tour/track';
import { questTracks } from '@contractspec/example.learning-journey-quest-challenges/track';
import { studioLearningTracks } from '@contractspec/example.learning-journey-studio-onboarding/track';
import type {
	JourneyAvailabilitySpec,
	JourneyConditionSpec,
	JourneyStepSpec,
	JourneyTrackSpec,
} from '@contractspec/module.learning-journey/track-spec';

export interface JourneyStepDto {
	id: string;
	title: string;
	description?: string;
	completionEvent: string;
	completionCondition?: JourneyConditionSpec;
	xpReward?: number;
	isRequired?: boolean;
	canSkip?: boolean;
	actionUrl?: string;
	actionLabel?: string;
	availability?: JourneyAvailabilitySpec;
	metadata?: Record<string, unknown>;
}

export interface JourneyTrackDto {
	id: string;
	name: string;
	description?: string;
	productId?: string;
	targetUserSegment?: string;
	targetRole?: string;
	totalXp?: number;
	streakRule?: JourneyTrackSpec['streakRule'];
	completionRewards?: JourneyTrackSpec['completionRewards'];
	steps: JourneyStepDto[];
	metadata?: Record<string, unknown>;
}

const mapStep = (step: JourneyStepSpec): JourneyStepDto => ({
	id: step.id,
	title: step.title,
	description: step.description,
	completionEvent: step.completion.eventName,
	completionCondition: step.completion,
	xpReward: step.xpReward,
	isRequired: step.isRequired,
	canSkip: step.canSkip,
	actionUrl: step.actionUrl,
	actionLabel: step.actionLabel,
	availability: step.availability,
	metadata: step.metadata,
});

export const mapTrackSpecToDto = (
	track: JourneyTrackSpec
): JourneyTrackDto => ({
	id: track.id,
	name: track.name,
	description: track.description,
	productId: track.productId,
	targetUserSegment: track.targetUserSegment,
	targetRole: track.targetRole,
	totalXp: track.totalXp,
	streakRule: track.streakRule,
	completionRewards: track.completionRewards,
	steps: track.steps.map(mapStep),
	metadata: track.metadata,
});

export const learningJourneyTracks: JourneyTrackSpec[] = [
	...studioLearningTracks,
	...platformLearningTracks,
	...crmLearningTracks,
	...drillTracks,
	...ambientCoachTracks,
	...questTracks,
];

export const journeyTrackCatalog: JourneyTrackDto[] =
	learningJourneyTracks.map(mapTrackSpecToDto);

export {
	crmLearningTracks,
	mapStep,
	platformLearningTracks,
	studioLearningTracks,
};
