'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

interface DayCalendarProps {
  totalDays: number;
  currentDay: number;
  completedDays: number[];
}

export function DayCalendar({
  totalDays,
  currentDay,
  completedDays,
}: DayCalendarProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;
        const isLocked = day > currentDay;

        return (
          <div
            key={day}
            className={cn(
              'flex h-12 w-12 flex-col items-center justify-center rounded-lg border text-sm font-medium transition-all',
              isCompleted && 'border-green-500 bg-green-500/10 text-green-500',
              isCurrent &&
                !isCompleted &&
                'border-violet-500 bg-violet-500/10 text-violet-500 ring-2 ring-violet-500/50',
              isLocked && 'border-muted bg-muted/50 text-muted-foreground',
              !isCompleted && !isCurrent && !isLocked && 'border-border bg-card'
            )}
          >
            {isCompleted ? (
              <span className="text-lg">✓</span>
            ) : isLocked ? (
              <span className="text-lg">🔒</span>
            ) : (
              <>
                <span className="text-muted-foreground text-xs">Day</span>
                <span>{day}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

