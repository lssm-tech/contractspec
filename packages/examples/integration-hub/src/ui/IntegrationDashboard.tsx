'use client';

import {
	Button,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
/**
 * Integration Hub Dashboard
 *
 * Interactive dashboard for the integration-hub template.
 * Displays integrations, connections, and sync configurations.
 */
import { useState } from 'react';
import { useIntegrationData } from './hooks/useIntegrationData';
import { IntegrationHubChat } from './IntegrationHubChat';

type Tab = 'integrations' | 'connections' | 'syncs' | 'chat';

const STATUS_COLORS: Record<string, string> = {
	ACTIVE:
		'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
	CONNECTED:
		'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	DISCONNECTED:
		'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
	PENDING:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
	ERROR: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
	PAUSED:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const TYPE_ICONS: Record<string, string> = {
	CRM: '📊',
	MARKETING: '📣',
	PAYMENT: '💳',
	COMMUNICATION: '💬',
	DATA: '🗄️',
	CUSTOM: '⚙️',
};

export function IntegrationDashboard() {
	const [activeTab, setActiveTab] = useState<Tab>('integrations');
	const {
		integrations,
		connections,
		syncConfigs,
		loading,
		error,
		stats,
		refetch,
	} = useIntegrationData();

	const tabs: { id: Tab; label: string; icon: string }[] = [
		{ id: 'integrations', label: 'Integrations', icon: '🔌' },
		{ id: 'connections', label: 'Connections', icon: '🔗' },
		{ id: 'syncs', label: 'Sync Configs', icon: '🔄' },
		{ id: 'chat', label: 'Chat', icon: '💬' },
	];

	if (loading) {
		return <LoaderBlock label="Loading Integrations..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Failed to load Integrations"
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
				<h2 className="font-bold text-2xl">Integration Hub</h2>
				<Button onClick={() => alert('Add integration modal')}>
					<span className="mr-2">+</span> Add Integration
				</Button>
			</div>

			{/* Stats Row */}
			<StatCardGroup>
				<StatCard
					label="Integrations"
					value={stats.totalIntegrations}
					hint={`${stats.activeIntegrations} active`}
				/>
				<StatCard
					label="Connections"
					value={stats.totalConnections}
					hint={`${stats.connectedCount} connected`}
				/>
				<StatCard
					label="Syncs"
					value={stats.totalSyncs}
					hint={`${stats.activeSyncs} active`}
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
				{activeTab === 'integrations' && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{integrations.map((integration) => (
							<div
								key={integration.id}
								className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
							>
								<div className="mb-3 flex items-center gap-3">
									<span className="text-2xl">
										{TYPE_ICONS[integration.type] ?? '⚙️'}
									</span>
									<div>
										<h3 className="font-medium">{integration.name}</h3>
										<p className="text-muted-foreground text-sm">
											{integration.type}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span
										className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[integration.status] ?? ''}`}
									>
										{integration.status}
									</span>
									<span className="text-muted-foreground text-xs">
										{integration.createdAt.toLocaleDateString()}
									</span>
								</div>
							</div>
						))}
						{integrations.length === 0 && (
							<div className="col-span-full flex h-64 items-center justify-center text-muted-foreground">
								No integrations configured
							</div>
						)}
					</div>
				)}

				{activeTab === 'connections' && (
					<div className="rounded-lg border border-border">
						<table className="w-full">
							<thead className="border-border border-b bg-muted/30">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Connection
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Status
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Last Sync
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{connections.map((conn) => (
									<tr key={conn.id} className="hover:bg-muted/50">
										<td className="px-4 py-3">
											<div className="font-medium">{conn.name}</div>
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[conn.status] ?? ''}`}
											>
												{conn.status}
											</span>
										</td>
										<td className="px-4 py-3 text-muted-foreground text-sm">
											{conn.lastSyncAt?.toLocaleString() ?? 'Never'}
										</td>
									</tr>
								))}
								{connections.length === 0 && (
									<tr>
										<td
											colSpan={3}
											className="px-4 py-8 text-center text-muted-foreground"
										>
											No connections found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'chat' && (
					<IntegrationHubChat
						proxyUrl="/api/chat"
						thinkingLevel="thinking"
						suggestions={[
							'List my integrations',
							'Show sync status',
							'Add a connection',
						]}
						className="min-h-[400px]"
					/>
				)}

				{activeTab === 'syncs' && (
					<div className="rounded-lg border border-border">
						<table className="w-full">
							<thead className="border-border border-b bg-muted/30">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Sync Config
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Frequency
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Status
									</th>
									<th className="px-4 py-3 text-left font-medium text-sm">
										Records
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{syncConfigs.map((sync) => (
									<tr key={sync.id} className="hover:bg-muted/50">
										<td className="px-4 py-3">
											<div className="font-medium">{sync.name}</div>
											<div className="text-muted-foreground text-sm">
												{sync.sourceEntity} → {sync.targetEntity}
											</div>
										</td>
										<td className="px-4 py-3 text-sm">{sync.frequency}</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[sync.status] ?? ''}`}
											>
												{sync.status}
											</span>
										</td>
										<td className="px-4 py-3 text-muted-foreground text-sm">
											{sync.recordsSynced.toLocaleString()}
										</td>
									</tr>
								))}
								{syncConfigs.length === 0 && (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-8 text-center text-muted-foreground"
										>
											No sync configurations found
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
