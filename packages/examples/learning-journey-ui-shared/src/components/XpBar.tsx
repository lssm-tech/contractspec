'use client';

import { Progress } from '@lssm/lib.ui-kit-web/ui/progress';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import type { XpBarProps } from '../types';

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function XpBar({
  current,
  max,
  level,
  showLabel = true,
  size = 'md',
}: XpBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div
          className={cn(
            'flex items-center justify-between',
            labelSizeStyles[size]
          )}
        >
          <span className="text-muted-foreground font-medium">
            {level !== undefined && (
              <span className="text-primary mr-1">Lvl {level}</span>
            )}
            XP
          </span>
          <span className="font-semibold">
            {current.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <Progress
        value={percentage}
        className={cn('bg-muted', sizeStyles[size])}
      />
    </div>
  );
}

