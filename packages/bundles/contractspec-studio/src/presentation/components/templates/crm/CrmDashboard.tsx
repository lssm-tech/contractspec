'use client';

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
import {
  Button,
  ErrorState,
  LoaderBlock,
  StatCard,
  StatCardGroup,
} from '@lssm/lib.design-system';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lssm/lib.ui-kit-web/ui/tabs';
import { type Deal, useDealList } from './hooks/useDealList';
import { useDealMutations } from './hooks/useDealMutations';
import { CrmPipelineBoard } from './CrmPipelineBoard';
import { CreateDealModal } from './modals/CreateDealModal';
import { DealActionsModal } from './modals/DealActionsModal';

type Tab = 'pipeline' | 'list' | 'metrics';

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
        <h2 className="text-2xl font-bold">CRM Pipeline</h2>
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
          <DealListTab data={data} onDealClick={handleDealClick} />
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

interface DealListTabProps {
  data: ReturnType<typeof useDealList>['data'];
  onDealClick?: (dealId: string) => void;
}

function DealListTab({ data, onDealClick }: DealListTabProps) {
  if (!data?.deals.length) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        No deals found
      </div>
    );
  }

  return (
    <div className="border-border rounded-lg border">
      <table className="w-full">
        <thead className="border-border bg-muted/30 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Deal</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Expected Close
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {data.deals.map((deal: Deal) => (
            <tr key={deal.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">
                <div className="font-medium">{deal.name}</div>
              </td>
              <td className="px-4 py-3 font-mono">
                {formatCurrency(deal.value, deal.currency)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    deal.status === 'WON'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : deal.status === 'LOST'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {deal.status}
                </span>
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {deal.expectedCloseDate?.toLocaleDateString() ?? '-'}
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => onDealClick?.(deal.id)}
                >
                  Actions
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <div className="border-border bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Pipeline Overview</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">Win Rate</dt>
            <dd className="text-2xl font-semibold">
              {stats.total > 0
                ? ((stats.wonCount / stats.total) * 100).toFixed(0)
                : 0}
              %
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Avg Deal Size</dt>
            <dd className="text-2xl font-semibold">
              {formatCurrency(
                stats.total > 0 ? stats.totalValue / stats.total : 0
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Conversion</dt>
            <dd className="text-2xl font-semibold">
              {stats.wonCount} / {stats.total}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
