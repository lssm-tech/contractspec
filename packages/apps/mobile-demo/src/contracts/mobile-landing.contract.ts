import {
	defineCommand,
	defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
import {
	defineEnum,
	ScalarTypeEnum,
	SchemaModel,
} from '@contractspec/lib.schema';

export const LandingStoryOutput = new SchemaModel({
	name: 'LandingStoryOutput',
	description: 'Shared ContractSpec landing story content for mobile shells.',
	fields: {
		story: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
	},
});

const LandingCtaResolveInput = new SchemaModel({
	name: 'LandingCtaResolveInput',
	description: 'Input for resolving a landing companion CTA.',
	fields: {
		id: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
	},
});

const LandingCtaKindEnum = defineEnum('LandingCtaKind', [
	'internal',
	'external',
]);

const LandingCtaResolveOutput = new SchemaModel({
	name: 'LandingCtaResolveOutput',
	description: 'Resolved mobile-safe CTA target.',
	fields: {
		id: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		label: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		url: { type: ScalarTypeEnum.URL(), isOptional: false },
		kind: { type: LandingCtaKindEnum, isOptional: false },
	},
});

export const MobileLandingStoryGetQuery = defineQuery({
	meta: {
		key: 'mobileLanding.story.get',
		version: '1.0.0',
		description: 'Get the shared ContractSpec landing story for Expo.',
		goal: 'Provide the OSS-first ContractSpec story to the mobile companion.',
		context: 'Used by LandingCompanionScreen.',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'landing', 'marketing'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: LandingStoryOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const MobileLandingCtaResolveCommand = defineCommand({
	meta: {
		key: 'mobileLanding.cta.resolve',
		version: '1.0.0',
		description: 'Resolve a landing companion CTA id to a mobile-safe URL.',
		goal: 'Open ContractSpec web and Studio links from the native Expo app.',
		context: 'Used by LandingCompanionScreen CTA buttons.',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'landing', 'cta'],
		stability: 'experimental',
	},
	io: {
		input: LandingCtaResolveInput,
		output: LandingCtaResolveOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});
