'use client';

import {
	Button,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
/**
 * Workflow Dashboard
 *
 * Interactive dashboard for the workflow-system template.
 * Displays workflow definitions and instances with stats.
 */
import { useState } from 'react';
import { useWorkflowList } from './hooks/useWorkflowList';
import { WorkflowVisualizationOverview } from './WorkflowDashboard.visualizations';

type Tab = 'definitions' | 'instances';

const STATUS_COLORS: Record<string, string> = {
	ACTIVE:
		'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
	ARCHIVED:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
	PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
	IN_PROGRESS:
		'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
	COMPLETED:
		'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
	CANCELLED: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function WorkflowDashboard() {
	const [activeTab, setActiveTab] = useState<Tab>('definitions');
	const { definitions, instances, loading, error, stats, refetch } =
		useWorkflowList();

	const tabs: { id: Tab; label: string; icon: string }[] = [
		{ id: 'definitions', label: 'Definitions', icon: '📋' },
		{ id: 'instances', label: 'Instances', icon: '🔄' },
	];

	if (loading) {
		return <LoaderBlock label="Loading Workflows..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Failed to load Workflows"
				description={error.message}
				onRetry={refetch}
				retryLabel="Retry"
			/>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Workflow System</h2>
				<Button onClick={() => void refetch()}>Refresh</Button>
			</div>

			{/* Stats Row */}
			<StatCardGroup>
				<StatCard
					label="Workflows"
					value={stats.totalDefinitions}
					hint={`${stats.activeDefinitions} active`}
				/>
				<StatCard
					label="Instances"
					value={stats.totalInstances}
					hint="total runs"
				/>
				<StatCard
					label="Awaiting Action"
					value={stats.pendingInstances + stats.inProgressInstances}
					hint="open approvals"
				/>
				<StatCard
					label="Completed"
					value={stats.completedInstances}
					hint="finished"
				/>
			</StatCardGroup>

			<WorkflowVisualizationOverview instances={instances} />

			{/* Navigation Tabs */}
			<nav className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
				{tabs.map((tab) => (
					<Button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={activeTab === tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors ${
							activeTab === tab.id
								? 'bg-background text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span>{tab.icon}</span>
						{tab.label}
					</Button>
				))}
			</nav>

			{/* Tab Content */}
			<div className="min-h-[400px]" role="tabpanel">
				{activeTab === 'definitions' && (
					<div className="rounded-lg border border-border">
						<table className="w-full">
							<thead className="border-border border-b bg-muted/30">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Name
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Type
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Status
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Created
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{definitions.map((def) => (
									<tr key={def.id} className="hover:bg-muted/50">
										<td className="px-4 py-3">
											<div className="font-medium">{def.name}</div>
											<div className="text-muted-foreground text-sm">
												{def.description}
											</div>
										</td>
										<td className="px-4 py-3 font-mono text-sm">{def.type}</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[def.status] ?? ''}`}
											>
												{def.status}
											</span>
										</td>
										<td className="px-4 py-3 text-muted-foreground text-sm">
											{def.createdAt.toLocaleDateString()}
										</td>
									</tr>
								))}
								{definitions.length === 0 && (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-8 text-center text-muted-foreground"
										>
											No workflow definitions found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'instances' && (
					<div className="rounded-lg border border-border">
						<table className="w-full">
							<thead className="border-border border-b bg-muted/30">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Instance ID
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Status
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Requested By
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Started
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{instances.map((inst) => (
									<tr key={inst.id} className="hover:bg-muted/50">
										<td className="px-4 py-3 font-mono text-sm">{inst.id}</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[inst.status] ?? ''}`}
											>
												{inst.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm">{inst.requestedBy}</td>
										<td className="px-4 py-3 text-muted-foreground text-sm">
											{inst.startedAt.toLocaleDateString()}
										</td>
									</tr>
								))}
								{instances.length === 0 && (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-8 text-center text-muted-foreground"
										>
											No workflow instances found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
