'use client';

export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  contactName: string;
  lastActivity: string;
}

interface CrmDealCardProps {
  deal: Deal;
  onSelect?: (deal: Deal) => void;
}

export function CrmDealCard({ deal, onSelect }: CrmDealCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div
      onClick={() => onSelect?.(deal)}
      className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 truncate">
          <h4 className="truncate font-medium">{deal.name}</h4>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {deal.company}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
          {formatCurrency(deal.value)}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
          {deal.probability}%
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="truncate">{deal.contactName}</span>
        <span>·</span>
        <span>{deal.lastActivity}</span>
      </div>
    </div>
  );
}

