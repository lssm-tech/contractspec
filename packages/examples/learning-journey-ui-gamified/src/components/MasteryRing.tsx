'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

interface MasteryRingProps {
  label: string;
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'violet' | 'orange';
}

const sizeStyles = {
  sm: { container: 'h-16 w-16', text: 'text-xs', ring: 48, stroke: 4 },
  md: { container: 'h-24 w-24', text: 'text-sm', ring: 72, stroke: 6 },
  lg: { container: 'h-32 w-32', text: 'text-base', ring: 96, stroke: 8 },
};

const colorStyles = {
  green: 'stroke-green-500',
  blue: 'stroke-blue-500',
  violet: 'stroke-violet-500',
  orange: 'stroke-orange-500',
};

export function MasteryRing({
  label,
  percentage,
  size = 'md',
  color = 'violet',
}: MasteryRingProps) {
  const styles = sizeStyles[size];
  const radius = (styles.ring - styles.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-1',
        styles.container
      )}
    >
      <svg
        className="absolute -rotate-90"
        width={styles.ring}
        height={styles.ring}
        viewBox={`0 0 ${styles.ring} ${styles.ring}`}
      >
        {/* Background ring */}
        <circle
          cx={styles.ring / 2}
          cy={styles.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={styles.stroke}
          className="stroke-muted"
        />
        {/* Progress ring */}
        <circle
          cx={styles.ring / 2}
          cy={styles.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={styles.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-500', colorStyles[color])}
        />
      </svg>
      <div className="flex h-full flex-col items-center justify-center">
        <span className={cn('font-bold', styles.text)}>
          {Math.round(percentage)}%
        </span>
      </div>
      <span className={cn('text-muted-foreground mt-1 truncate', styles.text)}>
        {label}
      </span>
    </div>
  );
}
