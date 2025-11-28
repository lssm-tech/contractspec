'use client';

import { useState } from 'react';
import { CrmDealCard, type Deal } from './CrmDealCard';

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-zinc-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
];

const SAMPLE_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Enterprise License',
    company: 'TechCorp Inc',
    value: 120000,
    stage: 'proposal',
    probability: 60,
    contactName: 'John Smith',
    lastActivity: '2h ago',
  },
  {
    id: 'deal-2',
    name: 'Annual Subscription',
    company: 'StartupXYZ',
    value: 24000,
    stage: 'qualified',
    probability: 40,
    contactName: 'Sarah Johnson',
    lastActivity: '1d ago',
  },
  {
    id: 'deal-3',
    name: 'Consulting Package',
    company: 'MegaBank',
    value: 85000,
    stage: 'negotiation',
    probability: 75,
    contactName: 'Michael Chen',
    lastActivity: '3h ago',
  },
  {
    id: 'deal-4',
    name: 'Platform Migration',
    company: 'RetailCo',
    value: 45000,
    stage: 'lead',
    probability: 20,
    contactName: 'Emma Davis',
    lastActivity: '5h ago',
  },
  {
    id: 'deal-5',
    name: 'API Integration',
    company: 'FinServe',
    value: 32000,
    stage: 'won',
    probability: 100,
    contactName: 'Alex Wong',
    lastActivity: '2d ago',
  },
  {
    id: 'deal-6',
    name: 'Support Contract',
    company: 'HealthPlus',
    value: 18000,
    stage: 'proposal',
    probability: 55,
    contactName: 'Lisa Brown',
    lastActivity: '4h ago',
  },
];

export function CrmPipelineBoard() {
  const [deals] = useState<Deal[]>(SAMPLE_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const getDealsByStage = (stageId: string) =>
    deals.filter((deal) => deal.stage === stageId);

  const getStageTotal = (stageId: string) =>
    getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pipeline</h3>
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
        >
          Add Deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className="w-72 flex-shrink-0 rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                <span className="font-medium">{stage.name}</span>
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-700">
                  {getDealsByStage(stage.id).length}
                </span>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatCurrency(getStageTotal(stage.id))}
              </span>
            </div>

            <div className="space-y-2">
              {getDealsByStage(stage.id).map((deal) => (
                <CrmDealCard
                  key={deal.id}
                  deal={deal}
                  onSelect={setSelectedDeal}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDeal && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold">{selectedDeal.name}</h4>
              <p className="text-zinc-500 dark:text-zinc-400">
                {selectedDeal.company}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDeal(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Value</p>
              <p className="font-semibold">
                {formatCurrency(selectedDeal.value)}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Probability</p>
              <p className="font-semibold">{selectedDeal.probability}%</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Contact</p>
              <p className="font-semibold">{selectedDeal.contactName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

