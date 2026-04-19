import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { JourneyTrackModel } from '@contractspec/module.learning-journey/contracts/journey';

import { platformPrimitivesTourTrack } from '../track';

const OWNERS = ['examples.learning-journey.platform-tour'] as const;
export const PlatformJourneyTrackModel = JourneyTrackModel;

const TrackResponseModel = defineSchemaModel({
	name: 'PlatformTourTrackResponse',
	description: 'Response wrapper for platform tour track',
	fields: {
		track: { type: PlatformJourneyTrackModel, isOptional: false },
	},
});

const RecordDemoEventInput = defineSchemaModel({
	name: 'PlatformTourRecordEventInput',
	description: 'Emit a demo event to advance platform tour steps',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

const SuccessModel = defineSchemaModel({
	name: 'PlatformTourSuccess',
	description: 'Generic success response',
	fields: {
		success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

export const GetPlatformTourTrack = defineQuery({
	meta: {
		key: 'learningJourney.platformTour.getTrack',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'platform', 'tour'],
		description: 'Fetch platform primitives tour track definition.',
		goal: 'Expose track metadata to UIs and templates.',
		context: 'Called by Studio/Playground to render journey steps.',
	},
	io: {
		input: defineSchemaModel({
			name: 'PlatformTourTrackInput',
			description: 'Track input',
			fields: {},
		}),
		output: TrackResponseModel,
	},
	policy: { auth: 'user' },
});

export const RecordPlatformTourEvent = defineCommand({
	meta: {
		key: 'learningJourney.platformTour.recordEvent',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'platform', 'tour'],
		description: 'Record an event to advance platform tour progress.',
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

export const platformTourContracts = {
	GetPlatformTourTrack,
	RecordPlatformTourEvent,
	track: platformPrimitivesTourTrack,
};
