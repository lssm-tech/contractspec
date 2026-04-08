import { createBuilderExportBundle, createBuilderPreview } from '../preview';
import { evaluateBuilderReadiness } from '../readiness';
import { createBuilderReplayBundle } from '../replay';
import { isoNow } from '../utils/now';
import {
	createBuilderExportArtifactRefs,
	createBuilderExportVerificationRef,
} from './export-artifacts';
import { readRuntimeMode } from './shared';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

function isOperationalPreviewTarget(input: {
	runtimeMode: 'managed' | 'local' | 'hybrid';
	target: Awaited<
		ReturnType<BuilderRuntimeDependencies['store']['listRuntimeTargets']>
	>[number];
}) {
	return (
		input.target.runtimeMode === input.runtimeMode &&
		input.target.registrationState === 'registered' &&
		input.target.capabilityProfile.supportsPreview
	);
}

function isOperationalExportTarget(input: {
	runtimeMode: 'managed' | 'local' | 'hybrid';
	target: Awaited<
		ReturnType<BuilderRuntimeDependencies['store']['listRuntimeTargets']>
	>[number];
}) {
	return (
		input.target.runtimeMode === input.runtimeMode &&
		input.target.registrationState === 'registered' &&
		input.target.capabilityProfile.supportsExport
	);
}

function selectRuntimeTargetId(input: {
	runtimeMode: 'managed' | 'local' | 'hybrid';
	runtimeTargets: Awaited<
		ReturnType<BuilderRuntimeDependencies['store']['listRuntimeTargets']>
	>;
	requestedTargetId?: string;
	purpose: 'preview' | 'export';
}) {
	if (input.runtimeMode === 'managed') {
		return input.requestedTargetId;
	}
	const isOperational =
		input.purpose === 'preview'
			? isOperationalPreviewTarget
			: isOperationalExportTarget;
	const requestedTarget = input.requestedTargetId
		? input.runtimeTargets.find(
				(target) => target.id === input.requestedTargetId
			)
		: undefined;
	if (
		requestedTarget &&
		isOperational({
			runtimeMode: input.runtimeMode,
			target: requestedTarget,
		})
	) {
		return requestedTarget.id;
	}
	return input.runtimeTargets.find((target) =>
		isOperational({
			runtimeMode: input.runtimeMode,
			target,
		})
	)?.id;
}

function isRuntimeReady(input: {
	readiness: NonNullable<
		Awaited<
			ReturnType<BuilderRuntimeDependencies['store']['getReadinessReport']>
		>
	>;
	runtimeMode: 'managed' | 'local' | 'hybrid';
}) {
	return (
		(input.runtimeMode === 'managed' && input.readiness.managedReady) ||
		(input.runtimeMode === 'local' && input.readiness.localReady) ||
		(input.runtimeMode === 'hybrid' && input.readiness.hybridReady)
	);
}

export async function createOrRefreshPreview(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
	if (!workspace || !blueprint) return null;
	const runtimeMode = readRuntimeMode(
		input.payload?.runtimeMode,
		workspace.defaultRuntimeMode
	);
	const [runtimeTargets, patchProposals, comparisonRuns, mobileReviewCards] =
		await Promise.all([
			deps.store.listRuntimeTargets(workspace.id),
			deps.store.listPatchProposals(workspace.id),
			deps.store.listComparisonRuns(workspace.id),
			deps.store.listMobileReviewCards(workspace.id),
		]);
	const runtimeTargetId = selectRuntimeTargetId({
		runtimeMode,
		runtimeTargets,
		requestedTargetId:
			typeof input.payload?.runtimeTargetId === 'string'
				? input.payload.runtimeTargetId
				: undefined,
		purpose: 'preview',
	});
	return deps.store.savePreview(
		createBuilderPreview({
			workspaceId: workspace.id,
			blueprint,
			runtimeMode,
			runtimeTargetId,
			patchProposals,
			comparisonRuns,
			mobileReviewCards,
			existing: await deps.store.getPreview(String(input.workspaceId)),
		})
	);
}

export async function runReadiness(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
	if (!workspace || !blueprint) return null;
	const [
		conversations,
		bindings,
		conflicts,
		sources,
		approvals,
		runtimeTargets,
		providers,
		executionReceipts,
		patchProposals,
		comparisonRuns,
		mobileReviewCards,
		exportBundle,
	] = await Promise.all([
		deps.store.listConversations(workspace.id),
		deps.store.listParticipantBindings(workspace.id),
		deps.store.listConflicts(workspace.id),
		deps.store.listSources(workspace.id),
		deps.store.listApprovalTickets(workspace.id),
		deps.store.listRuntimeTargets(workspace.id),
		deps.store.listExternalProviders(workspace.id),
		deps.store.listExecutionReceipts(workspace.id),
		deps.store.listPatchProposals(workspace.id),
		deps.store.listComparisonRuns(workspace.id),
		deps.store.listMobileReviewCards(workspace.id),
		deps.store.getExportBundle(workspace.id),
	]);
	const transcripts = (
		await Promise.all(
			sources.map((source) => deps.store.listTranscriptSegments(source.id))
		)
	).flat();
	const messages = (
		await Promise.all(
			conversations.map((conversation) =>
				deps.store.listChannelMessages(conversation.id)
			)
		)
	).flat();
	const { report } = evaluateBuilderReadiness({
		workspace,
		blueprint,
		conversations,
		bindings,
		transcripts,
		approvals,
		conflicts,
		messages,
		runtimeTargets,
		providers,
		executionReceipts,
		patchProposals,
		comparisonRuns,
		mobileReviewCards,
		exportBundle,
		preview: await deps.store.getPreview(workspace.id),
	});
	await deps.store.saveReadinessReport(report);
	return {
		report,
		replay: createBuilderReplayBundle({
			workspaceId: workspace.id,
			blueprint,
			sources,
			directives: await deps.store.listDirectives(workspace.id),
			messages,
			readinessReport: report,
			now: deps.now,
		}),
	};
}

export async function updateExport(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	if (commandKey === 'builder.export.prepare') {
		const workspace = await deps.store.getWorkspace(String(input.workspaceId));
		const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
		const readiness = await deps.store.getReadinessReport(
			String(input.workspaceId)
		);
		if (
			!workspace ||
			!blueprint ||
			!readiness ||
			readiness.overallStatus === 'blocked'
		) {
			return null;
		}
		const runtimeMode = readRuntimeMode(
			input.payload?.runtimeMode,
			workspace.defaultRuntimeMode
		);
		if (
			!isRuntimeReady({
				readiness,
				runtimeMode,
			})
		) {
			return null;
		}
		const [preview, existing, executionReceipts, runtimeTargets] =
			await Promise.all([
				deps.store.getPreview(String(input.workspaceId)),
				deps.store.getExportBundle(String(input.workspaceId)),
				deps.store.listExecutionReceipts(String(input.workspaceId)),
				deps.store.listRuntimeTargets(String(input.workspaceId)),
			]);
		if (!preview) {
			return null;
		}
		const targetType =
			(input.payload?.targetType as
				| 'oss_workspace'
				| 'repo_pr'
				| 'studio_project'
				| 'package_bundle') ?? 'oss_workspace';
		const runtimeTargetRef = selectRuntimeTargetId({
			runtimeMode,
			runtimeTargets,
			requestedTargetId:
				typeof input.payload?.runtimeTargetId === 'string'
					? input.payload.runtimeTargetId
					: preview.runtimeTargetId,
			purpose: 'export',
		});
		if (runtimeMode !== 'managed' && !runtimeTargetRef) {
			return null;
		}
		return deps.store.saveExportBundle(
			createBuilderExportBundle({
				workspaceId: String(input.workspaceId),
				targetType,
				runtimeMode,
				runtimeTargetRef,
				verificationRef: createBuilderExportVerificationRef({
					workspaceId: String(input.workspaceId),
					targetType,
					runtimeMode,
					runtimeTargetRef,
					blueprint,
					preview,
					executionReceipts,
				}),
				artifactRefs: createBuilderExportArtifactRefs({
					workspaceId: String(input.workspaceId),
					targetType,
					runtimeMode,
					runtimeTargetRef,
					blueprint,
					preview,
					executionReceipts,
				}),
				receiptIds: executionReceipts.map((receipt) => receipt.id),
				auditPackageRefs: [readiness.evidenceBundleRef.id],
				existingId: existing?.id,
			})
		);
	}
	const bundle = await deps.store.getExportBundle(String(input.workspaceId));
	if (!bundle) return null;
	if (commandKey === 'builder.export.execute') {
		const readiness = await deps.store.getReadinessReport(
			String(input.workspaceId)
		);
		if (
			!bundle.approvedAt ||
			!readiness ||
			readiness.overallStatus === 'blocked' ||
			!isRuntimeReady({
				readiness,
				runtimeMode: bundle.runtimeMode,
			})
		) {
			return null;
		}
		if (bundle.runtimeMode !== 'managed') {
			const runtimeTargets = await deps.store.listRuntimeTargets(
				String(input.workspaceId)
			);
			const runtimeTargetId = selectRuntimeTargetId({
				runtimeMode: bundle.runtimeMode,
				runtimeTargets,
				requestedTargetId: bundle.runtimeTargetRef,
				purpose: 'export',
			});
			if (!runtimeTargetId || runtimeTargetId !== bundle.runtimeTargetRef) {
				return null;
			}
		}
	}
	return deps.store.saveExportBundle({
		...bundle,
		approvedAt:
			commandKey === 'builder.export.approve'
				? isoNow(deps.now)
				: bundle.approvedAt,
		exportedAt:
			commandKey === 'builder.export.execute'
				? isoNow(deps.now)
				: bundle.exportedAt,
	});
}
