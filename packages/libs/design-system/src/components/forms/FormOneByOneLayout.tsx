import * as React from 'react';
import { Button } from '../atoms/Button';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

export interface OneByOneFieldDef {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  input: React.ReactNode;
  validate?: () => boolean; // called before advancing
}

export interface FormOneByOneLayoutProps {
  fields: OneByOneFieldDef[];
  initialKey?: string;
  onComplete?: () => void | Promise<void>;
  className?: string;
}

export function FormOneByOneLayout({
  fields,
  initialKey,
  onComplete,
  className,
}: FormOneByOneLayoutProps) {
  const indexByKey = React.useMemo(
    () => Object.fromEntries(fields.map((f, i) => [f.key, i])),
    [fields]
  );
  const [idx, setIdx] = React.useState<number>(() => {
    if (initialKey && initialKey in indexByKey) {
      return indexByKey[initialKey] || 0;
    }
    return 0;
  });
  const atLast = idx === fields.length - 1;
  const field = fields[idx];

  if (!field) {
    return null;
  }

  const next = async () => {
    if (field.validate && !field.validate()) return;
    if (atLast) {
      await onComplete?.();
    } else {
      setIdx((i) => Math.min(i + 1, fields.length - 1));
    }
  };
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  return (
    <div
      className={cn(
        'flex min-h-[320px] flex-col items-stretch justify-between',
        className
      )}
    >
      <div className="space-y-2">
        <div className="text-lg font-medium">{field.title}</div>
        {field.description && (
          <div className="text-muted-foreground text-base">
            {field.description}
          </div>
        )}
        <div className="pt-2">{field.input}</div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onPress={prev} disabled={idx === 0}>
          Back
        </Button>
        <Button onPress={next}>{atLast ? 'Done' : 'Continue'}</Button>
      </div>
    </div>
  );
}
