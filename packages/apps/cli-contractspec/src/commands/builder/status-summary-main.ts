import type { BuilderWorkspaceSnapshot } from '@contractspec/lib.builder-spec';
import type { BuilderStatusReport } from './status-types';

function hasRuntimeTarget(
	snapshot: BuilderWorkspaceSnapshot,
	runtimeMode: 'managed' | 'local' | 'hybrid'
) {
	return snapshot.runtimeTargets.some(
		(target) =>
			target.runtimeMode === runtimeMode &&
			target.registrationState === 'registered'
	);
}

export function summarizeBuilderStatus(
	snapshot: BuilderWorkspaceSnapshot
): BuilderStatusReport {
	const bootstrapMode = snapshot.workspace.defaultRuntimeMode;
	const runtimeCoverage = {
		managed: hasRuntimeTarget(snapshot, 'managed'),
		local: hasRuntimeTarget(snapshot, 'local'),
		hybrid: hasRuntimeTarget(snapshot, 'hybrid'),
	};
	const providerCoverage = {
		conversational: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'conversational'
		),
		coding: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'coding'
		),
		stt: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'stt'
		),
		localHelper: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'routing_helper'
		),
	};
	const missingPrerequisites = [
		bootstrapMode === 'managed' && !runtimeCoverage.managed
			? 'managed runtime target'
			: null,
		bootstrapMode === 'local' && !runtimeCoverage.local
			? 'local daemon runtime target'
			: null,
		bootstrapMode === 'hybrid' && !runtimeCoverage.hybrid
			? 'hybrid runtime target'
			: null,
		!providerCoverage.conversational ? 'conversational provider' : null,
		!providerCoverage.coding ? 'coding provider' : null,
		!providerCoverage.stt ? 'STT provider' : null,
		bootstrapMode !== 'managed' && !providerCoverage.localHelper
			? 'local helper provider'
			: null,
		!snapshot.routingPolicy ? 'routing policy' : null,
	].filter((value): value is string => value !== null);
	const comparisonHighRiskEnabled =
		snapshot.routingPolicy?.comparisonRules.some(
			(rule) =>
				rule.riskLevelAtOrAbove === 'high' ||
				rule.riskLevelAtOrAbove === 'critical'
		) ?? false;

	return {
		workspaceId: snapshot.workspace.id,
		bootstrapMode,
		bootstrapComplete: missingPrerequisites.length === 0,
		managedBootstrapComplete: missingPrerequisites.length === 0,
		missingPrerequisites,
		defaultProviderProfileId:
			snapshot.routingPolicy?.defaultProviderProfileId ??
			snapshot.workspace.preferredProviderProfileId,
		runtimeCoverage,
		providerCoverage,
		routingPolicyPresent: Boolean(snapshot.routingPolicy),
		previewState: snapshot.preview?.buildStatus ?? 'missing',
		readinessState: snapshot.readinessReport?.overallStatus ?? 'missing',
		mobileReviewAvailable:
			snapshot.mobileReviewCards.length > 0 ||
			(snapshot.blueprint?.featureParity.length ?? 0) > 0,
		mobileParityStatus: snapshot.readinessReport?.mobileParityStatus,
		exportState: snapshot.exportBundle?.exportedAt
			? 'exported'
			: snapshot.exportBundle?.approvedAt
				? 'approved'
				: snapshot.exportBundle
					? 'prepared'
					: 'missing',
		comparisonHighRiskEnabled,
	};
}
