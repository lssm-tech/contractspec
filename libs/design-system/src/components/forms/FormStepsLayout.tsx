import * as React from 'react';
import { Button } from '../atoms/Button';
import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface StepDef {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
}

export interface FormStepsLayoutProps {
  steps: StepDef[];
  initialStepKey?: string;
  onFinish?: () => void | Promise<void>;
  canNext?: (stepKey: string) => boolean;
  className?: string;
}

export function FormStepsLayout({
  steps,
  initialStepKey,
  onFinish,
  canNext,
  className,
}: FormStepsLayoutProps) {
  const indexByKey = React.useMemo(
    () => Object.fromEntries(steps.map((s, i) => [s.key, i])),
    [steps]
  );
  const [idx, setIdx] = React.useState<number>(() => {
    if (initialStepKey && initialStepKey in indexByKey)
      return indexByKey[initialStepKey] || 0;
    return 0;
  });
  const atFirst = idx === 0;
  const atLast = idx === steps.length - 1;
  const step = steps[idx];

  if (!step) {
    return null;
  }

  const handleNext = async () => {
    if (!atLast) {
      if (canNext && !canNext(step.key)) return;
      setIdx((i) => Math.min(i + 1, steps.length - 1));
    } else if (onFinish) {
      await onFinish();
    }
  };
  const handlePrev = () => setIdx((i) => Math.max(0, i - 1));

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="truncate text-lg font-medium">{step.title}</div>
        <div className="text-muted-foreground text-base">
          {idx + 1} / {steps.length}
        </div>
      </div>
      {step.description && (
        <div className="text-muted-foreground text-base">
          {step.description}
        </div>
      )}
      <Separator />
      <div>{step.content}</div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onPress={handlePrev} disabled={atFirst}>
          Back
        </Button>
        <Button onPress={handleNext}>{atLast ? 'Finish' : 'Next'}</Button>
      </div>
    </div>
  );
}
