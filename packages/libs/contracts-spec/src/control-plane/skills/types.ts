import type { CapabilityRef } from '../../capabilities';

export type ControlPlaneSkillSignatureAlgorithm = 'ed25519' | 'rsa-pss-sha256';

export interface ControlPlaneSkillManifestVersionRange {
	minVersion?: string;
	maxVersion?: string;
}

export interface ControlPlaneSkillSignatureBlock {
	algorithm: ControlPlaneSkillSignatureAlgorithm;
	signature: string;
	publicKey: string;
	keyId?: string;
	issuedAt?: string;
	expiresAt?: string;
	metadata?: Record<string, unknown>;
}

export interface ControlPlaneSkillManifest {
	schemaVersion: '1.0.0';
	skill: {
		key: string;
		version: string;
		entryPoint: string;
		description?: string;
	};
	publisher: {
		id: string;
		provenance: string;
		repositoryUrl?: string;
	};
	artifact: {
		digest: string;
		files?: Array<{
			path: string;
			digest: string;
			size: number;
		}>;
	};
	compatibility: {
		contractsSpec?: ControlPlaneSkillManifestVersionRange;
		controlPlaneFeature?: ControlPlaneSkillManifestVersionRange;
		requiredCapabilities?: CapabilityRef[];
	};
	metadata?: Record<string, unknown>;
	signature?: ControlPlaneSkillSignatureBlock;
}

export interface TrustedSkillPublisher {
	id: string;
	keyIds?: string[];
	publicKeys?: string[];
	provenancePrefixes?: string[];
}

export interface ControlPlaneSkillTrustPolicy {
	trustedPublishers: TrustedSkillPublisher[];
	allowExpiredSignatures?: boolean;
}

export interface ControlPlaneSkillRuntimeContext {
	contractsSpecVersion: string;
	controlPlaneFeatureVersion?: string;
	availableCapabilities?: CapabilityRef[];
}

export type ControlPlaneSkillVerificationCode =
	| 'MANIFEST_INVALID'
	| 'SCHEMA_VERSION_INVALID'
	| 'SIGNATURE_MISSING'
	| 'SIGNATURE_INVALID'
	| 'SIGNATURE_EXPIRED'
	| 'PUBLISHER_UNTRUSTED'
	| 'KEY_UNTRUSTED'
	| 'PROVENANCE_UNTRUSTED'
	| 'ARTIFACT_DIGEST_MISMATCH'
	| 'CONTRACTS_SPEC_VERSION_MISSING'
	| 'CONTRACTS_SPEC_TOO_OLD'
	| 'CONTRACTS_SPEC_TOO_NEW'
	| 'CONTROL_PLANE_VERSION_MISSING'
	| 'CONTROL_PLANE_TOO_OLD'
	| 'CONTROL_PLANE_TOO_NEW'
	| 'CAPABILITY_MISSING';

export interface ControlPlaneSkillVerificationIssue {
	code: ControlPlaneSkillVerificationCode;
	message: string;
}

export interface ControlPlaneSkillVerificationReport {
	verified: boolean;
	signatureVerified: boolean;
	publisherTrusted: boolean;
	compatibilityVerified: boolean;
	verifiedAt: string;
	manifestDigest: string;
	issues: ControlPlaneSkillVerificationIssue[];
}
