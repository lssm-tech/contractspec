'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import type { StreakCounterProps } from '../types';

const sizeStyles = {
  sm: {
    container: 'gap-1 px-2 py-1',
    icon: 'text-base',
    text: 'text-xs',
  },
  md: {
    container: 'gap-1.5 px-3 py-1.5',
    icon: 'text-lg',
    text: 'text-sm',
  },
  lg: {
    container: 'gap-2 px-4 py-2',
    icon: 'text-xl',
    text: 'text-base',
  },
};

export function StreakCounter({
  days,
  isActive = true,
  size = 'md',
}: StreakCounterProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        styles.container,
        isActive
          ? 'bg-orange-500/10 text-orange-500'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <span className={styles.icon} role="img" aria-label="streak">
        🔥
      </span>
      <span className={styles.text}>
        {days} {days === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
}

