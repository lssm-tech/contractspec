import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';
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

export function TeamTaskTable(props: { snapshot: LaneRuntimeSnapshot }) {
	const tasks = props.snapshot.team?.tasks ?? [];
	if (tasks.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tasks</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Task</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Worker</TableHead>
							<TableHead>Lease</TableHead>
							<TableHead>Evidence</TableHead>
							<TableHead>Retries</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks.map((task) => (
							<TableRow key={task.taskId}>
								<TableCell>{task.title}</TableCell>
								<TableCell>{task.status}</TableCell>
								<TableCell>{task.roleHint ?? 'any'}</TableCell>
								<TableCell>{task.claimedBy ?? 'unclaimed'}</TableCell>
								<TableCell>{task.lease?.expiresAt ?? 'none'}</TableCell>
								<TableCell>{task.evidenceBundleIds.length}</TableCell>
								<TableCell>{task.retryHistory.length}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
