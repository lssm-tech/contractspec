import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const ControlPlaneSkillCapabilityRequirementModel = new SchemaModel({
	name: 'ControlPlaneSkillCapabilityRequirement',
	fields: {
		key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ControlPlaneSkillVersionRangeModel = new SchemaModel({
	name: 'ControlPlaneSkillVersionRange',
	fields: {
		minVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		maxVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const ControlPlaneSkillArtifactFileModel = new SchemaModel({
	name: 'ControlPlaneSkillArtifactFile',
	fields: {
		path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		digest: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		size: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
	},
});

const ControlPlaneSkillSignatureModel = new SchemaModel({
	name: 'ControlPlaneSkillSignature',
	fields: {
		algorithm: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		signature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		publicKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		keyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		issuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

export const ControlPlaneSkillManifestModel = new SchemaModel({
	name: 'ControlPlaneSkillManifest',
	fields: {
		schemaVersion: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		skill: {
			type: new SchemaModel({
				name: 'ControlPlaneSkillManifestSkill',
				fields: {
					key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
					version: {
						type: ScalarTypeEnum.String_unsecure(),
						isOptional: false,
					},
					entryPoint: {
						type: ScalarTypeEnum.String_unsecure(),
						isOptional: false,
					},
					description: {
						type: ScalarTypeEnum.String_unsecure(),
						isOptional: true,
					},
				},
			}),
			isOptional: false,
		},
		publisher: {
			type: new SchemaModel({
				name: 'ControlPlaneSkillManifestPublisher',
				fields: {
					id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
					provenance: {
						type: ScalarTypeEnum.String_unsecure(),
						isOptional: false,
					},
					repositoryUrl: {
						type: ScalarTypeEnum.String_unsecure(),
						isOptional: true,
					},
				},
			}),
			isOptional: false,
		},
		artifact: {
			type: new SchemaModel({
				name: 'ControlPlaneSkillManifestArtifact',
				fields: {
					digest: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
					files: {
						type: ControlPlaneSkillArtifactFileModel,
						isOptional: true,
						isArray: true,
					},
				},
			}),
			isOptional: false,
		},
		compatibility: {
			type: new SchemaModel({
				name: 'ControlPlaneSkillManifestCompatibility',
				fields: {
					contractsSpec: {
						type: ControlPlaneSkillVersionRangeModel,
						isOptional: true,
					},
					controlPlaneFeature: {
						type: ControlPlaneSkillVersionRangeModel,
						isOptional: true,
					},
					requiredCapabilities: {
						type: ControlPlaneSkillCapabilityRequirementModel,
						isOptional: true,
						isArray: true,
					},
				},
			}),
			isOptional: false,
		},
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		signature: { type: ControlPlaneSkillSignatureModel, isOptional: true },
	},
});

export const ControlPlaneSkillVerificationIssueModel = new SchemaModel({
	name: 'ControlPlaneSkillVerificationIssue',
	fields: {
		code: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});
