'use client';

interface EngagementMeterProps {
  acknowledged: number;
  actioned: number;
  pending: number;
  streak?: number;
}

export function EngagementMeter({
  acknowledged,
  actioned,
  pending,
  streak = 0,
}: EngagementMeterProps) {
  const total = acknowledged + actioned + pending;
  const actionedPercent = total > 0 ? (actioned / total) * 100 : 0;
  const acknowledgedPercent = total > 0 ? (acknowledged / total) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Donut chart */}
      <div className="flex items-center justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="12"
              className="stroke-muted"
            />
            {/* Actioned (green) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${actionedPercent * 2.51} 251`}
              className="stroke-green-500 transition-all duration-500"
            />
            {/* Acknowledged (amber) - offset by actioned */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${acknowledgedPercent * 2.51} 251`}
              strokeDashoffset={`${-actionedPercent * 2.51}`}
              className="stroke-amber-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-muted-foreground text-xs">tips</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span>Actioned ({actioned})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span>Acknowledged ({acknowledged})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-muted h-3 w-3 rounded-full" />
          <span>Pending ({pending})</span>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-500/10 px-4 py-2">
          <span className="text-xl">🔥</span>
          <span className="font-semibold text-orange-500">
            {streak} day engagement streak!
          </span>
        </div>
      )}
    </div>
  );
}
