import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { JourneyTrackModel } from '@contractspec/module.learning-journey/contracts/journey';

import { crmFirstWinTrack } from '../track';

const OWNERS = ['examples.learning-journey.crm-onboarding'] as const;
export const CrmJourneyTrackModel = JourneyTrackModel;

const TrackResponseModel = defineSchemaModel({
	name: 'CrmOnboardingTrackResponse',
	description: 'Response wrapper for CRM onboarding track',
	fields: {
		track: { type: CrmJourneyTrackModel, isOptional: false },
	},
});

const RecordDemoEventInput = defineSchemaModel({
	name: 'CrmOnboardingRecordEventInput',
	description: 'Emit a demo event to advance CRM onboarding steps',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

const SuccessModel = defineSchemaModel({
	name: 'CrmOnboardingSuccess',
	description: 'Generic success response',
	fields: {
		success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

export const GetCrmOnboardingTrack = defineQuery({
	meta: {
		key: 'learningJourney.crmOnboarding.getTrack',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'crm', 'onboarding'],
		description: 'Fetch CRM first win track definition.',
		goal: 'Expose track metadata to UIs and templates.',
		context: 'Called by Studio/Playground to render journey steps.',
	},
	io: {
		input: defineSchemaModel({
			name: 'CrmOnboardingTrackInput',
			description: 'Track input',
			fields: {},
		}),
		output: TrackResponseModel,
	},
	policy: { auth: 'user' },
});

export const RecordCrmOnboardingEvent = defineCommand({
	meta: {
		key: 'learningJourney.crmOnboarding.recordEvent',
		version: '1.0.0',
		stability: 'experimental',
		owners: [...OWNERS],
		tags: ['learning', 'crm', 'onboarding'],
		description: 'Record an event to advance CRM onboarding progress.',
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

export const crmOnboardingContracts = {
	GetCrmOnboardingTrack,
	RecordCrmOnboardingEvent,
	track: crmFirstWinTrack,
};
