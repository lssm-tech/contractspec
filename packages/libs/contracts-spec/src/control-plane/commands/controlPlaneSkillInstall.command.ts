import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
	CONTROL_PLANE_DOMAIN,
	CONTROL_PLANE_OWNERS,
	CONTROL_PLANE_STABILITY,
	CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlaneSkillInstalledEvent } from '../events/controlPlaneSkillInstalled.event';
import { ControlPlaneSkillRejectedEvent } from '../events/controlPlaneSkillRejected.event';
import {
	ControlPlaneSkillManifestModel,
	ControlPlaneSkillVerificationIssueModel,
} from '../skills/schema';

const ControlPlaneSkillInstallInput = new SchemaModel({
	name: 'ControlPlaneSkillInstallInput',
	fields: {
		skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		artifactDigest: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
		manifest: { type: ControlPlaneSkillManifestModel, isOptional: false },
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const ControlPlaneSkillInstallOutput = new SchemaModel({
	name: 'ControlPlaneSkillInstallOutput',
	fields: {
		installationId: { type: ScalarTypeEnum.ID(), isOptional: false },
		skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		verified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		signatureVerified: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		publisherTrusted: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		compatibilityVerified: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		manifestDigest: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		provenance: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		issues: {
			type: ControlPlaneSkillVerificationIssueModel,
			isOptional: true,
			isArray: true,
		},
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		installedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

export const ControlPlaneSkillInstallCommand = defineCommand({
	meta: {
		key: 'controlPlane.skill.install',
		title: 'Install Skill Artifact',
		version: '1.0.0',
		description: 'Install a signed skill artifact after verification checks.',
		goal: 'Enforce trusted skill onboarding with provenance guarantees.',
		context:
			'Used by the control plane or marketplace workflows when enabling new skills.',
		domain: CONTROL_PLANE_DOMAIN,
		owners: CONTROL_PLANE_OWNERS,
		tags: [...CONTROL_PLANE_TAGS, 'skills'],
		stability: CONTROL_PLANE_STABILITY,
	},
	capability: {
		key: 'control-plane.skill-registry',
		version: '1.0.0',
	},
	io: {
		input: ControlPlaneSkillInstallInput,
		output: ControlPlaneSkillInstallOutput,
		errors: {
			SIGNATURE_INVALID: {
				description: 'The submitted artifact signature is invalid.',
				http: 400,
				when: 'Signature verification fails for the supplied artifact digest.',
			},
			SIGNATURE_MISSING: {
				description: 'The skill manifest is missing a signature block.',
				http: 400,
				when: 'Unsigned skill artifacts are submitted for installation.',
			},
			MANIFEST_INVALID: {
				description: 'The skill manifest payload is malformed.',
				http: 400,
				when: 'Manifest schema validation fails before verification can run.',
			},
			SCHEMA_VERSION_INVALID: {
				description: 'The skill manifest schema version is unsupported.',
				http: 400,
				when: 'Manifest schemaVersion is not supported by the control plane.',
			},
			PUBLISHER_UNTRUSTED: {
				description: 'The skill publisher or signing key is not trusted.',
				http: 403,
				when: 'Publisher trust policy rejects the manifest identity or signature key.',
			},
			KEY_UNTRUSTED: {
				description: 'The signing key is not pinned for the trusted publisher.',
				http: 403,
				when: 'Trusted publisher policy does not include the manifest keyId or public key.',
			},
			PROVENANCE_UNTRUSTED: {
				description:
					'The skill provenance is outside the trusted publisher scope.',
				http: 403,
				when: 'Manifest provenance does not match the trusted publisher prefixes.',
			},
			ARTIFACT_DIGEST_MISMATCH: {
				description:
					'The submitted artifact digest does not match the signed manifest.',
				http: 409,
				when: 'Artifact tampering or drift is detected during verification.',
			},
			SIGNATURE_EXPIRED: {
				description: 'The skill manifest signature has expired.',
				http: 400,
				when: 'Signature expiry checks fail during verification.',
			},
			CONTRACTS_SPEC_VERSION_MISSING: {
				description:
					'The runtime did not provide a ContractSpec version for compatibility checks.',
				http: 409,
				when: 'Compatibility requirements cannot be evaluated without a runtime version.',
			},
			CONTRACTS_SPEC_TOO_OLD: {
				description:
					'The runtime ContractSpec version is below the supported minimum.',
				http: 409,
				when: 'Skill compatibility requires a newer ContractSpec version.',
			},
			CONTRACTS_SPEC_TOO_NEW: {
				description:
					'The runtime ContractSpec version is above the supported maximum.',
				http: 409,
				when: 'Skill compatibility does not support the active ContractSpec version yet.',
			},
			CONTROL_PLANE_VERSION_MISSING: {
				description:
					'The runtime did not provide a control-plane version for compatibility checks.',
				http: 409,
				when: 'Control-plane feature compatibility requires an explicit runtime version.',
			},
			CONTROL_PLANE_TOO_OLD: {
				description:
					'The control-plane runtime is below the supported minimum version.',
				http: 409,
				when: 'Skill compatibility requires a newer control-plane version.',
			},
			CONTROL_PLANE_TOO_NEW: {
				description:
					'The control-plane runtime is above the supported maximum version.',
				http: 409,
				when: 'Skill compatibility does not support the active control-plane version yet.',
			},
			CAPABILITY_MISSING: {
				description:
					'The runtime is missing a capability required by the skill.',
				http: 409,
				when: 'Required control-plane capabilities are unavailable at install time.',
			},
		},
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
	sideEffects: {
		emits: [
			{
				ref: ControlPlaneSkillInstalledEvent.meta,
				when: 'Skill validation and installation complete successfully.',
			},
			{
				ref: ControlPlaneSkillRejectedEvent.meta,
				when: 'Skill validation fails and installation is rejected.',
			},
		],
	},
});
