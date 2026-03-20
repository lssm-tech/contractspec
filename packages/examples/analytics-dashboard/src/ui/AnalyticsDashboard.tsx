'use client';

import {
	Button,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
/**
 * Analytics Dashboard
 *
 * Interactive dashboard for the analytics-dashboard template.
 * Displays dashboards, widgets, and queries.
 */
import { useMemo, useState } from 'react';
import type { ResolvedAnalyticsWidget } from '../visualizations';
import { resolveAnalyticsWidget } from '../visualizations';
import { AnalyticsWidgetBoard } from './AnalyticsDashboard.widgets';
import { AnalyticsQueriesTable } from './AnalyticsQueriesTable';
import { useAnalyticsData } from './hooks/useAnalyticsData';

type Tab = 'dashboards' | 'queries';

const STATUS_COLORS: Record<string, string> = {
	PUBLISHED:
		'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
	ARCHIVED:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export function AnalyticsDashboard() {
	const [activeTab, setActiveTab] = useState<Tab>('dashboards');
	const {
		dashboards,
		queries,
		selectedDashboard,
		widgets,
		loading,
		error,
		stats,
		refetch,
		selectDashboard,
	} = useAnalyticsData();

	const tabs: { id: Tab; label: string; icon: string }[] = [
		{ id: 'dashboards', label: 'Dashboards', icon: '📊' },
		{ id: 'queries', label: 'Queries', icon: '🔍' },
	];
	const resolvedWidgets = useMemo(
		() =>
			widgets
				.map((widget) => resolveAnalyticsWidget(widget))
				.filter((widget): widget is ResolvedAnalyticsWidget => Boolean(widget)),
		[widgets]
	);

	if (loading) {
		return <LoaderBlock label="Loading Analytics..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Failed to load Analytics"
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
				<h2 className="font-bold text-2xl">Analytics Dashboard</h2>
				<Button onClick={() => alert('Create dashboard modal')}>
					<span className="mr-2">+</span> New Dashboard
				</Button>
			</div>

			{/* Stats Row */}
			<StatCardGroup>
				<StatCard
					label="Dashboards"
					value={stats.totalDashboards}
					hint={`${stats.publishedDashboards} published`}
				/>
				<StatCard
					label="Queries"
					value={stats.totalQueries}
					hint={`${stats.sharedQueries} shared`}
				/>
				<StatCard
					label="Widgets"
					value={widgets.length}
					hint="on current dashboard"
				/>
			</StatCardGroup>

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
				{activeTab === 'dashboards' && (
					<div className="space-y-6">
						{/* Dashboard List */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{dashboards.map((dashboard) => (
								<div
									key={dashboard.id}
									onClick={() => selectDashboard(dashboard)}
									className={`cursor-pointer rounded-lg border border-border bg-card p-4 transition-all ${
										selectedDashboard?.id === dashboard.id
											? 'ring-2 ring-primary'
											: 'hover:bg-muted/50'
									}`}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ')
											selectDashboard(dashboard);
									}}
								>
									<div className="mb-2 flex items-center justify-between">
										<h3 className="font-medium">{dashboard.name}</h3>
										<span
											className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[dashboard.status] ?? ''}`}
										>
											{dashboard.status}
										</span>
									</div>
									<p className="mb-3 text-muted-foreground text-sm">
										{dashboard.description}
									</p>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<span>/{dashboard.slug}</span>
										{dashboard.isPublic && (
											<span className="text-green-600 dark:text-green-400">
												🌐 Public
											</span>
										)}
									</div>
								</div>
							))}
							{dashboards.length === 0 && (
								<div className="col-span-full flex h-64 items-center justify-center text-muted-foreground">
									No dashboards created yet
								</div>
							)}
						</div>

						{selectedDashboard ? (
							<AnalyticsWidgetBoard
								dashboardName={selectedDashboard.name}
								widgets={resolvedWidgets}
							/>
						) : null}
					</div>
				)}

				{activeTab === 'queries' && <AnalyticsQueriesTable queries={queries} />}
			</div>
		</div>
	);
}
