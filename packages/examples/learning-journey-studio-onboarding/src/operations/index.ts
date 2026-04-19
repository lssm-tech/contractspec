import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { JourneyTrackModel } from '@contractspec/module.learning-journey/contracts/journey';

import { studioGettingStartedTrack } from '../track';

const OWNERS = ['examples.learning-journey.studio-onboarding'] as const;
export const StudioJourneyTrackModel = JourneyTrackModel;

const TrackResponseModel = defineSchemaModel({
	name: 'StudioOnboardingTrackResponse',
	description: 'Response wrapper for studio onboarding track',
	fields: {
		track: { type: StudioJourneyTrackModel, isOptional: false },
	},
});

const RecordDemoEventInput = defineSchemaModel({
	name: 'StudioOnboardingRecordEventInput',
	description: 'Emit a demo event to advance Studio onboarding steps',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

const SuccessModel = defineSchemaModel({
	name: 'StudioOnboardingSuccess',
	description: 'Generic success response',
	fields: {
		success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

export const GetStudioOnboardingTrack = defineQuery({
	meta: {
		key: 'learningJourney.studioOnboarding.getTrack',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'onboarding', 'studio'],
		description: 'Fetch the Studio onboarding track definition.',
		goal: 'Expose track metadata to UIs and templates.',
		context: 'Called by Studio/Playground to render journey steps.',
	},
	io: {
		input: defineSchemaModel({
			name: 'StudioOnboardingTrackInput',
			description: 'Track input',
			fields: {},
		}),
		output: TrackResponseModel,
	},
	policy: { auth: 'user' },
});

export const RecordStudioOnboardingEvent = defineCommand({
	meta: {
		key: 'learningJourney.studioOnboarding.recordEvent',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'onboarding', 'studio'],
		description: 'Record an event to advance Studio onboarding progress.',
		goal: 'Advance steps via domain events in demo/sandbox contexts.',
		context:
			'Called by handlers or demo scripts to emit step completion events.',
	},
	io: {
		input: RecordDemoEventInput,
		output: SuccessModel,
	},
	policy: { auth: 'user' },
});

export const studioOnboardingContracts = {
	GetStudioOnboardingTrack,
	RecordStudioOnboardingEvent,
	track: studioGettingStartedTrack,
};
