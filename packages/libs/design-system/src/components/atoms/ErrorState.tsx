import * as React from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@contractspec/lib.ui-kit-web/ui/empty';
import { Button } from '../atoms/Button';
import { ButtonLink } from '../atoms/ButtonLink';

export interface ErrorStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: React.ReactNode;
  supportHref?: string;
  onContactSupport?: () => void;
  supportLabel?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  icon,
  onRetry,
  retryLabel = 'Retry',
  supportHref,
  onContactSupport,
  supportLabel = 'Contact support',
  className,
}: ErrorStateProps) {
  const Support = (() => {
    if (supportHref) {
      return (
        <ButtonLink variant="ghost" href={supportHref}>
          {supportLabel}
        </ButtonLink>
      );
    }
    if (onContactSupport) {
      return (
        <Button variant="ghost" onPress={onContactSupport}>
          {supportLabel}
        </Button>
      );
    }
    return null;
  })();

  return (
    <Empty className={className}>
      <EmptyHeader>
        {icon}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center gap-2">
          {onRetry ? <Button onPress={onRetry}>{retryLabel}</Button> : null}
          {Support}
        </div>
      </EmptyContent>
    </Empty>
  );
}
