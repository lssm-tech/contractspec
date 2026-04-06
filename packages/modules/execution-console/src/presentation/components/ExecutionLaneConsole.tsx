import type {
	CompletionStatusView,
	LaneRuntimeSnapshot,
	LaneStatusView,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
import { buildExecutionLaneTimeline } from '../../core';
import { useExecutionLaneConsoleState } from '../hooks';
import { CompletionStatusPanel } from './CompletionStatusPanel';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ExecutionLaneStatusCard } from './ExecutionLaneStatusCard';
import { ExecutionLaneTimeline } from './ExecutionLaneTimeline';
import { MailboxViewer } from './MailboxViewer';
import { TeamTaskTable } from './TeamTaskTable';
import { TeamWorkerBoard } from './TeamWorkerBoard';

export function ExecutionLaneConsole(props: {
	snapshot: LaneRuntimeSnapshot;
	lane: LaneStatusView;
	team?: TeamStatusView;
	completion?: CompletionStatusView;
	onPause?: () => void;
	onResume?: () => void;
	onRetry?: () => void;
	onAbort?: () => void;
	onShutdown?: () => void;
	onRequestApproval?: () => void;
	onExportEvidence?: () => void;
	onEscalate?: () => void;
	onOpenReplay?: () => void;
	onNudgeWorker?(workerId: string): void;
}) {
	const state = useExecutionLaneConsoleState();

	return (
		<VStack gap="xl" align="stretch">
			<HStack justify="between">
				<ExecutionLaneStatusCard
					lane={props.lane}
					team={props.team}
					completion={props.completion}
				/>
				<HStack gap="sm">
					{props.onPause ? (
						<Button variant="outline" onClick={props.onPause}>
							Pause
						</Button>
					) : null}
					{props.onResume ? (
						<Button onClick={props.onResume}>Resume</Button>
					) : null}
					{props.onRetry ? (
						<Button variant="secondary" onClick={props.onRetry}>
							Retry
						</Button>
					) : null}
					{props.onRequestApproval ? (
						<Button variant="outline" onClick={props.onRequestApproval}>
							Request Approval
						</Button>
					) : null}
					{props.onExportEvidence ? (
						<Button variant="outline" onClick={props.onExportEvidence}>
							Export Evidence
						</Button>
					) : null}
					{props.onEscalate ? (
						<Button variant="outline" onClick={props.onEscalate}>
							Escalate
						</Button>
					) : null}
					{props.onOpenReplay ? (
						<Button variant="outline" onClick={props.onOpenReplay}>
							Open Replay
						</Button>
					) : null}
					{props.onShutdown ? (
						<Button variant="destructive" onClick={props.onShutdown}>
							Shutdown
						</Button>
					) : null}
					{props.onAbort ? (
						<Button variant="destructive" onClick={props.onAbort}>
							Abort
						</Button>
					) : null}
				</HStack>
			</HStack>
			<Tabs value={state.tab} onValueChange={state.setTab}>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="team">Team</TabsTrigger>
					<TabsTrigger value="evidence">Evidence</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<VStack gap="lg" align="stretch">
						<ExecutionLaneTimeline
							items={buildExecutionLaneTimeline(props.snapshot)}
						/>
						<CompletionStatusPanel completion={props.completion} />
					</VStack>
				</TabsContent>
				<TabsContent value="team" forceMount>
					<VStack gap="lg" align="stretch">
						<TeamWorkerBoard
							team={props.team}
							snapshot={props.snapshot}
							onNudgeWorker={props.onNudgeWorker}
						/>
						<TeamTaskTable snapshot={props.snapshot} />
						<MailboxViewer snapshot={props.snapshot} />
					</VStack>
				</TabsContent>
				<TabsContent value="evidence">
					<EvidenceDrawer
						snapshot={props.snapshot}
						selectedEvidenceId={state.selectedEvidenceId}
					/>
				</TabsContent>
			</Tabs>
		</VStack>
	);
}
