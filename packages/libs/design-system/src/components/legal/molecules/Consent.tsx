import * as React from 'react';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export function ConsentItem({
  id,
  label,
  description,
  checked,
  onChange,
  className,
}: {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v: boolean | 'indeterminate') => onChange(Boolean(v))}
      />
      <div>
        <label htmlFor={id} className="text-base font-medium">
          {label}
        </label>
        {description && (
          <div className="text-muted-foreground text-base">{description}</div>
        )}
      </div>
    </div>
  );
}

export function ConsentList({
  items,
  onChange,
  className,
}: {
  items: {
    id: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    checked: boolean;
  }[];
  onChange: (id: string, checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((it) => (
        <ConsentItem key={it.id} {...it} onChange={(c) => onChange(it.id, c)} />
      ))}
    </div>
  );
}
