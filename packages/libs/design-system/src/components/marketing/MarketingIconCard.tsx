import * as React from 'react';
import { HStack, VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Muted } from '@lssm/lib.ui-kit-web/ui/typography';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardHeader,
  MarketingCardTitle,
  type MarketingCardTone,
} from './MarketingCard';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

interface MarketingIconCardProps {
  icon: IconComponent;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: MarketingCardTone;
  iconClassName?: string;
  headerAction?: React.ReactNode;
}

export function MarketingIconCard({
  icon: Icon,
  title,
  description,
  tone = 'default',
  iconClassName,
  headerAction,
}: MarketingIconCardProps) {
  return (
    <MarketingCard tone={tone}>
      <MarketingCardHeader className="space-y-3">
        <HStack gap="sm" align="center" justify="between" className="w-full">
          <Icon className={iconClassName} size={24} />
          {headerAction}
        </HStack>
        <MarketingCardTitle className="text-xl">{title}</MarketingCardTitle>
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
