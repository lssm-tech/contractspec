import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}) => {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <Loader2
        className={cn('text-primary-600 animate-spin', sizeClasses[size])}
      />
      {text && <p className="animate-pulse text-base text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loading components for better UX
export const SkeletonLine: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn('h-4 animate-pulse rounded-xs bg-gray-200', className)} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn(
      'animate-pulse space-y-3 rounded-lg bg-gray-200 p-4',
      className
    )}
  >
    <SkeletonLine className="h-6 w-3/4" />
    <SkeletonLine className="h-4 w-full" />
    <SkeletonLine className="h-4 w-2/3" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonLine key={j} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);
