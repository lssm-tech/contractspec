import * as React from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@lssm/lib.ui-kit/ui/empty';
import { HStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Text } from '@lssm/lib.ui-kit-web/ui/text';
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
        {emptyListTitle ? (
          <EmptyTitle>
            <Text>{emptyListTitle}</Text>
          </EmptyTitle>
        ) : null}
        {emptyListDescription ? (
          <EmptyDescription>
            <Text>{emptyListDescription}</Text>
          </EmptyDescription>
        ) : null}
      </EmptyHeader>
      <EmptyContent>
        <HStack className="gap-2">
          {createButton}
          {/*{secondaryButton}*/}
        </HStack>
      </EmptyContent>
      {/*{(learnMoreHref || learnMore) && learnMoreLabel ? (*/}
      {/*  learnMoreHref ? (*/}
      {/*    <ButtonLink*/}
      {/*      href={learnMoreHref}*/}
      {/*      variant="link"*/}
      {/*      className="text-muted-foreground"*/}
      {/*      size="sm"*/}
      {/*      onPress={learnMoreHref ? undefined : learnMore}*/}
      {/*    >*/}
      {/*      <Text>*/}
      {/*        {learnMoreLabel} {learnMoreEndIcon}*/}
      {/*      </Text>*/}
      {/*    </ButtonLink>*/}
      {/*  ) : (*/}
      {/*    <Text>*/}
      {/*      {learnMoreLabel} {learnMoreEndIcon}*/}
      {/*    </Text>*/}
      {/*  )*/}
      {/*) : null}*/}
    </Empty>
  );
}

export default EmptyDataList;
