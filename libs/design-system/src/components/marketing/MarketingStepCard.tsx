import * as React from 'react';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardHeader,
  MarketingCardTitle,
  type MarketingCardTone,
} from './MarketingCard';

interface MarketingStepCardProps {
  step: number | string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: MarketingCardTone;
}

export function MarketingStepCard({
  step,
  title,
  description,
  tone = 'default',
}: MarketingStepCardProps) {
  return (
    <MarketingCard tone={tone}>
      <MarketingCardHeader>
        <HStack gap="md" align="center" className="w-full">
          <div className="bg-primary/15 flex h-10 w-10 items-center justify-center rounded-lg">
            <Small className="text-primary font-semibold">{step}</Small>
          </div>
          <MarketingCardTitle className="text-lg">{title}</MarketingCardTitle>
        </HStack>
      </MarketingCardHeader>
      {description ? (
        <MarketingCardContent>
          <VStack gap="sm">
            <Muted className="text-sm leading-relaxed">{description}</Muted>
          </VStack>
        </MarketingCardContent>
      ) : null}
    </MarketingCard>
  );
}
