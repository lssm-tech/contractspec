import type {
	LaneRuntimeSnapshot,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@contractspec/lib.ui-kit-web/ui/table';

export function TeamWorkerBoard(props: {
	team?: TeamStatusView;
	snapshot: LaneRuntimeSnapshot;
	onNudgeWorker?(workerId: string): void;
}) {
	const workers = props.snapshot.team?.workers ?? [];
	if (!props.team && workers.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Status</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Worker</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Task</TableHead>
							<TableHead>Heartbeat</TableHead>
							<TableHead>Progress</TableHead>
							{props.onNudgeWorker ? <TableHead>Actions</TableHead> : null}
						</TableRow>
					</TableHeader>
					<TableBody>
						{workers.map((worker) => (
							<TableRow key={worker.workerId}>
								<TableCell>{worker.workerId}</TableCell>
								<TableCell>{worker.status}</TableCell>
								<TableCell>{worker.roleProfile}</TableCell>
								<TableCell>{worker.currentTaskId ?? 'unassigned'}</TableCell>
								<TableCell>
									{describeHeartbeat(
										worker.workerId,
										worker.lastHeartbeatAt,
										props.team
									)}
								</TableCell>
								<TableCell>{worker.progressSummary ?? 'none'}</TableCell>
								{props.onNudgeWorker ? (
									<TableCell>
										<Button
											variant="outline"
											onClick={() => props.onNudgeWorker?.(worker.workerId)}
										>
											Nudge
										</Button>
									</TableCell>
								) : null}
							</TableRow>
						))}
						{props.team ? (
							<TableRow>
								<TableCell>summary</TableCell>
								<TableCell>{props.team.status}</TableCell>
								<TableCell>
									active {props.team.activeWorkers} / stale{' '}
									{props.team.staleWorkers}
								</TableCell>
								<TableCell>
									tasks {props.team.completedTasks}/{props.team.totalTasks}
								</TableCell>
								<TableCell>
									{props.team.staleWorkerIds.join(', ') || 'all fresh'}
								</TableCell>
								<TableCell>
									queue {props.team.queueSkew} / cleanup{' '}
									{props.team.cleanupStatus}
								</TableCell>
								{props.onNudgeWorker ? <TableCell>control</TableCell> : null}
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function describeHeartbeat(
	workerId: string,
	lastHeartbeatAt: string | undefined,
	team: TeamStatusView | undefined
) {
	if (!lastHeartbeatAt) {
		return 'missing';
	}
	if (team?.staleWorkerIds.includes(workerId)) {
		return `stale · ${lastHeartbeatAt}`;
	}
	return `fresh · ${lastHeartbeatAt}`;
}
