'use client';

import type {
	BuilderExportBundle,
	BuilderPreview,
} from '@contractspec/lib.builder-spec';
import type { RuntimeMode } from '@contractspec/lib.provider-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function PreviewWorkspacePanel(props: {
	preview?: BuilderPreview | null;
	exportBundle?: BuilderExportBundle | null;
	onCreatePreview?: () => void | Promise<void>;
	onRunReadiness?: () => void | Promise<void>;
	onPrepareExport?: () => void | Promise<void>;
	onApproveExport?: () => void | Promise<void>;
	onExecuteExport?: () => void | Promise<void>;
	selectedRuntimeMode: RuntimeMode;
	onSelectRuntimeMode?: (runtimeMode: RuntimeMode) => void;
	isCreatingPreview?: boolean;
	isRunningReadiness?: boolean;
	isPreparingExport?: boolean;
	isApprovingExport?: boolean;
	isExecutingExport?: boolean;
}) {
	if (!props.preview) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Preview Workspace</CardTitle>
					<CardDescription>No preview has been generated yet.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => void props.onCreatePreview?.()}
						disabled={props.isCreatingPreview === true}
					>
						{props.isCreatingPreview ? 'Creating...' : 'Create Preview'}
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Preview Workspace</CardTitle>
				<CardDescription>
					Data mode, build status, and diff summary remain visible before
					export.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="end">
						{(['managed', 'local', 'hybrid'] as RuntimeMode[]).map((mode) => (
							<Button
								key={mode}
								variant={
									props.selectedRuntimeMode === mode ? 'default' : 'outline'
								}
								onClick={() => props.onSelectRuntimeMode?.(mode)}
							>
								{mode}
							</Button>
						))}
						<Button
							variant="outline"
							onClick={() => void props.onCreatePreview?.()}
							disabled={props.isCreatingPreview === true}
						>
							{props.isCreatingPreview ? 'Refreshing...' : 'Refresh Preview'}
						</Button>
						<Button
							variant="outline"
							onClick={() => void props.onRunReadiness?.()}
							disabled={props.isRunningReadiness === true}
						>
							{props.isRunningReadiness ? 'Running...' : 'Run Readiness'}
						</Button>
						<Button
							onClick={() => void props.onPrepareExport?.()}
							disabled={props.isPreparingExport === true}
						>
							{props.isPreparingExport ? 'Preparing...' : 'Prepare Export'}
						</Button>
						<Button
							variant="outline"
							onClick={() => void props.onApproveExport?.()}
							disabled={props.isApprovingExport === true}
						>
							{props.isApprovingExport ? 'Approving...' : 'Approve Export'}
						</Button>
						<Button
							onClick={() => void props.onExecuteExport?.()}
							disabled={props.isExecutingExport === true}
						>
							{props.isExecutingExport ? 'Exporting...' : 'Execute Export'}
						</Button>
					</HStack>
					<HStack justify="between">
						<Badge variant="secondary">{props.preview.buildStatus}</Badge>
						<Badge>{props.preview.runtimeMode}</Badge>
					</HStack>
					<HStack justify="between">
						<Small>Workspace Ref</Small>
						<Muted>{props.preview.generatedWorkspaceRef}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Runtime Target</Small>
						<Muted>{props.preview.runtimeTargetId ?? 'managed default'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Selected Export Mode</Small>
						<Muted>{props.selectedRuntimeMode}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Readiness Summary</Small>
						<Muted>{props.preview.readinessSummary}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Provider Activity</Small>
						<Muted>{props.preview.providerActivitySummary ?? 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Diff Summary</Small>
						<Muted>{props.preview.diffSummary ?? 'none'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Mobile Reviews</Small>
						<Muted>{props.preview.mobileReviewCardIds.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Export Target</Small>
						<Muted>{props.exportBundle?.targetType ?? 'not_prepared'}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Export Approval</Small>
						<Muted>
							{props.exportBundle?.approvedAt
								? `approved ${props.exportBundle.approvedAt}`
								: 'pending'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Export Status</Small>
						<Muted>
							{props.exportBundle?.exportedAt
								? `exported ${props.exportBundle.exportedAt}`
								: 'not executed'}
						</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
