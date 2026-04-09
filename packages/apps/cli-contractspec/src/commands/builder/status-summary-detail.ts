import type { BuilderWorkspaceSnapshot } from '@contractspec/lib.builder-spec';
import type {
	BuilderComparisonStatusReport,
	BuilderLocalRuntimeStatusReport,
	BuilderMobileStatusReport,
} from './status-types';

export function summarizeBuilderMobileStatus(
	snapshot: BuilderWorkspaceSnapshot
): BuilderMobileStatusReport {
	const summary = snapshot.readinessReport?.mobileParitySummary;
	return {
		workspaceId: snapshot.workspace.id,
		mobileParityStatus:
			snapshot.readinessReport?.mobileParityStatus ?? 'missing',
		channelNativeFeatures: summary?.channelNativeFeatures ?? [],
		deepLinkFeatures: summary?.deepLinkFeatures ?? [],
		blockedFeatures: summary?.blockedFeatures ?? [],
		channelNativeActionCount: summary?.channelNativeActionCount ?? 0,
		deepLinkActionCount: summary?.deepLinkActionCount ?? 0,
	};
}

export function summarizeBuilderLocalRuntimeStatus(
	snapshot: BuilderWorkspaceSnapshot
): BuilderLocalRuntimeStatusReport {
	const target = snapshot.runtimeTargets.find(
		(runtimeTarget) => runtimeTarget.type === 'local_daemon'
	);
	return {
		workspaceId: snapshot.workspace.id,
		runtimeTargetId: target?.id,
		registrationState: target?.registrationState ?? 'missing',
		networkReachability: target?.capabilityHandshake?.networkReachability,
		storageProfile: target?.capabilityHandshake?.storageProfile,
		evidenceEgressPolicy: target?.trustProfile?.evidenceEgressPolicy,
		grantedTo: target?.lease?.grantedTo,
		expiresAt: target?.lease?.expiresAt,
	};
}

export function summarizeBuilderComparisonStatus(
	snapshot: BuilderWorkspaceSnapshot
): BuilderComparisonStatusReport {
	return {
		workspaceId: snapshot.workspace.id,
		highRiskComparisonEnabled:
			snapshot.routingPolicy?.comparisonRules.some(
				(rule) =>
					rule.riskLevelAtOrAbove === 'high' ||
					rule.riskLevelAtOrAbove === 'critical'
			) ?? false,
		comparisonRuleCount: snapshot.routingPolicy?.comparisonRules.length ?? 0,
		comparisonRunCount: snapshot.comparisonRuns.length,
		lastVerdictSummary:
			snapshot.comparisonRuns.at(-1)?.verdict?.summary ?? undefined,
	};
}
