'use client';

import {
	Button,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
/**
 * CRM Dashboard
 *
 * Fully integrated with ContractSpec example handlers
 * and design-system components.
 *
 * Commands wired:
 * - CreateDealContract -> Create Deal button + modal
 * - MoveDealContract -> Move deal between stages
 * - WinDealContract -> Mark deal as won
 * - LoseDealContract -> Mark deal as lost
 */
import { useCallback, useState } from 'react';
import { CrmPipelineBoard } from './CrmPipelineBoard';
import { type Deal, useDealList } from './hooks/useDealList';
import { useDealMutations } from './hooks/useDealMutations';
import { CreateDealModal } from './modals/CreateDealModal';
import { DealActionsModal } from './modals/DealActionsModal';
import { DealListTab } from './tables/DealListTab';

// type Tab = 'pipeline' | 'list' | 'metrics';

function formatCurrency(value: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

export function CrmDashboard() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
	const [isDealActionsOpen, setIsDealActionsOpen] = useState(false);

	const { data, dealsByStage, stages, loading, error, stats, refetch } =
		useDealList();

	const mutations = useDealMutations({
		onSuccess: () => {
			refetch();
		},
	});

	const handleDealClick = useCallback(
		(dealId: string) => {
			// Find deal in data
			const deal = dealsByStage
				? Object.values(dealsByStage)
						.flat()
						.find((d) => d.id === dealId)
				: null;

			if (deal) {
				setSelectedDeal(deal);
				setIsDealActionsOpen(true);
			}
		},
		[dealsByStage]
	);

	const handleDealMove = useCallback(
		async (dealId: string, toStageId: string) => {
			await mutations.moveDeal({ dealId, stageId: toStageId });
		},
		[mutations]
	);

	if (loading && !data) {
		return <LoaderBlock label="Loading CRM..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Failed to load CRM"
				description={error.message}
				onRetry={refetch}
				retryLabel="Retry"
			/>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Create Button */}
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">CRM Pipeline</h2>
				<Button onClick={() => setIsCreateModalOpen(true)}>
					<span className="mr-2">+</span> Create Deal
				</Button>
			</div>

			{/* Stats Row */}
			{stats && (
				<StatCardGroup>
					<StatCard
						label="Total Pipeline"
						value={formatCurrency(stats.totalValue)}
						hint={`${stats.total} deals`}
					/>
					<StatCard
						label="Open Deals"
						value={formatCurrency(stats.openValue)}
						hint={`${stats.openCount} active`}
					/>
					<StatCard
						label="Won"
						value={formatCurrency(stats.wonValue)}
						hint={`${stats.wonCount} closed`}
					/>
					<StatCard label="Lost" value={stats.lostCount} hint="deals lost" />
				</StatCardGroup>
			)}

			{/* Tabs */}
			<Tabs defaultValue="pipeline" className="w-full">
				<TabsList>
					<TabsTrigger value="pipeline">
						<span className="mr-2">📊</span>
						Pipeline
					</TabsTrigger>
					<TabsTrigger value="list">
						<span className="mr-2">📋</span>
						All Deals
					</TabsTrigger>
					<TabsTrigger value="metrics">
						<span className="mr-2">📈</span>
						Metrics
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pipeline" className="min-h-[400px]">
					<CrmPipelineBoard
						dealsByStage={dealsByStage}
						stages={stages}
						onDealClick={handleDealClick}
						onDealMove={handleDealMove}
					/>
				</TabsContent>

				<TabsContent value="list" className="min-h-[400px]">
					<DealListTab onDealClick={handleDealClick} />
				</TabsContent>

				<TabsContent value="metrics" className="min-h-[400px]">
					<MetricsTab stats={stats} />
				</TabsContent>
			</Tabs>

			{/* Create Deal Modal */}
			<CreateDealModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={async (input) => {
					await mutations.createDeal(input);
				}}
				stages={stages}
				isLoading={mutations.createState.loading}
			/>

			{/* Deal Actions Modal */}
			<DealActionsModal
				isOpen={isDealActionsOpen}
				deal={selectedDeal}
				stages={stages}
				onClose={() => {
					setIsDealActionsOpen(false);
					setSelectedDeal(null);
				}}
				onWin={async (input) => {
					await mutations.winDeal(input);
				}}
				onLose={async (input) => {
					await mutations.loseDeal(input);
				}}
				onMove={async (input) => {
					await mutations.moveDeal(input);
					refetch();
				}}
				isLoading={mutations.isLoading}
			/>
		</div>
	);
}

function MetricsTab({
	stats,
}: {
	stats: ReturnType<typeof useDealList>['stats'];
}) {
	if (!stats) return null;

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-border bg-card p-6">
				<h3 className="mb-4 font-semibold text-lg">Pipeline Overview</h3>
				<dl className="grid gap-4 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-sm">Win Rate</dt>
						<dd className="font-semibold text-2xl">
							{stats.total > 0
								? ((stats.wonCount / stats.total) * 100).toFixed(0)
								: 0}
							%
						</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">Avg Deal Size</dt>
						<dd className="font-semibold text-2xl">
							{formatCurrency(
								stats.total > 0 ? stats.totalValue / stats.total : 0
							)}
						</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">Conversion</dt>
						<dd className="font-semibold text-2xl">
							{stats.wonCount} / {stats.total}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
