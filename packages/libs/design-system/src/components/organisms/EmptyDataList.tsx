import * as React from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@contractspec/lib.ui-kit-web/ui/empty';
import { Button } from '../atoms/Button';
import type { EmptyDataListProps } from './EmptyDataList.types';

export function EmptyDataList({
  emptyListTitle,
  emptyListDescription,
  createButton,
  secondaryButton,
  media,
  mediaVariant = 'icon',
  learnMoreHref,
  learnMoreLabel,
  learnMoreEndIcon,
  onLearnMore,
  handleLearnMore,
  className,
}: EmptyDataListProps) {
  const learnMore = onLearnMore ?? handleLearnMore;

  return (
    <Empty className={className}>
      <EmptyHeader>
        {media ? <EmptyMedia variant={mediaVariant}>{media}</EmptyMedia> : null}
        {emptyListTitle ? <EmptyTitle>{emptyListTitle}</EmptyTitle> : null}
        {emptyListDescription ? (
          <EmptyDescription>{emptyListDescription}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          {createButton}
          {secondaryButton}
        </div>
      </EmptyContent>
      {(learnMoreHref || learnMore) && learnMoreLabel ? (
        <Button
          variant="link"
          asChild={Boolean(learnMoreHref)}
          className="text-muted-foreground"
          size="sm"
          onPress={learnMoreHref ? undefined : learnMore}
        >
          {learnMoreHref ? (
            <a href={learnMoreHref}>
              {learnMoreLabel} {learnMoreEndIcon}
            </a>
          ) : (
            <span>
              {learnMoreLabel} {learnMoreEndIcon}
            </span>
          )}
        </Button>
      ) : null}
    </Empty>
  );
}
