import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import { defineQuery } from '../../operations';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from '../constants';

export const PwaUpdateCheckInput = new SchemaModel({
	name: 'PwaUpdateCheckInput',
	fields: {
		appId: { type: ScalarTypeEnum.ID(), isOptional: false },
		currentVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		currentBuildId: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		platform: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		lastCheckedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const PwaUpdatePolicyModel = new SchemaModel({
	name: 'PwaUpdatePolicy',
	fields: {
		mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		checkIntervalMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		gracePeriodMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		message: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		minSupportedVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
	},
});

export const PwaReleaseModel = new SchemaModel({
	name: 'PwaRelease',
	fields: {
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		buildId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		releasedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const PwaUpdateCheckOutput = new SchemaModel({
	name: 'PwaUpdateCheckOutput',
	fields: {
		appId: { type: ScalarTypeEnum.ID(), isOptional: false },
		currentVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		latestVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		updateAvailable: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		update: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		blocking: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		policy: { type: PwaUpdatePolicyModel, isOptional: false },
		release: { type: PwaReleaseModel, isOptional: true },
		checkedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		message: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const PwaUpdateCheckQuery = defineQuery({
	meta: {
		key: 'pwa.update.check',
		title: 'Check PWA Update',
		version: '1.0.0',
		description:
			'Checks whether a browser frontend should prompt for a newer PWA release.',
		goal: 'Let frontend runtimes ask the API for optional or blocking updates.',
		context:
			'Used by PWA clients during startup or polling; service-worker activation remains host-owned.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: [...PWA_TAGS, 'query'],
		stability: PWA_STABILITY,
		docId: [docId('docs.tech.contracts.pwa-updates')],
	},
	capability: { key: 'pwa.update-management', version: '1.0.0' },
	io: {
		input: PwaUpdateCheckInput,
		output: PwaUpdateCheckOutput,
		errors: {
			PWA_APP_NOT_FOUND: {
				description: 'No PWA manifest exists for the requested app.',
				http: 404,
				when: 'The API cannot resolve the appId from the update request.',
			},
		},
	},
	policy: {
		auth: 'anonymous',
		pii: [],
	},
	transport: {
		rest: { method: 'GET', path: '/pwa/update/check/v1.0.0' },
	},
	acceptance: {
		scenarios: [
			{
				key: 'optional-update',
				given: ['A newer release exists with optional policy'],
				when: ['The client checks its current version'],
				then: ['The response reports update optional and blocking false'],
			},
			{
				key: 'required-update',
				given: ['The current version is below the minimum supported version'],
				when: ['The client checks its current version'],
				then: ['The response reports update required and blocking true'],
			},
		],
	},
});
