'use client';

import {
	Box,
	Button,
	ErrorState,
	HStack,
	LoaderBlock,
	StatCard,
	StatCardGroup,
	Text,
	VStack,
} from '@contractspec/lib.design-system';
/**
 * Integration Hub Dashboard
 *
 * Interactive dashboard for the integration-hub template.
 * Displays integrations, connections, and sync configurations.
 */
import { useState } from 'react';
import { useIntegrationData } from './hooks/useIntegrationData';
import { IntegrationVisualizationOverview } from './IntegrationDashboard.visualizations';
import { IntegrationHubChat } from './IntegrationHubChat';
import { IntegrationHubCredentialSetupPreview } from './IntegrationHubCredentialSetupPreview';
import { ConnectionsTable, SyncConfigsTable } from './tables/IntegrationTables';

type Tab = 'integrations' | 'credentials' | 'connections' | 'syncs' | 'chat';

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
	const [credentialMode, setCredentialMode] = useState<'managed' | 'byok'>(
		'byok'
	);
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
		{ id: 'credentials', label: 'BYOK/env', icon: '🔐' },
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
		<VStack gap="lg" align="stretch">
			{/* Header */}
			<HStack className="items-center justify-between">
				<Text className="font-bold text-2xl">Integration Hub</Text>
				<Button onClick={() => alert('Add integration modal')}>
					<HStack className="items-center gap-2">
						<Text aria-hidden="true">+</Text>
						<Text>Add Integration</Text>
					</HStack>
				</Button>
			</HStack>

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

			<IntegrationVisualizationOverview
				connections={connections}
				integrations={integrations}
				syncConfigs={syncConfigs}
			/>

			{/* Navigation Tabs */}
			<Box className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
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
						<Text aria-hidden="true">{tab.icon}</Text>
						<Text>{tab.label}</Text>
					</Button>
				))}
			</Box>

			{/* Tab Content */}
			<Box className="min-h-[400px]" role="tabpanel">
				{activeTab === 'integrations' && (
					<Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{integrations.map((integration) => (
							<Box
								key={integration.id}
								className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
							>
								<HStack className="mb-3 items-center gap-3">
									<Text className="text-2xl">
										{TYPE_ICONS[integration.type] ?? '⚙️'}
									</Text>
									<VStack gap="xs" align="stretch">
										<Text className="font-medium">{integration.name}</Text>
										<Text className="text-muted-foreground text-sm">
											{integration.type}
										</Text>
									</VStack>
								</HStack>
								<HStack className="items-center justify-between">
									<Text
										className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${STATUS_COLORS[integration.status] ?? ''}`}
									>
										{integration.status}
									</Text>
									<Text className="text-muted-foreground text-xs">
										{integration.createdAt.toLocaleDateString()}
									</Text>
								</HStack>
							</Box>
						))}
						{integrations.length === 0 && (
							<Box className="col-span-full flex h-64 items-center justify-center">
								<Text className="text-muted-foreground">
									No integrations configured
								</Text>
							</Box>
						)}
					</Box>
				)}

				{activeTab === 'credentials' && (
					<IntegrationHubCredentialSetupPreview
						mode={credentialMode}
						onModeChange={setCredentialMode}
					/>
				)}

				{activeTab === 'connections' && (
					<ConnectionsTable connections={connections} />
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
					<SyncConfigsTable syncConfigs={syncConfigs} />
				)}
			</Box>
		</VStack>
	);
}
