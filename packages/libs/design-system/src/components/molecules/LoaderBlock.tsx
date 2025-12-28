import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { LoaderCircular } from '../atoms/LoaderCircular';

export interface LoaderBlockProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoaderBlock({
  label,
  description,
  className,
  size = 'md',
}: LoaderBlockProps) {
  return (
    <div className={cn('flex items-center justify-center p-6', className)}>
      <div className="inline-flex items-center gap-3">
        <LoaderCircular size={size} label={label} />
        {description ? (
          <span className="text-muted-foreground text-base">{description}</span>
        ) : null}
      </div>
    </div>
  );
}
