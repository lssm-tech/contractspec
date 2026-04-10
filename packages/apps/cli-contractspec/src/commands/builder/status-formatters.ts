import type {
	BuilderComparisonStatusReport,
	BuilderLocalRuntimeStatusReport,
	BuilderMobileStatusReport,
	BuilderStatusReport,
} from './status-types';

export function formatBuilderStatus(report: BuilderStatusReport) {
	return [
		`Workspace: ${report.workspaceId}`,
		`Bootstrap mode: ${report.bootstrapMode}`,
		`Bootstrap complete: ${report.bootstrapComplete}`,
		`Managed bootstrap: ${report.managedBootstrapComplete ? 'complete' : `missing ${report.missingPrerequisites.join(', ')}`}`,
		`Default provider profile: ${report.defaultProviderProfileId ?? 'unset'}`,
		`Runtime coverage: managed=${report.runtimeCoverage.managed} local=${report.runtimeCoverage.local} hybrid=${report.runtimeCoverage.hybrid}`,
		`Provider coverage: conversational=${report.providerCoverage.conversational} coding=${report.providerCoverage.coding} stt=${report.providerCoverage.stt} localHelper=${report.providerCoverage.localHelper}`,
		`Routing policy: ${report.routingPolicyPresent}`,
		`Preview: ${report.previewState}`,
		`Readiness: ${report.readinessState}`,
		`Mobile parity: ${report.mobileParityStatus ?? 'missing'}`,
		`Mobile review available: ${report.mobileReviewAvailable}`,
		`High-risk comparison policy: ${report.comparisonHighRiskEnabled}`,
		`Export: ${report.exportState}`,
	].join('\n');
}

export function formatBuilderMobileStatus(report: BuilderMobileStatusReport) {
	return [
		`Workspace: ${report.workspaceId}`,
		`Mobile parity: ${report.mobileParityStatus}`,
		`Channel-native features: ${report.channelNativeFeatures.join(', ') || 'none'}`,
		`Deep-link features: ${report.deepLinkFeatures.join(', ') || 'none'}`,
		`Blocked features: ${report.blockedFeatures.join(', ') || 'none'}`,
		`Action delivery: channel-native=${report.channelNativeActionCount} mobile-web=${report.deepLinkActionCount}`,
	].join('\n');
}

export function formatBuilderLocalRuntimeStatus(
	report: BuilderLocalRuntimeStatusReport
) {
	return [
		`Workspace: ${report.workspaceId}`,
		`Local daemon target: ${report.runtimeTargetId ?? 'missing'}`,
		`State: ${report.registrationState}`,
		`Network reachability: ${report.networkReachability ?? 'unknown'}`,
		`Storage profile: ${report.storageProfile ?? 'unknown'}`,
		`Evidence egress: ${report.evidenceEgressPolicy ?? 'unknown'}`,
		`Lease granted to: ${report.grantedTo ?? 'none'}`,
		`Lease expires: ${report.expiresAt ?? 'none'}`,
	].join('\n');
}

export function formatBuilderComparisonStatus(
	report: BuilderComparisonStatusReport
) {
	return [
		`Workspace: ${report.workspaceId}`,
		`High-risk comparison enabled: ${report.highRiskComparisonEnabled}`,
		`Comparison rules: ${report.comparisonRuleCount}`,
		`Comparison runs: ${report.comparisonRunCount}`,
		`Latest verdict: ${report.lastVerdictSummary ?? 'none'}`,
	].join('\n');
}
