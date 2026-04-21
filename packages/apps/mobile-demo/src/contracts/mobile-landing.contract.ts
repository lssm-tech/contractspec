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

const LandingNavigationOutput = new SchemaModel({
	name: 'LandingNavigationOutput',
	description: 'Native navigation model for the Expo landing companion.',
	fields: {
		navigation: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
	},
});

const LandingPageGetInput = new SchemaModel({
	name: 'LandingPageGetInput',
	description: 'Input for loading a native landing companion page.',
	fields: {
		key: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
	},
});

const LandingPageOutput = new SchemaModel({
	name: 'LandingPageOutput',
	description: 'Platform-neutral landing companion page content.',
	fields: {
		page: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
	},
});

const LandingExamplesListOutput = new SchemaModel({
	name: 'LandingExamplesListOutput',
	description: 'Preview-only ContractSpec example catalog for mobile shells.',
	fields: {
		examples: {
			type: ScalarTypeEnum.JSONObject(),
			isOptional: false,
			isArray: true,
		},
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
	'native',
	'internal',
	'external',
]);

const LandingCtaResolveOutput = new SchemaModel({
	name: 'LandingCtaResolveOutput',
	description: 'Resolved mobile-safe CTA target.',
	fields: {
		id: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		label: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		href: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		url: { type: ScalarTypeEnum.URL(), isOptional: false },
		kind: { type: LandingCtaKindEnum, isOptional: false },
		route: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
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

export const MobileLandingNavigationListQuery = defineQuery({
	meta: {
		key: 'mobileLanding.navigation.list',
		version: '1.0.0',
		description: 'List native navigation items for the Expo landing companion.',
		goal: 'Mirror the main ContractSpec public website navigation in mobile.',
		context: 'Used by the shared mobile landing shell.',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'landing', 'navigation'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: LandingNavigationOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const MobileLandingPageGetQuery = defineQuery({
	meta: {
		key: 'mobileLanding.page.get',
		version: '1.0.0',
		description: 'Get content for a native landing companion route.',
		goal: 'Render web-landing public navigation pages inside Expo.',
		context: 'Used by Expo Router route screens.',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'landing', 'page'],
		stability: 'experimental',
	},
	io: {
		input: LandingPageGetInput,
		output: LandingPageOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const MobileLandingExamplesListQuery = defineQuery({
	meta: {
		key: 'mobileLanding.examples.list',
		version: '1.0.0',
		description: 'List discoverable examples for the Expo examples route.',
		goal: 'Expose the full ContractSpec example catalog in mobile.',
		context: 'Used by the examples Expo Router screens.',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'examples', 'preview'],
		stability: 'experimental',
	},
	io: {
		input: null,
		output: LandingExamplesListOutput,
	},
	policy: {
		auth: 'anonymous',
	},
});

export const MobileLandingCtaResolveCommand = defineCommand({
	meta: {
		key: 'mobileLanding.cta.resolve',
		version: '1.0.0',
		description: 'Resolve a landing companion CTA id to a native route or URL.',
		goal: 'Open native pages, ContractSpec web links, and Studio links from Expo.',
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
