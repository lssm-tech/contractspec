'use client';

/**
 * CRM Deal Card - Individual deal card for kanban board
 */
import type { Deal } from '@lssm/example.crm-pipeline/handlers';

interface CrmDealCardProps {
  deal: Deal;
  onClick?: () => void;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CrmDealCard({ deal, onClick }: CrmDealCardProps) {
  const daysUntilClose = deal.expectedCloseDate
    ? Math.ceil(
        (deal.expectedCloseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Deal Name */}
      <h4 className="font-medium leading-snug">{deal.name}</h4>

      {/* Deal Value */}
      <div className="mt-2 text-lg font-semibold text-primary">
        {formatCurrency(deal.value, deal.currency)}
      </div>

      {/* Meta Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        {/* Expected Close */}
        {daysUntilClose !== null && (
          <span
            className={
              daysUntilClose < 0
                ? 'text-red-500'
                : daysUntilClose <= 7
                  ? 'text-yellow-600 dark:text-yellow-500'
                  : ''
            }
          >
            {daysUntilClose < 0
              ? `${Math.abs(daysUntilClose)}d overdue`
              : daysUntilClose === 0
                ? 'Due today'
                : `${daysUntilClose}d left`}
          </span>
        )}

        {/* Status Badge */}
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
            deal.status === 'WON'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : deal.status === 'LOST'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          {deal.status}
        </span>
      </div>
    </div>
  );
}
