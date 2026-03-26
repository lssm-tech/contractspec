import {
	type ControlPlaneSkillManifest,
	type ControlPlaneSkillRuntimeContext,
	type ControlPlaneSkillTrustPolicy,
	type ControlPlaneSkillVerificationReport,
	verifyControlPlaneSkillManifest,
} from '@contractspec/lib.contracts-spec/control-plane/skills';

import type {
	ChannelRuntimeStore,
	ListSkillInstallationsInput,
	ListSkillInstallationsResult,
} from './store';
import type { ControlPlaneSkillInstallationRecord } from './types';

export interface ControlPlaneSkillVerificationResult {
	skillKey: string;
	version: string;
	artifactDigest: string;
	report: ControlPlaneSkillVerificationReport;
}

export interface VerifyControlPlaneSkillInput {
	skillKey: string;
	version: string;
	artifactDigest: string;
	manifest: ControlPlaneSkillManifest;
}

export interface InstallControlPlaneSkillInput
	extends VerifyControlPlaneSkillInput {
	installedBy?: string;
}

export interface DisableControlPlaneSkillInput {
	installationId: string;
	disabledBy?: string;
	disabledAt?: Date;
}

export interface ControlPlaneSkillRegistryServiceOptions {
	now?: () => Date;
	trustPolicy: ControlPlaneSkillTrustPolicy;
	runtime: ControlPlaneSkillRuntimeContext;
}

export class ControlPlaneSkillRegistryService {
	private readonly now: () => Date;

	constructor(
		private readonly store: ChannelRuntimeStore,
		private readonly options: ControlPlaneSkillRegistryServiceOptions
	) {
		this.now = options.now ?? (() => new Date());
	}

	verify(
		input: VerifyControlPlaneSkillInput
	): ControlPlaneSkillVerificationResult {
		let report: ControlPlaneSkillVerificationReport;
		try {
			report = verifyControlPlaneSkillManifest({
				manifest: input.manifest,
				trustPolicy: this.options.trustPolicy,
				runtime: this.options.runtime,
				expectedArtifactDigest: input.artifactDigest,
				now: this.now(),
			});
		} catch (error) {
			report = {
				verified: false,
				signatureVerified: false,
				publisherTrusted: false,
				compatibilityVerified: false,
				verifiedAt: this.now().toISOString(),
				manifestDigest: '',
				issues: [
					{
						code: 'MANIFEST_INVALID',
						message:
							error instanceof Error
								? error.message
								: 'Skill manifest validation failed.',
					},
				],
			};
		}
		if (
			input.skillKey !== input.manifest.skill.key ||
			input.version !== input.manifest.skill.version
		) {
			report.verified = false;
			report.issues = [
				...report.issues,
				{
					code: 'MANIFEST_INVALID',
					message:
						'Skill identity does not match the manifest skill key/version.',
				},
			];
		}
		return {
			skillKey: input.skillKey,
			version: input.version,
			artifactDigest: input.artifactDigest,
			report,
		};
	}

	async install(
		input: InstallControlPlaneSkillInput
	): Promise<ControlPlaneSkillInstallationRecord> {
		const verification = this.verify(input);
		const existing = await this.store.findSkillInstallation(
			verification.skillKey,
			verification.version
		);
		if (
			existing &&
			existing.artifactDigest === verification.artifactDigest &&
			existing.verificationReport.manifestDigest ===
				verification.report.manifestDigest
		) {
			if (existing.status === 'disabled' && verification.report.verified) {
				return this.store.saveSkillInstallation({
					skillKey: verification.skillKey,
					version: verification.version,
					artifactDigest: verification.artifactDigest,
					manifest: input.manifest,
					verificationReport: verification.report,
					status: 'installed',
					installedAt: this.now(),
					installedBy: input.installedBy,
				});
			}
			return existing;
		}
		if (existing?.status === 'installed' && !verification.report.verified) {
			throw new Error(
				`Skill ${verification.skillKey}@${verification.version} failed verification and cannot replace the installed artifact.`
			);
		}
		if (existing) {
			throw new Error(
				`Skill ${verification.skillKey}@${verification.version} is already installed; publish a new version to replace it.`
			);
		}
		return this.store.saveSkillInstallation({
			skillKey: verification.skillKey,
			version: verification.version,
			artifactDigest: verification.artifactDigest,
			manifest: input.manifest,
			verificationReport: verification.report,
			status: verification.report.verified ? 'installed' : 'rejected',
			installedAt: this.now(),
			installedBy: input.installedBy,
		});
	}

	async get(
		installationId: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		return this.store.getSkillInstallation(installationId);
	}

	async find(
		skillKey: string,
		version: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		return this.store.findSkillInstallation(skillKey, version);
	}

	async list(
		input: ListSkillInstallationsInput = {}
	): Promise<ListSkillInstallationsResult> {
		return this.store.listSkillInstallations(input);
	}

	async disable(
		input: DisableControlPlaneSkillInput
	): Promise<ControlPlaneSkillInstallationRecord> {
		const existing = await this.store.getSkillInstallation(
			input.installationId
		);
		if (!existing) {
			throw new Error(
				`Skill installation ${input.installationId} was not found.`
			);
		}
		if (existing.status !== 'installed') {
			throw new Error(
				`Skill installation ${input.installationId} is not installed.`
			);
		}
		const disabled = await this.store.disableSkillInstallation({
			installationId: input.installationId,
			disabledAt: input.disabledAt ?? this.now(),
			disabledBy: input.disabledBy,
		});
		if (!disabled) {
			throw new Error(
				`Skill installation ${input.installationId} is not installed.`
			);
		}
		return disabled;
	}
}
