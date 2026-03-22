import { compareVersions } from 'compare-versions';
import { createHash } from 'crypto';

import {
	canonicalizeControlPlaneSkillManifest,
	verifyControlPlaneSkillSignature,
} from './signer';
import type {
	ControlPlaneSkillManifest,
	ControlPlaneSkillRuntimeContext,
	ControlPlaneSkillTrustPolicy,
	ControlPlaneSkillVerificationIssue,
	ControlPlaneSkillVerificationReport,
} from './types';
import { validateControlPlaneSkillManifest } from './validator';

export interface VerifyControlPlaneSkillInput {
	manifest: ControlPlaneSkillManifest;
	trustPolicy: ControlPlaneSkillTrustPolicy;
	runtime: ControlPlaneSkillRuntimeContext;
	expectedArtifactDigest?: string;
	now?: Date;
}

export function verifyControlPlaneSkillManifest(
	input: VerifyControlPlaneSkillInput
): ControlPlaneSkillVerificationReport {
	const issues = validateControlPlaneSkillManifest(input.manifest);
	const now = input.now ?? new Date();
	const publisher = input.trustPolicy.trustedPublishers.find(
		(candidate) => candidate.id === input.manifest.publisher.id
	);

	const signatureVerified = verifySignature(input.manifest, issues);
	const publisherTrusted = verifyPublisherTrust(
		input.manifest,
		publisher,
		input.trustPolicy,
		now,
		issues
	);
	const compatibilityVerified = verifyCompatibility(
		input.manifest,
		input.runtime,
		issues
	);

	if (
		input.expectedArtifactDigest &&
		input.expectedArtifactDigest !== input.manifest.artifact.digest
	) {
		issues.push({
			code: 'ARTIFACT_DIGEST_MISMATCH',
			message: 'Artifact digest does not match the manifest digest.',
		});
	}

	return {
		verified: issues.length === 0,
		signatureVerified,
		publisherTrusted,
		compatibilityVerified,
		verifiedAt: now.toISOString(),
		manifestDigest: sha256(
			canonicalizeControlPlaneSkillManifest(input.manifest)
		),
		issues,
	};
}

function verifySignature(
	manifest: ControlPlaneSkillManifest,
	issues: ControlPlaneSkillVerificationIssue[]
): boolean {
	if (!manifest.signature) {
		issues.push({
			code: 'SIGNATURE_MISSING',
			message: 'Skill manifest is missing a signature block.',
		});
		return false;
	}
	try {
		if (verifyControlPlaneSkillSignature(manifest)) {
			return true;
		}
	} catch {
		// fall through to structured issue below
	}
	issues.push({
		code: 'SIGNATURE_INVALID',
		message: 'Skill manifest signature verification failed.',
	});
	return false;
}

function verifyPublisherTrust(
	manifest: ControlPlaneSkillManifest,
	publisher:
		| ControlPlaneSkillTrustPolicy['trustedPublishers'][number]
		| undefined,
	trustPolicy: ControlPlaneSkillTrustPolicy,
	now: Date,
	issues: ControlPlaneSkillVerificationIssue[]
): boolean {
	let trusted = true;
	if (!publisher) {
		issues.push({
			code: 'PUBLISHER_UNTRUSTED',
			message: `Publisher ${manifest.publisher.id} is not trusted.`,
		});
		trusted = false;
	}
	if (publisher && !publisher.keyIds?.length && !publisher.publicKeys?.length) {
		issues.push({
			code: 'KEY_UNTRUSTED',
			message: 'Trusted publishers must pin at least one keyId or public key.',
		});
		trusted = false;
	}
	if (
		publisher?.keyIds?.length &&
		(!manifest.signature?.keyId ||
			!publisher.keyIds.includes(manifest.signature.keyId))
	) {
		issues.push({
			code: 'KEY_UNTRUSTED',
			message: 'Skill manifest keyId is not trusted for this publisher.',
		});
		trusted = false;
	}
	if (
		publisher?.publicKeys?.length &&
		(!manifest.signature?.publicKey ||
			!publisher.publicKeys.includes(manifest.signature.publicKey))
	) {
		issues.push({
			code: 'KEY_UNTRUSTED',
			message: 'Skill manifest public key is not trusted for this publisher.',
		});
		trusted = false;
	}
	if (
		publisher?.provenancePrefixes?.length &&
		!publisher.provenancePrefixes.some((prefix) =>
			manifest.publisher.provenance.startsWith(prefix)
		)
	) {
		issues.push({
			code: 'PROVENANCE_UNTRUSTED',
			message: 'Skill manifest provenance is not trusted for this publisher.',
		});
		trusted = false;
	}
	if (
		manifest.signature?.expiresAt &&
		!trustPolicy.allowExpiredSignatures &&
		new Date(manifest.signature.expiresAt).getTime() < now.getTime()
	) {
		issues.push({
			code: 'SIGNATURE_EXPIRED',
			message: 'Skill manifest signature has expired.',
		});
		trusted = false;
	}
	return trusted;
}

function verifyCompatibility(
	manifest: ControlPlaneSkillManifest,
	runtime: ControlPlaneSkillRuntimeContext,
	issues: ControlPlaneSkillVerificationIssue[]
): boolean {
	verifyVersionRange(
		runtime.contractsSpecVersion,
		manifest.compatibility.contractsSpec,
		'CONTRACTS_SPEC_TOO_OLD',
		'CONTRACTS_SPEC_TOO_NEW',
		'ContractSpec runtime',
		issues
	);
	verifyVersionRange(
		runtime.controlPlaneFeatureVersion,
		manifest.compatibility.controlPlaneFeature,
		'CONTROL_PLANE_TOO_OLD',
		'CONTROL_PLANE_TOO_NEW',
		'Control plane feature',
		issues
	);

	for (const requirement of manifest.compatibility.requiredCapabilities ?? []) {
		const satisfied = runtime.availableCapabilities?.some(
			(candidate) =>
				candidate.key === requirement.key &&
				(requirement.version == null ||
					candidate.version === requirement.version)
		);
		if (!satisfied) {
			issues.push({
				code: 'CAPABILITY_MISSING',
				message: `Missing required capability ${requirement.key}${requirement.version ? `@${requirement.version}` : ''}.`,
			});
		}
	}

	return !issues.some(
		(issue) =>
			issue.code.includes('TOO_') ||
			issue.code.includes('VERSION_MISSING') ||
			issue.code === 'CAPABILITY_MISSING'
	);
}

function verifyVersionRange(
	runtimeVersion: string | undefined,
	range:
		| ControlPlaneSkillManifest['compatibility']['contractsSpec']
		| undefined,
	tooOldCode: ControlPlaneSkillVerificationIssue['code'],
	tooNewCode: ControlPlaneSkillVerificationIssue['code'],
	label: string,
	issues: ControlPlaneSkillVerificationIssue[]
): void {
	if (!range || !runtimeVersion) {
		if (range && !runtimeVersion) {
			issues.push({
				code:
					tooOldCode === 'CONTRACTS_SPEC_TOO_OLD'
						? 'CONTRACTS_SPEC_VERSION_MISSING'
						: 'CONTROL_PLANE_VERSION_MISSING',
				message: `${label} version is required for compatibility verification.`,
			});
		}
		return;
	}
	if (
		range.minVersion &&
		compareVersions(runtimeVersion, range.minVersion) < 0
	) {
		issues.push({
			code: tooOldCode,
			message: `${label} version is below ${range.minVersion}.`,
		});
	}
	if (
		range.maxVersion &&
		compareVersions(runtimeVersion, range.maxVersion) > 0
	) {
		issues.push({
			code: tooNewCode,
			message: `${label} version is above ${range.maxVersion}.`,
		});
	}
}

function sha256(value: string): string {
	return createHash('sha256').update(value).digest('hex');
}
